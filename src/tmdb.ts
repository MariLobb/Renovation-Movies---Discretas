
import dotenv from 'dotenv'; dotenv.config();
const API = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '';

function langToTmdb(lang: string){
  if(!lang) return 'en-US';
  if(lang==='es') return 'es-ES';
  if(lang==='en') return 'en-US';
  return `${lang}-${lang.toUpperCase()}`;
}

async function tmdbGet(path: string, params: Record<string, any>={}){
  const qp = new URLSearchParams({ api_key: API_KEY, ...Object.fromEntries(Object.entries(params).filter(([_,v])=>v!==undefined && v!==null)) });
  const url = `${API}${path}?${qp.toString()}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if(!res.ok) throw new Error(`TMDb error ${res.status}`);
  return res.json();
}

export async function fetchGenres(lang='es'){
  const data = await tmdbGet('/genre/movie/list', { language: langToTmdb(lang) });
  return data.genres as {id:number,name:string}[];
}

export async function discoverMovies({ minYear=2018, maxYear, limit, genreId, lang='es' }:{ minYear?:number; maxYear?:number; limit?:number; genreId?:number; lang?:string; }){
  const out: any[] = [];
  const language = langToTmdb(lang);
  let page=1;
  const PAGE_MAX = 500;     // seguridad
  const HARD_CAP = 1000;   // tope solicitado

  let yMin = minYear;
  let yMax = maxYear;
  if (typeof yMax === 'number' && yMax < yMin) { const tmp = yMin; yMin = yMax; yMax = tmp; }

  const target = Math.min((typeof limit === 'number' && isFinite(limit) && limit > 0) ? limit : HARD_CAP, HARD_CAP);

  while(out.length < target && page <= PAGE_MAX){
    const params: Record<string, any> = {
      language,
      sort_by: 'popularity.desc',
      include_adult: false,
      'primary_release_date.gte': `${yMin}-01-01`,
      page
    };
    if (genreId) params['with_genres'] = genreId;
    if (typeof yMax === 'number') params['primary_release_date.lte'] = `${yMax}-12-31`;

    const data = await tmdbGet('/discover/movie', params);
    const results = data?.results || [];
    if (!results.length) break;

    for (const m of results){
      out.push({ id: m.id, title: m.title, original_title: m.original_title, release_date: m.release_date, poster_path: m.poster_path });
      if(out.length>=target) break;
    }
    page++;
  }
  return out;
}

export function posterUrl(path?: string){
  if(!path) return '';
  const size = process.env.TMDB_POSTER_SIZE || 'w342';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function detailsWithCredits(ids:number[], lang='es'){
  const language = langToTmdb(lang);
  const out: Record<number, any> = {};
  for (const id of ids){
    const d = await tmdbGet(`/movie/${id}`, { language, append_to_response: 'credits' });
    const year = d.release_date ? Number(String(d.release_date).slice(0,4)) : NaN;
    const cast = (d.credits?.cast||[]).slice(0,8).map((p:any)=>p.name);
    const genres = (d.genres||[]).map((g:any)=>g.name);
    out[id] = { id, title: d.title, original_title: d.original_title, year, cast, genres, poster: posterUrl(d.poster_path) };
  }
  return out;
}
