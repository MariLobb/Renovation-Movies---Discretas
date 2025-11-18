
const $ = (q)=>document.querySelector(q);
const api = (path, opts={})=> fetch(path, { headers:{'Content-Type':'application/json'}, ...opts }).then(r=>r.json());
let selectedSeeds = new Set();
let seedsData = []; // [{title, poster, year, extract, genres, cast, href}]

// ========= Overlay / Modal helpers =========
const overlay = $('#overlay');
const modalClose = $('#modalClose');
const modalTitle = $('#modalTitle');
const modalWiki = $('#modalWiki');
const modalPoster = $('#modalPoster');
const modalName = $('#modalName');
const modalYear = $('#modalYear');
const modalChips = $('#modalChips');
const modalExtract = $('#modalExtract');
const modalCast = $('#modalCast');
const modalReasons = $('#modalReasons');

function openModal(movie, extraReasons){
  modalTitle.textContent = 'Detalles';
  modalName.textContent = movie.title || '';
  modalYear.textContent = movie.year ? `Año: ${movie.year}` : '';
  modalPoster.src = movie.poster || '';
  modalPoster.alt = movie.title || '';
  modalChips.innerHTML = (movie.genres||[]).map(g=>`<span class="chip">${g}</span>`).join('');
  modalExtract.textContent = movie.extract || '';
  modalCast.innerHTML = movie.cast?.length ? `<small><strong>Reparto:</strong> ${movie.cast.join(', ')}</small>` : '';
  modalWiki.href = movie.href || '#';
  if (extraReasons){
    const { sharedActors, sharedGenres, distance } = extraReasons;
    modalReasons.innerHTML = `Actores en común: <strong>${sharedActors}</strong> · Géneros en común: <strong>${sharedGenres}</strong>` + (distance!=null? ` · Distancia: <strong>${distance}</strong>`:'');
  } else {
    modalReasons.innerHTML = '';
  }
  overlay.classList.add('show');
}
function closeModal(){ overlay.classList.remove('show'); }
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closeModal(); });
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && overlay.classList.contains('show')) closeModal(); });

// ========= Géneros =========
async function loadGenres(){
  const lang = ($('#lang').value||'es').trim();
  const res = await api(`/api/genres?lang=${encodeURIComponent(lang)}`);
  const sel = $('#genre'); sel.innerHTML='';
  const opt0=document.createElement('option'); opt0.value=''; opt0.textContent='Todos'; sel.appendChild(opt0);
  if(!res.ok || !res.genres?.length){ $('#seedMsg').textContent='No se pudieron cargar géneros (TMDb).'; return; }
  res.genres.forEach(g=>{ const o=document.createElement('option'); o.value=g.id; o.textContent=g.name; sel.appendChild(o); });
  $('#seedMsg').textContent=`Géneros: ${res.genres.length}`;
}
window.addEventListener('load', loadGenres);
$('#btnLoadGenres').addEventListener('click', loadGenres);

// ========= Semillas =========
function toSmallPoster(url){
  if(!url) return url;
  try{ return url.replace(/(image\.tmdb\.org\/t\/p\/)(?:w\d+|original)/, '$1w92'); }catch{ return url; }
}

function renderSeeds(list){
  const div = $('#seedList'); div.innerHTML='';
  list.forEach(m=>{
    const it = document.createElement('label'); it.className='item'; it.dataset.title = m.title.toLowerCase();
    const inner = document.createElement('div'); inner.className='seed-item';
    const cb = document.createElement('input'); cb.type='checkbox'; cb.checked = selectedSeeds.has(m.title);
    cb.addEventListener('click',(ev)=>ev.stopPropagation());
    cb.addEventListener('change',()=>{ if(cb.checked) selectedSeeds.add(m.title); else selectedSeeds.delete(m.title); });
    const img = document.createElement('img'); img.src = toSmallPoster(m.poster)||''; img.alt = m.title;
    const sp = document.createElement('span'); sp.textContent = m.title;
    inner.appendChild(cb); inner.appendChild(img); inner.appendChild(sp); it.appendChild(inner);
    it.addEventListener('click', ()=> openModal(m));
    div.appendChild(it);
  });
}

$('#seedFilter').addEventListener('input', ()=>{
  const q = ($('#seedFilter').value||'').toLowerCase();
  const filtered = !q ? seedsData : seedsData.filter(m=>m.title.toLowerCase().includes(q));
  renderSeeds(filtered);
});

$('#btnSeed').addEventListener('click', async ()=>{
  $('#seedMsg').textContent='Descargando...'; $('#btnSeed').disabled=true;
  try{
    const limitStr = ($('#limit').value||'').trim();
    const body={
      minYear: Number($('#minYear').value||2018),
      maxYear: ($('#maxYear').value? Number($('#maxYear').value): undefined),
      limit: (limitStr===''? 100 : Number(limitStr)),
      genreId: ($('#genre').value? Number($('#genre').value): undefined),
      lang: ($('#lang').value||'es').trim()
    };
    const res = await api('/api/seed', { method:'POST', body: JSON.stringify(body) });
    if(!res.ok){ $('#seedMsg').textContent='Error: '+res.error; return; }
    $('#seedMsg').textContent=`Ok, ${res.count} películas.`;
    seedsData = await fetch('/data/seed.json').then(r=>r.json());
    const titlesSet = new Set(seedsData.map(x=>x.title));
    selectedSeeds = new Set(Array.from(selectedSeeds).filter(t=>titlesSet.has(t)));
    renderSeeds(seedsData);
  }catch(e){ $('#seedMsg').textContent='Error: '+e.message; }
  finally{ $('#btnSeed').disabled=false; }
});

$('#btnSaveSeeds').addEventListener('click', ()=>{ if(selectedSeeds.size < 1){ $('#selMsg').textContent='Selecciona al menos 1.'; return;} $('#selMsg').textContent=`Guardadas ${selectedSeeds.size} semillas.`; });

// ========= Grafo =========
$('#btnGraph').addEventListener('click', async ()=>{
  $('#graphMsg').textContent='Construyendo...'; $('#btnGraph').disabled=true;
  try{ const res = await api('/api/graph', { method:'POST' }); if(res.ok){ $('#graphMsg').textContent=`Grafo: ${res.nodes} pelis, ${res.edges} aristas.`; } else $('#graphMsg').textContent='Error: '+res.error; }
  catch(e){ $('#graphMsg').textContent='Error: '+e.message; }
  finally{ $('#btnGraph').disabled=false; }
});

// ========= Recomendaciones =========
document.querySelector('#btnRecommend')?.addEventListener('click', async () => {

  // Validar semillas
  if (!selectedSeeds || selectedSeeds.size < 1) {
    alert('Selecciona al menos 1 semilla.');
    return;
  }

  // Obtener algoritmo
  const algo = document.querySelector('#algo')?.value || 'bfs';

  // Obtener k y validarlo
  const kStr = (document.querySelector('#k')?.value || '').trim();
  let k = Number(kStr);
  if (!isFinite(k) || k <= 0) k = 5;      // valor por defecto
  k = Math.min(Math.max(k, 1), 50);       // clamp entre 1 y 50

  // Salida
  const out = document.querySelector('#reco');
  if (out) out.innerHTML = 'Calculando...';

  // Llamada a API
  const res = await api('/api/recommend', {
    method: 'POST',
    body: JSON.stringify({
      seeds: Array.from(selectedSeeds),
      algo,
      k
    })
  });

  if (!res.ok) {
    if (out) out.textContent = 'Error: ' + res.error;
    return;
  }

  // Mostrar resultados
  if (out) {
    out.innerHTML = '';

    (res.results || []).forEach(r => {
      const div = document.createElement('div');
      div.className = 'item';

      div.innerHTML =
        `<img src="${r.poster || ''}" style="width:48px;height:auto;border-radius:6px">` +
        `<div>
            <strong>${r.title}</strong> <span class="badge">${r.year || ''}</span><br>
            <small>Score: ${r.score} · Pageviews: ${r.popularity}</small><br>
            <small>Act.: ${r.reasons.sharedActors}
             · Gé.: ${r.reasons.sharedGenres}
             · Dist.: ${r.reasons.distance ?? 'n/a'}</small>
         </div>`;

      if (typeof openModal === 'function') {
        div.addEventListener('click', () => openModal(r, r.reasons));
      }

      out.appendChild(div);
    });
  }

});

