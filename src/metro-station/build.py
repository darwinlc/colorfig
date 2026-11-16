#!/usr/bin/env python3
"""Build demos/metro-station.html from this folder's Tinycharts sheet.

  python build.py [path/to/tinycharts/assets/build.py]

metro.js is the sheet, metro.mmd its statechart, metro.check.mjs checks its rules (run `node metro.check.mjs`
first; it writes metro.json, which The logic panel shows). The Tinycharts skill's build.py wraps the sheet with
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
out = here.parent.parent/'demos'/'metro-station.html'
with tempfile.TemporaryDirectory() as tmp:
    raw = pathlib.Path(tmp)/'raw.html'
    # run where node can import pele (npm i pele there; PELE_DIR, default this folder) so The logic can draw the flow chart
    subprocess.run([sys.executable, str(kit), str(here/'metro.js'), '-o', str(raw), '--names', 'Metro station', '--logic'], check=True, cwd=os.environ.get('PELE_DIR', here))
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
  if (busy !== false || aim || camZ > 1.002) drive(); }
/* a frame, or a timer when frames don't come (a pane or iframe the browser has stopped painting); whichever is first */
function drive(){ if (driving) return; driving = true; const g = gen; requestAnimationFrame(t => { if (g === gen) frame(t); }); setTimeout(() => { if (g === gen) frame(performance.now()); },100); }
window.wake = () => { if (!driving){ last = performance.now(); drive(); } };
document.addEventListener('visibilitychange',() => { if (!document.hidden) window.wake(); });
addEventListener('pointerdown',window.wake); addEventListener('keydown',window.wake);""")
page = page.rstrip()
swap("open(first,true);\nrequestAnimationFrame(frame);", "open(first,true);\nwindow.wake();")
swap("</style>", """.stag.lit-on text{fill:#b23a38}.stag.lit-on path{stroke:#b23a38}
html.thumb #panel,html.thumb #credit,html.thumb #tabs,html.thumb #lgChip{display:none!important}
html.thumb body{padding:0!important;gap:0}html.thumb #holder,html.thumb body #holder{width:min(100vw,100vh)!important}
</style>""")
page += '\n<script src="../assets/nav.js"></script>\n</body>\n</html>\n'
out.write_text(page, encoding='utf8')
print('wrote', out)
