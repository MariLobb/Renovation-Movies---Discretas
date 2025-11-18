
import dotenv from 'dotenv'; dotenv.config();

export async function fetchPagesInfo(titles: string[], lang=(process.env.APP_LANG||'es')){
  const base = `https://${lang}.wikipedia.org/w/api.php`;
  const chunk = (a:any[],n:number)=>a.reduce((acc,_,i)=>(i%n?acc:[...acc,a.slice(i,i+n)]),[] as any[][]);
  const batches = chunk(titles, 40);
  const results: Record<string, any> = {};
  for (const b of batches){
    const url = `${base}?action=query&format=json&formatversion=2&prop=extracts|info&exintro=1&explaintext=1&inprop=url&titles=${encodeURIComponent(b.join('|'))}`;
    const res = await fetch(url, { headers:{'Accept':'application/json'} });
    if(!res.ok) continue;
    const data = await res.json();
    for (const p of data.query.pages||[]){
      results[p.title] = { title: p.title, extract: p.extract||'', fullurl: p.fullurl };
    }
  }
  return results;
}

export async function fetchPageviews(titles: string[], lang=(process.env.APP_LANG||'es')){
  const days = Number(process.env.PAGEVIEWS_DAYS||90);
  const end = new Date();
  const start = new Date(end.getTime()-days*24*3600*1000);
  const pad=(n:number)=>String(n).padStart(2,'0');
  const fmt=(d:Date)=>`${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}`;
  const startStr=fmt(start); const endStr=fmt(end);
  const out: Record<string,number>={};
  for (const t of titles){
    const article = encodeURIComponent(t.replace(/ /g,'_'));
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${lang}.wikipedia.org/all-access/all-agents/${article}/daily/${startStr}/${endStr}`;
    try{ const r=await fetch(url, { headers:{'Accept':'application/json'} }); const j=await r.json(); out[t]=(j.items||[]).reduce((a:any,b:any)=>a+Number(b.views||0),0); }
    catch{ out[t]=0; }
  }
  return out;
}
