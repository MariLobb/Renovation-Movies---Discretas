
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { listGenres, seed, build, recommend } from './recommender.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname,'../public');
const DATA_DIR = path.resolve(__dirname,'../data');

async function ensureData(){ await fs.mkdir(DATA_DIR, { recursive: true }); }

app.get('/api/genres', async (req,res)=>{
  try{ const genres = await listGenres(String(req.query.lang||process.env.APP_LANG||'es')); res.json({ ok:true, genres }); }
  catch(e){ res.status(500).json({ ok:false, error: (e as any).message }); }
});

app.post('/api/seed', async (req,res)=>{
  try{
    await ensureData();
    let { minYear, maxYear, limit, genreId, lang } = req.body||{};
    const HARD_CAP = 1000;
    if (!(typeof limit === 'number' && isFinite(limit) && limit > 0)) {
      limit = undefined; // traer "todas" hasta HARD_CAP
    } else {
      limit = Math.min(limit, HARD_CAP);
    }
    const movies = await seed({ minYear, maxYear, limit, genreId, lang });
    await fs.writeFile(path.join(DATA_DIR,'seed.json'), JSON.stringify(movies,null,2));
    res.json({ ok:true, count: movies.length, titles: movies.map(m=>m.title) });
  }catch(e){ res.status(500).json({ ok:false, error: (e as any).message }); }
});

app.post('/api/graph', async (_req,res)=>{
  try{ await ensureData(); const g = await build(); const edges = Object.values(g.movieAdj).reduce((a,b)=>a+b.size,0)/2; res.json({ ok:true, nodes: Object.keys(g.movies).length, edges }); }
  catch(e){ res.status(500).json({ ok:false, error: (e as any).message }); }
});

app.post('/api/recommend', async (req,res)=>{
  try{
    const { seeds, algo, k } = req.body || {};
    // Clamp k por seguridad (1..50) con valor por defecto 5
    const kNum = Math.min(Math.max(Number(k) || 5, 1), 50);
    const r = await recommend({ seeds: seeds||[], algo: algo||'bfs', k: kNum, withPopularity:true });
    res.json({ ok:true, results: r });
  } catch(e){
    res.status(500).json({ ok:false, error: (e as any).message });
  }
});

app.use('/data', express.static(DATA_DIR));
app.use('/', express.static(PUBLIC_DIR));

const port = Number(process.env.PORT||5173);
app.listen(port, ()=>console.log(`Recomendador TMDb listo en http://localhost:${port}`));
