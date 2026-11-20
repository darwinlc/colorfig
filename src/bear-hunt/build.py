#!/usr/bin/env python3
"""Build demos/bear-hunt.html from this folder's Tinycharts sheet.

  python build.py [path/to/tinycharts/assets/build.py]

bear.js is the sheet, bear.mmd its statechart, bear.check.mjs checks its rules (run `node bear.check.mjs`
first; it writes bear.json, which The logic panel shows). The Tinycharts skill's build.py wraps the sheet with
the kit; this script then makes the page fit the gallery:
  - the shell's frame loop runs at most 30 frames a second, pauses while the page is hidden, and stops when the
    sheet's tick() reports nothing moving (any tap, key or button, and the sheet's own timers, wake it again)
  - #thumb mode shows the drawing only, for the hub's preview cards
  - ../assets/nav.js adds the "← Gallery" link
Pass the skill's build.py as the argument, or set TINYCHARTS_BUILD.
"""
import os, pathlib, subprocess, sys, tempfile
here = pathlib.Path(__file__).resolve().parent
kit = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get('TINYCHARTS_BUILD', ''))
if not kit.is_file(): sys.exit('give the path to the Tinycharts skill assets/build.py (argument or TINYCHARTS_BUILD)')
out = here.parent.parent/'demos'/'bear-hunt.html'
with tempfile.TemporaryDirectory() as tmp:
    raw = pathlib.Path(tmp)/'raw.html'
    # run where node can import pele (npm i pele there; PELE_DIR, default this folder) so The logic can draw the flow chart
    subprocess.run([sys.executable, str(kit), str(here/'bear.js'), '-o', str(raw), '--names', 'Bear Hunt', '--logic'], check=True, cwd=os.environ.get('PELE_DIR', here))
    page = raw.read_text(encoding='utf8')

def swap(old, new):
    global page
    assert page.count(old) == 1, f'expected one copy of: {old[:70]}'
    page = page.replace(old, new)

swap("function frame(t){ const dt = Math.min(.05,(t-last)/1000); last = t; nowT = t/1000; if (!document.hidden){ current?.tick?.(t/1000,dt); camera(dt); } requestAnimationFrame(frame); }",
"""/* gallery battery rules: at most ~30 frames a second, nothing while hidden, and no frames at all once the sheet is still */
let driving = false, drawn = 0, gen = 0;
function frame(t){ driving = false; gen++; if (document.hidden) return;
  if (t-drawn < 31){ drive(); return; }
  const dt = Math.max(0,Math.min(.05,(t-last)/1000)); last = t; drawn = t; nowT = t/1000;
  const busy = current?.tick?.(t/1000,dt); camera(dt);
  /* the camera counts as busy only while it is still easing, so a zoomed-in view goes quiet too */
  const easing = aim ? Math.abs(camZ-aim.z)+(Math.abs(camX-aim.x)+Math.abs(camY-aim.y))/700 > .002 : camZ > 1.002;
  if (busy !== false || easing) drive(); }
/* a frame, or a timer when frames don't come (a pane or iframe the browser has stopped painting); whichever is first */
function drive(){ if (driving) return; driving = true; const g = gen; requestAnimationFrame(t => { if (g === gen) frame(t); }); setTimeout(() => { if (g === gen) frame(performance.now()); },100); }
window.wake = () => { if (!driving){ last = performance.now(); drive(); } };
document.addEventListener('visibilitychange',() => { if (!document.hidden) window.wake(); });
addEventListener('pointerdown',window.wake); addEventListener('keydown',window.wake);""")
page = page.rstrip()
swap("open(first,true);\nrequestAnimationFrame(frame);", "open(first,true);\nwindow.wake();")
swap("</style>", """.stag.lit-on text{fill:#b23a38}.stag.lit-on path{stroke:#b23a38}
/* kid-sized buttons, and a "look closer" row of level zooms under the event buttons */
#actions button,#looks button{font-size:17px;padding:12px 18px}
#looks{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
#looks::before{content:"Look closer";width:100%;font:500 12px/1 var(--mono);letter-spacing:.8px;color:var(--ink);opacity:.72;text-transform:uppercase;font-size-adjust:.5}
#looks button{font-family:var(--mono);color:var(--ink);background:var(--paper);border:1px solid var(--ink);border-radius:999px;cursor:pointer;white-space:pre}
#looks button[aria-pressed=true]{background:var(--ink);color:var(--paper)}
#looks button:hover{transform:translateY(-1px)}
/* the buttons sit on the left: beside the sheet on a wide screen, at the start of the row under it otherwise */
#panel{justify-content:flex-start}
@media (min-aspect-ratio:11/10) and (min-width:1180px){
body #panel{left:auto;right:calc(100% + 18px);width:210px}
#actions,#looks{flex-direction:column;align-items:stretch}#actions::before,#looks::before{order:-1}
#actions button,#looks button{text-align:left;width:100%}}
#eyes.blink{animation:blink .3s linear 3;transform-box:fill-box;transform-origin:center}@keyframes blink{50%{transform:scaleY(.1)}}
.drift{animation:drift 7s ease-in-out infinite alternate}.drift.b{animation-duration:9s;animation-delay:-3s}@keyframes drift{to{transform:translateX(26px)}}
.peek{animation:peek 2.6s ease-in-out infinite}@keyframes peek{0%,60%,100%{transform:none}75%{transform:translateY(-5px)}}
html.thumb #panel,html.thumb #credit,html.thumb #tabs,html.thumb #lgChip{display:none!important}
html.thumb body{padding:0!important;gap:0}html.thumb #holder,html.thumb body #holder{width:min(100vw,100vh)!important}
</style>""")
page += '\n<script src="../assets/nav.js"></script>\n</body>\n</html>\n'
out.write_text(page, encoding='utf8')
print('wrote', out)
