
import { Graph, Movie } from './types.js';

export function buildGraph(moviesArr: Movie[]): Graph & { weighted: Record<string, Record<string, number>> }{
  const movies: Record<string, Movie> = {};
  const byActor: Record<string, Set<string>> = {};
  const byGenre: Record<string, Set<string>> = {};

  for (const m of moviesArr){
    movies[m.title] = m;
    for (const a of m.cast) (byActor[a] ||= new Set()).add(m.title);
    for (const g of m.genres) (byGenre[g] ||= new Set()).add(m.title);
  }
  const movieAdj: Graph['movieAdj'] = {};
  const weighted: Record<string, Record<string, number>> = {};
  const connect=(u:string,v:string,w:number)=>{
    (movieAdj[u] ||= new Set()).add(v); (movieAdj[v] ||= new Set()).add(u);
    (weighted[u] ||= {})[v] = ((weighted[u]||{})[v]||0)+w;
    (weighted[v] ||= {})[u] = ((weighted[v]||{})[u]||0)+w;
  };
  // Actor 2
  for (const group of Object.values(byActor)){
    const arr = Array.from(group);
    for (let i=0;i<arr.length;i++) for (let j=i+1;j<arr.length;j++) connect(arr[i],arr[j],2);
  }
  // Género 1
  for (const group of Object.values(byGenre)){
    const arr = Array.from(group);
    for (let i=0;i<arr.length;i++) for (let j=i+1;j<arr.length;j++) connect(arr[i],arr[j],1);
  }
  for (const t of Object.keys(movies)) movieAdj[t] ||= new Set();
  return { movies, movieAdj, weighted };
}

export function multiSourceBFSDistance(adj: Record<string, Set<string>>, sources: string[]){
  const dist=new Map<string,number>(); const q:string[]=[]; for (const s of sources){ if(adj[s]){ dist.set(s,0); q.push(s);} }
  while(q.length){ const u=q.shift()!; for (const v of adj[u]) if(!dist.has(v)){ dist.set(v,(dist.get(u)||0)+1); q.push(v);} }
  return dist;
}

export function multiSourceDijkstra(weighted: Record<string, Record<string, number>>, sources: string[]){
  const cost=new Map<string,number>(); const vis=new Set<string>();
  for (const u of Object.keys(weighted)) cost.set(u, Infinity);
  for (const s of sources) if (weighted[s]) cost.set(s,0);
  while(true){ let u:null|string=null, best=Infinity; for (const [n,c] of cost) if(!vis.has(n)&&c<best){best=c;u=n;} if(u===null)break; vis.add(u);
    for (const [v,w] of Object.entries(weighted[u]||{})){ const alt=best+1/Number(w); if(alt<(cost.get(v)||Infinity)) cost.set(v,alt);} }
  return cost;
}
