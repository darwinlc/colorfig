/* Gallery glue for every game / demo page:
   - adds a "← Gallery" link back to the hub
   - #thumb in the URL = thumbnail mode for the hub's preview cards (only the drawing, no UI) */
(function(){
  const thumb = location.hash === '#thumb';
  const css = `
    .gal-back{font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.04em;color:inherit;text-decoration:none;
      border:1.5px solid currentColor;border-radius:999px;padding:4px 10px;margin-right:10px;display:inline-block;white-space:nowrap}
    .gal-back:hover{background:#0000000f}
    .gal-back.float{position:fixed;left:12px;bottom:12px;z-index:50;background:#f2efe7;color:#231e16;box-shadow:2px 2px 0 #231e16}
    html.thumb header,html.thumb .actions,html.thumb .stats,html.thumb .controls,html.thumb .made-with,
    html.thumb .toast,html.thumb #readout,html.thumb .idea,html.thumb #ov,html.thumb .bar,html.thumb .gal-back{display:none!important}
    html.thumb body{padding:0!important;overflow:hidden!important;justify-content:center;min-height:100vh}
    html.thumb #fig{margin:0 auto!important}`;
  if (thumb) document.documentElement.classList.add('thumb');
  const add = () => {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    if (thumb) return;
    const a = document.createElement('a'); a.href = '../index.html'; a.className = 'gal-back'; a.textContent = '← Gallery';
    const h1 = document.querySelector('header h1'), bar = document.querySelector('.bar.top');
    if (h1) h1.prepend(a);
    else if (bar) bar.prepend(a);
    else { a.classList.add('float'); document.body.appendChild(a); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
