// Maintenance Map app logic
const SL = {done:'修理・交換済み',plan:'計画中',warn:'要注意',stock:'ストック'};
const SC = {done:'b-done',plan:'b-plan',warn:'b-warn',stock:'b-stock'};
const TL = [{y:'2021',c:12},{y:'2022',c:9},{y:'2023',c:8},{y:'2024',c:7},{y:'2025',c:5},{y:'2026',c:6}];

function buildHotspots(){
  const wrap = document.getElementById('car-wrap');
  HOTSPOTS.forEach(h => {
    const d = document.createElement('div');
    d.className = 'hs s-'+(PARTS[h.id]||{status:'stock'}).status;
    d.style.left = h.x+'%'; d.style.top = h.y+'%';
    d.dataset.id = h.id;
    d.dataset.status = (PARTS[h.id]||{status:'stock'}).status;
    d.innerHTML = '<span class="hs-label">'+h.label+'</span>';
    d.onclick = () => showDetail(h.id);
    wrap.appendChild(d);
  });
}

function showDetail(id){
  const p = PARTS[id]; if(!p) return;
  const panel = document.getElementById('detail-panel');
  const badge = document.getElementById('detail-badge');
  badge.className = SC[p.status]; badge.textContent = SL[p.status];
  document.getElementById('detail-title').textContent = p.name;
  let html = '<p>'+p.summary+'</p>';
  if(p.history.length){
    html += '<h4>整備履歴</h4><ul>';
    p.history.forEach(h => html += '<li><span class="ytag">'+h.y+'</span>'+h.t+'</li>');
    html += '</ul>';
  }
  if(p.plan.length){
    html += '<h4>今後の計画</h4><ul>';
    p.plan.forEach(pl => html += '<li><span class="ptag">'+pl.p+'</span>'+pl.t+'</li>');
    html += '</ul>';
  }
  if(p.notes) html += '<h4>メモ</h4><p style="color:#888;font-size:0.8rem">'+p.notes+'</p>';
  document.getElementById('detail-body').innerHTML = html;
  panel.classList.add('open');
}

function renderStats(){
  const ct = {done:0,plan:0,warn:0,stock:0};
  Object.values(PARTS).forEach(p => ct[p.status]++);
  document.getElementById('stats-bar').innerHTML =
    Object.entries(ct).map(([k,v]) =>
      '<div class="sc"><div class="sc-n c-'+k+'">'+v+'</div><div class="sc-l">'+SL[k]+'</div></div>'
    ).join('');
}

function renderTimeline(){
  const mx = Math.max(...TL.map(t=>t.c));
  const latest = TL[TL.length-1].y;   // 最新年だけ赤で強調（年を足しても自動で移る）
  document.getElementById('tl-bars').innerHTML = TL.map(t =>
    '<div style="flex:1;background:'+(t.y===latest?'#e74c3c':'#27ae60')+
    ';opacity:'+(0.4+t.c/mx*0.6)+';border-radius:2px;position:relative" title="'+t.y+': '+t.c+'件">'+
    '<span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:0.7rem;color:#fff;font-weight:bold">'+t.c+'</span></div>'
  ).join('');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  buildHotspots();
  renderStats();
  renderTimeline();
});
