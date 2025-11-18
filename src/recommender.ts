
import fs from 'fs/promises';
import path from 'path';
import { fetchGenres, discoverMovies, detailsWithCredits } from './tmdb.js';
import { fetchPagesInfo, fetchPageviews } from './wikipedia.js';
import { buildGraph, multiSourceBFSDistance, multiSourceDijkstra } from './graph.js';
import { Movie } from './types.js';

async function ensureDataDir(){ await fs.mkdir('data', { recursive: true }); }

export async function listGenres(lang?: string){ return fetchGenres(lang||process.env.APP_LANG||'es'); }

export async function seed({ minYear, maxYear, limit, genreId, lang }:{ minYear?:number; maxYear?:number; limit?:number; genreId?:number; lang?:string; }){
  const lang2 = lang || process.env.APP_LANG || 'es';
  await ensureDataDir();
  const base = await discoverMovies({ minYear, maxYear, limit, genreId, lang: lang2 });
  const details = await detailsWithCredits(base.map(x=>x.id), lang2);
  const titles = base.map(x=>details[x.id]?.title || x.title);
  const pages = await fetchPagesInfo(titles, lang2);

  const movies: Movie[] = base.map(x=>{
    const d = details[x.id];
    const year = d?.year || (x.release_date? Number(String(x.release_date).slice(0,4)): NaN);
    const title = d?.title || x.title;
    const page = pages[title] || {};
    return {
      id: x.id,
      title,
      original_title: d?.original_title,
      year: year||0,
      cast: d?.cast||[],
      genres: d?.genres||[],
      href: page.fullurl || `https://${lang2}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g,'_'))}`,
      extract: page.extract || '',
      poster: d?.poster || ''
    };
  });

  await fs.writeFile(path.join('data','seed.json'), JSON.stringify(movies, null, 2), 'utf-8');
  return movies;
}

export async function build(){
  await ensureDataDir();
  const movies: Movie[] = JSON.parse(await fs.readFile(path.join('data','seed.json'),'utf-8'));
  const g = buildGraph(movies);
  const out = { movies: g.movies, movieAdj: Object.fromEntries(Object.entries(g.movieAdj).map(([k,v])=>[k,Array.from(v)])), weighted: g.weighted };
  await fs.writeFile(path.join('data','graph.json'), JSON.stringify(out, null, 2), 'utf-8');
  return g;
}

export async function recommend({ seeds, algo='bfs', k=5, withPopularity=true }:{ seeds:string[]; algo?:'bfs'|'dijkstra'; k?:number; withPopularity?:boolean; }){
  const g = JSON.parse(await fs.readFile(path.join('data','graph.json'),'utf-8'));
  const movies = g.movies as Record<string, Movie>;
  const adj = Object.fromEntries(Object.entries(g.movieAdj).map(([k,arr]:any)=>[k,new Set(arr)]));
  const weighted = g.weighted as Record<string, Record<string, number>>;
  const seeds2 = seeds.filter(s=>movies[s]);
  if (seeds2.length < 1) throw new Error('Selecciona al menos 1 película.');

  const castSet = new Set<string>(); const genSet = new Set<string>();
  for (const s of seeds2){ for (const a of movies[s].cast) castSet.add(a); for (const ge of movies[s].genres) genSet.add(ge); }

  const dist = (algo==='bfs') ? multiSourceBFSDistance(adj, seeds2) : multiSourceDijkstra(weighted, seeds2);

  const candidates = Object.keys(movies).filter(t=>!seeds2.includes(t));
  const feats = candidates.map(t=>{
    const m = movies[t];
    const sharedActors = m.cast.filter(a=>castSet.has(a)).length;
    const sharedGenres = m.genres.filter(g=>genSet.has(g)).length;
    const d = dist.get(t) ?? 1e6;
    const raw = 1.0*sharedActors + 0.7*sharedGenres - 0.5*d;
    return { title:t, raw, sharedActors, sharedGenres, dist: (dist.get(t) ?? null) };
  });
  let minR=Infinity, maxR=-Infinity; for (const f of feats){ if(f.raw<minR)minR=f.raw; if(f.raw>maxR)maxR=f.raw; }
  const norm=(x:number)=> (maxR<=minR? 2.5 : 5*(x-minR)/(maxR-minR));
  feats.forEach(f=> (f as any).score = Number(norm(f.raw).toFixed(2)) );

  let views: Record<string, number>={};
  if(withPopularity){ const topNames=feats.sort((a,b)=>b.raw-a.raw).slice(0,50).map(x=>x.title); views = await fetchPageviews(topNames, process.env.APP_LANG||'es'); }

  feats.sort((a,b)=> ((b as any).score-(a as any).score) || ((views[b.title]||0)-(views[a.title]||0)) || a.title.localeCompare(b.title));
  const result = feats.slice(0, k).map(f=>({
    title: f.title,
    score: (f as any).score,
    popularity: views[f.title]||0,
    reasons: { sharedActors: f.sharedActors, sharedGenres: f.sharedGenres, distance: f.dist },
    ...movies[f.title]
  }));
  return result;
}
