/* a metro station as an exploded view: the street, the ticket hall and the platform, one slab each, pulled apart
   so all three show at once. Dashed lines join the openings to what runs between the levels.
   Plan, in world units: x runs down-right (0..400), y down-left (0..230); each level is a slab at its own z. */
const WD = 400, DP = 230, TH = 22, ZS = 600, ZC = 300, ZP = 0;
const WALK = 38, ESC = 24, STAIR = 20, GLIDE = 120;
const DOORS = [70, 158, 242, 330], LANES = [60, 92, 124, 156, 188];
const GLAZE = '#cfe2e8', STEEL = '#b9c0c4', DARK = '#4f4a52', AMBER = '#f2b84b', CRIMSON = '#c8574a', YEL = '#f2c84b';

const quad = (pts,col,w = .8) => { flat(pts,col); if (w) rim(pts,w,INK); };
const pT = (x,y,z,w,d,col,ink = .8) => quad([P(x,y,z),P(x+w,y,z),P(x+w,y+d,z),P(x,y+d,z)],col,ink);
const pY = (x,y,z,w,h,col,ink = .8) => quad([P(x,y,z),P(x+w,y,z),P(x+w,y,z+h),P(x,y,z+h)],col,ink);
const pX = (x,y,z,d,h,col,ink = .8) => quad([P(x,y,z),P(x,y+d,z),P(x,y+d,z+h),P(x,y,z+h)],col,ink);
const glassQ = (pts,o = .42) => { out.push(`<path d="${pathOf(pts)}Z" fill="${GLAZE}" opacity="${o}"/>`); rim(pts,.7,INK); };
const pl = (pts,col = INK,w = 1) => out.push(`<path d="${pathOf(pts)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
const solid = (x,y,z,w,d,h,col,top) => box(x,y,z,w,d,h,{left:col,top:top || litOf(col),ink:1.2,marks:false});
const post = (x,y,z,h,col = '#6d7a85',w = 2.2) => { pl([P(x,y,z),P(x,y,z+h)],INK,w+1.2); pl([P(x,y,z),P(x,y,z+h)],col,w); };
const shrub = (x,y,z,r) => { out.push(`<path fill="#8f8796" opacity=".18" d="${pathOf(ringAt((a,b) => P(x+a*r*.8+6,y+b*r*.8+6,z),18))}Z"/>`); post(x,y,z,r*1.3,'#8a6a4a',3.2); const c = P(x,y,z+r*2.1), b = blob(c[0],c[1],r*1.05,r*.95,.07,7); flat(b,'#93c79d'); inkLoop(b,{w:1.1,over:0}); const h = blob(c[0]-r*.3,c[1]-r*.3,r*.4,r*.32); flat(h,'#b6dcb9'); };
const ytext = (x,y,z,s,o) => leftText(x,y,z,s,o);
const xtext = (x,y,z,s,o) => rightText(x,y,z,s,o);
const grid = (x0,x1,y0,y1,z,step,col) => { const l = []; for (let x = x0+step; x < x1; x += step) l.push([P(x,y0,z),P(x,y1,z)]); for (let y = y0+step; y < y1; y += step) l.push([P(x0,y,z),P(x1,y,z)]); rule(l,col,.5,.7); };
const clipHull = (id,pts) => { const h = hull(pts); out.push(`<clipPath id="${id}"><path d="${pathOf(h)}Z"/></clipPath>`); };
/* a screen-facing sign disc, as signs read from any angle */
const roundel = (p,r,ring,word) => out.push(`<circle cx="${n1(p[0])}" cy="${n1(p[1])}" r="${r}" fill="#fffdf6" stroke="${ring}" stroke-width="${r*.32}"/><circle cx="${n1(p[0])}" cy="${n1(p[1])}" r="${r*1.16}" fill="none" stroke="${INK}" stroke-width=".8"/><rect x="${n1(p[0]-r*1.25)}" y="${n1(p[1]-r*.26)}" width="${n1(r*2.5)}" height="${n1(r*.52)}" fill="#5f86b5" stroke="${INK}" stroke-width=".7"/><text x="${n1(p[0])}" y="${n1(p[1]+r*.17)}" text-anchor="middle" class="tt" font-size="${n1(r*.44)}" fill="#fffdf6" letter-spacing=".5">${word}</text>`);

/* the slab every level stands on: a cut edge you can read the level's name on */
function slab(z,top,side,name){
  pY(0,DP,z-TH,WD,TH,shadeOf(side),1); pX(WD,0,z-TH,DP,TH,side,1); pT(0,0,z,WD,DP,top,1.1);
  ytext(14,DP,z-15,name,{size:11,cls:'cap',col:'#4a4552',track:1.4});
}

/* an escalator: landings at both ends, the incline, glass balustrades and black handrails.
   ax 'x' runs along x with its width along y; ax 'y' the other way. The near side is +y (or +x). */
function escalator(ax,sBot,sTop,c,w,z0,rise){
  const dir = Math.sign(sTop-sBot), L = 14, hw = w/2, H = 17, Q = (s,p,h) => ax === 'x' ? P(s,c+p,h) : P(c+p,s,h);
  const pr = [[sBot-dir*L,z0],[sBot,z0],[sTop,z0+rise],[sTop+dir*L,z0+rise]];
  const along = (p,dh) => pr.map(([s,h]) => Q(s,p,h+dh)), band = (p,a,b) => [...along(p,b),...along(p,a).reverse()];
  glassQ(band(-hw,2,H),.3); pl(along(-hw,H),'#2f2b2a',2.6);
  for (let i = 0; i < 3; i++){ const [s1,h1] = pr[i], [s2,h2] = pr[i+1]; quad([Q(s1,-hw,h1),Q(s2,-hw,h2),Q(s2,hw,h2),Q(s1,hw,h1)],i === 1 ? '#9aa3a8' : '#b8bfc3',.6); }
  { const n = 14, l = []; for (let k = 1; k < n; k++){ const s = lerp(sBot,sTop,k/n), h = z0+rise*k/n; l.push([Q(s,-hw+1,h),Q(s,hw-1,h)]); } rule(l,'#5c6268',.6,.8);
    rule([[Q(sBot-dir*3,-hw+1,z0),Q(sBot-dir*3,hw-1,z0)],[Q(sTop+dir*3,-hw+1,z0+rise),Q(sTop+dir*3,hw-1,z0+rise)]],YEL,1.6); }
  const top = along(hw,2), bot = pr.map(([s,h]) => Q(s,hw,Math.max(z0,h-18)));
  quad([...top,...bot.reverse()],'#b4bcc1',.9);
  glassQ(band(hw,2,H),.36); pl(along(hw,H),'#2f2b2a',2.6);
}
/* a staircase that climbs toward -x: every tread and riser, a stringer and a rail on the near side */
function stairs(xBot,y0,wd,z0,n,go,up){
  const xTop = xBot-n*go, zt = z0+n*up;
  solid(xTop-14,y0,zt-12,14,wd,12,'#d6cfc1');
  for (let i = n-1; i >= 0; i--){ const xa = xBot-(i+1)*go, xb = xBot-i*go, h = z0+(i+1)*up;
    quad([P(xa,y0,h),P(xb,y0,h),P(xb,y0+wd,h),P(xa,y0+wd,h)],'#ece5d7',.5);
    quad([P(xb,y0,h-up),P(xb,y0+wd,h-up),P(xb,y0+wd,h),P(xb,y0,h)],'#cdc5b6',.5); }
  const yN = y0+wd, s = [P(xBot,yN,z0)]; for (let i = 0; i < n; i++){ s.push(P(xBot-i*go,yN,z0+(i+1)*up)); s.push(P(xBot-(i+1)*go,yN,z0+(i+1)*up)); }
  s.push(P(xTop-14,yN,zt),P(xTop-14,yN,zt-12),P(xTop,yN,zt-16),P(xBot-go,yN,z0)); quad(s,'#c9c1b2',.8);
  for (const k of [0,.5,1]) post(lerp(xBot,xTop,k),yN,lerp(z0,zt,k)+(k === 0 ? 0 : 0),28,'#7d8a94',1.2);
  pl([P(xBot,yN,z0+28),P(xTop,yN,zt+28),P(xTop-14,yN,zt+28)],'#2f2b2a',2.4);
}
/* an opening in a floor: dark, with a low glass balustrade on the sides you can't walk in from */
function well(x,y,z,w,d,openAt,inner,rail = true){
  const O = [P(x,y,z),P(x+w,y,z),P(x+w,y+d,z),P(x,y+d,z)]; flat(O,DARK); clipped(O,inner); rim(O,1,INK);
  const g = (a,b) => { glassQ([P(...a,z),P(...b,z),P(...b,z+14),P(...a,z+14)],.4); pl([P(...a,z+14),P(...b,z+14)],'#6d7a85',1.8); };
  if (!rail) return;
  if (openAt !== 'x0') g([x,y],[x,y+d]); if (openAt !== 'y0') g([x,y],[x+w,y]); g([x,y+d],[x+w,y+d]); if (openAt !== 'x1') g([x+w,y],[x+w,y+d]);
}
/* a glass box: the lift shaft below, the lift's street kiosk above */
function glassBox(x,y,z,w,d,h,{roof = null,word = null} = {}){
  pT(x,y,z,w,d,'#9ea7ad',.8);
  for (const [a,b] of [[x,y],[x+w,y],[x,y+d]]) post(a,b,z,h,'#6d7a85',1.6);
  glassQ([P(x,y,z),P(x,y+d,z),P(x,y+d,z+h),P(x,y,z+h)],.22); glassQ([P(x,y,z),P(x+w,y,z),P(x+w,y,z+h),P(x,y,z+h)],.22);
  if (roof) pT(x-3,y-3,z+h,w+6,d+6,roof,1);
}
function glassFront(x,y,z,w,d,h,word){
  glassQ([P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x+w,y,z+h)],.3); glassQ([P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x,y+d,z+h)],.3);
  post(x+w,y+d,z,h,'#6d7a85',1.8);
  /* the doors: a steel frame on the +y face */
  pY(x+w/2-10,y+d+.3,z,20,h-14,'#dfe6e8',.7); rule([[P(x+w/2,y+d+.4,z),P(x+w/2,y+d+.4,z+h-14)]],INK,.7);
  if (word){ pY(x,y+d+.3,z+h-12,w,12,'#2f3a44',.7); ytext(x+w/2,y+d+.5,z+h-3,word,{size:8,cls:'tt',col:'#fffdf6',anchor:'middle',track:1.2}); }
}

/* ---------- the platform ---------- */
function platformLevel(){ const z = ZP;
  slab(z,'#ddd6c8','#cfc4ae','PLATFORM · LEVEL −2');
  /* the trackbed: a trench, its back wall, ballast, sleepers and two rails */
  pT(0,0,z-12,WD,56,'#8a837b',.8); pY(0,0,z-12,WD,12,'#a69d90',.7);
  { const l = []; for (let i = 0; i < 90; i++){ const x = rnd()*WD, y = 2+rnd()*52; l.push([P(x,y,z-12),P(x+2,y,z-12)]); } rule(l,'#6f6861',1.2,.6); }
  for (let x = 4; x < WD; x += 13) pT(x,9,z-11.5,6,38,'#a88763',.35);
  for (const y of [17,37]){ pT(0,y,z-9,WD,2.6,'#6e6a66',.5); rule([[P(0,y+.6,z-8.6),P(WD,y+.6,z-8.6)]],'#d9d6d0',.6); }
  /* the platform: concrete, a pale coping at the edge, the yellow tactile strip */
  group('data-state="platform"',() => { pT(0,56,z,WD,DP-56,'#ddd6c8',.9); grid(0,WD,72,DP,z,38,'#c6bdac'); });
  pT(0,56,z,WD,5,'#f3eee2',.6);
  pT(0,63,z,WD,8,YEL,.5); { const l = []; for (let x = 3; x < WD; x += 5) l.push([P(x,64.5,z),P(x,69.5,z)]); rule(l,'#c9a233',.7,.8); }
}
function trainCar(x,L,front){ const y = 10, d = 38, zb = -4, h = 62;
  pT(x,y,zb+h,L,d,'#d9dde0',.9); pT(x+20,y+10,zb+h+.2,L-40,18,'#c7cdd1',.5);
  pY(x,y+d,zb,L,h,'#eeeae2',1);
  pY(x,y+d+.2,zb,L,9,'#5d5a63',.6); pY(x,y+d+.2,zb+38,L,6,'#5f86b5',0);
  for (const dx of [40,128]){ const a = x+dx;
    pY(a-11,y+d+.3,zb+2,22,46,'#4a4650',.7);
    group('class="dl"',() => pY(a-10,y+d+.6,zb+2,10,46,CRIMSON,.7));
    group('class="dr"',() => pY(a,y+d+.6,zb+2,10,46,CRIMSON,.7));
    group('class="dl"',() => pY(a-8,y+d+.8,zb+26,6,14,GLAZE,.4));
    group('class="dr"',() => pY(a+2,y+d+.8,zb+26,6,14,GLAZE,.4)); }
  for (const [a,b] of [[8,24],[60,58],[148,14]]){ if (a+b > L-4) continue; pY(x+a,y+d+.3,zb+24,b,16,GLAZE,.7);
    for (let k = 0; k < b/14; k++) out.push(`<circle cx="${n1(P(x+a+7+k*14,y+d,zb+33)[0])}" cy="${n1(P(x+a+7+k*14,y+d,zb+33)[1])}" r="3.4" fill="${SKIN}" stroke="${INK}" stroke-width=".5"/>`); }
  pX(x+L,y,zb,d,h,front ? '#e3ded4' : '#d5d0c6',1);
  if (front){ pX(x+L+.3,y+6,zb+30,26,18,GLAZE,.7); for (const u of [y+5,y+d-5]) dot(...P(x+L+.3,u,zb+14),2.2,'#fff3c4',.6); xtext(x+L+.4,y+d-6,zb+54,'LINE 2',{size:8,cls:'tt',col:'#4a4552',track:1}); }
}
function train(){
  clipHull('trclip',[0,WD].flatMap(x => [0,56].flatMap(y => [-12,74].map(zz => P(x,y,zz)))));
  out.push('<g clip-path="url(#trclip)"><g id="m-train" data-state="aboard">'); trainCar(30,168,false); trainCar(202,168,true); out.push('</g></g>');
}
function platformKit(){
  put(259,0,() => escalator('x',200,72,123,22,ZP,100));
  put(300,0,() => stairs(190,162,30,ZP,10,12,10));
  put(531,0,() => { solid(300,198,ZP+10,56,12,3,'#c08a5a'); for (const x of [304,350]) solid(x,200,ZP,3,8,10,'#6d6a70'); solid(300,198,ZP+13,56,3,12,'#c08a5a'); });
  /* the next-train sign: a dark board on two posts, its words on the face that looks down the platform */
  put(540,0,() => { for (const y of [118,170]) post(388,y,ZP,58,'#6d7a85',2); pX(388,104,ZP+56,80,30,'#2f3a44',1);
    out.push(`<g id="m-sign">`); xtext(388.5,178,ZP+76,'NEXT TRAIN',{size:9,cls:'tt',col:AMBER,track:1.2}); out.push('</g>');
    const a = P(388.5,178,ZP+64); out.push(`<text id="m-signb" transform="matrix(${C} ${-S} 0 1 ${n1(a[0])} ${n1(a[1])})" class="tt" font-size="9" fill="${AMBER}" letter-spacing="1">2 min</text>`); });
  flush();
}

/* ---------- the ticket hall ---------- */
function hallLevel(){ const z = ZC;
  slab(z,'#ebe3d1','#d2c7b1','TICKET HALL · LEVEL −1');
  group('data-state="concourse"',() => { pT(196,0,z,WD-196,DP,'#ebe3d1',0); grid(196,WD,0,DP,z,40,'#d3c8b4'); });
  group('data-state="paid"',() => { pT(0,0,z,196,DP,'#e1e3d6',0); grid(0,196,0,DP,z,40,'#c9cbbb'); });
  rim([P(0,0,z),P(WD,0,z),P(WD,DP,z),P(0,DP,z)],1.1,INK);
  well(52,110,z,44,26,'x1',() => { const l = []; for (let i = 0; i < 9; i++) l.push([P(56+i*5,110,z-4-i*3),P(56+i*5,136,z-4-i*3)]); rule(l,'#8d8790',.8); });
  well(50,160,z,46,34,'x1',() => { const l = []; for (let i = 0; i < 9; i++) l.push([P(54+i*5,160,z-4-i*3),P(54+i*5,194,z-4-i*3)]); rule(l,'#a39b8f',1.1); });
}
function gates(z){
  /* six steel cabinets make five lanes; each lane has two glass paddles that fold back on a tap */
  for (let i = 0; i < 6; i++){ const y = 40+i*32;
    put(200+y,0,() => { solid(196,y,z,34,8,34,STEEL);
      out.push(`<g class="pad" data-cab="${i}">`); pT(223,y+1,z+34.2,6,6,YEL,.5); out.push('</g>');
      out.push(`<g class="padb" data-cab="${i}">`); pT(197,y+1,z+34.2,6,6,YEL,.5); out.push('</g>');
      pX(230.2,y,z+20,8,8,'#2f3a44',.5); }); }
  LANES.forEach((ly,i) => put(200+ly+1,0,() => {
    out.push(`<g class="pc" data-lane="${i}">`); for (const [a,b] of [[ly-12,ly-1],[ly+1,ly+12]]) glassQ([P(213,a,z+12),P(213,b,z+12),P(213,b,z+30),P(213,a,z+30)],.7); out.push('</g>');
    out.push(`<g class="po" data-lane="${i}" style="display:none">`); for (const [a,b] of [[ly-12,ly-9],[ly+9,ly+12]]) glassQ([P(213,a,z+12),P(213,b,z+12),P(213,b,z+30),P(213,a,z+30)],.7); out.push('</g>'); }));
}
function hallKit(){ const z = ZC;
  /* back wall machines face the hall */
  put(144,0,() => { solid(120,0,z,30,18,64,'#d27a5a'); pY(123,18.2,z+22,18,36,'#f3e9da',.7);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++){ const p = P(125.5+k*4.3,18.4,z+52-r*8.5); out.push(`<rect x="${n1(p[0]-1.4)}" y="${n1(p[1]-3)}" width="2.8" height="5" fill="${['#e0a33a','#7fae6e','#5f86b5','#d76b5c'][(r+k)%4]}" stroke="${INK}" stroke-width=".35"/>`); }
    pY(143,18.2,z+30,5,12,'#2f3a44',.5); pY(124,18.2,z+6,16,6,'#3d3940',.5); });
  for (const y of [201,215]) put(251+y,0,() => { solid(244,y,z,14,13,58,'#7fa7c9'); pX(258.2,y+2,z+34,9,12,'#e3f0f5',.7); pX(258.2,y+1.5,z+22,4,4,YEL,.4); pX(258.2,y+6,z+16,6,3,'#2f3a44',.4); xtext(258.4,y+12.5,z+52,'TICKETS',{size:4.6,cls:'tt',col:'#fffdf6',track:.4}); });
  /* the service counter: a timber booth at the head of the gate line, a window and someone behind it */
  put(234,0,() => { solid(196,4,z,40,28,64,'#c99a62'); pY(204,32.2,z+28,24,22,GLAZE,.7);
    { const p = P(216,30,z+40); out.push(`<circle cx="${n1(p[0])}" cy="${n1(p[1])}" r="4.6" fill="${SKIN}" stroke="${INK}" stroke-width=".6"/><path d="M${n1(p[0]-4.6)} ${n1(p[1]-1)}q4.6 -6 9.2 0" fill="${HAIR}" stroke="${INK}" stroke-width=".5"/><path d="M${n1(p[0]-6)} ${n1(p[1]+10)}q6 -6 12 0" fill="#5f86b5" stroke="${INK}" stroke-width=".5"/>`); }
    pY(200,32.4,z+25,32,3,'#e8d6b4',.6); ytext(216,32.5,z+59,'HELP · TICKETS',{size:5.5,cls:'tt',col:'#3d3940',anchor:'middle',track:.6}); });
  gates(z);
  put(455,0,() => { escalator('y',200,70,309,20,z,100); escalator('y',200,70,331,20,z,100); });
  put(400,0,() => glassBox(354,4,z,40,40,100));
  put(401,0,() => glassFront(354,4,z,40,40,100,'LIFT'));
  flush();
}

/* ---------- the street ---------- */
function streetLevel(){ const z = ZS;
  group('data-state="street"',() => {
    slab(z,'#ddd3c0','#cdc1ab','STREET · LEVEL 0');
    pT(0,0,z,64,DP,'#8c96a3',.9); for (let y = 6; y < DP; y += 30) pT(31,y,z,2,15,'#eee6d4',0);
    pT(4,0,z,2,DP,'#eee6d4',0);
    pT(64,0,z,6,DP,'#ece4d3',.6);
    grid(70,WD,0,DP,z,30,'#c2b7a3');
  });
}
function streetKit(){ const z = ZS;
  /* the bus stop: a flag on a pole, a glass shelter with a bench, and the timetable on its end panel */
  put(112,0,() => { post(72,40,z,84,'#6d7a85',2.4); const p = P(72,40,z+92); out.push(`<rect x="${n1(p[0]-12)}" y="${n1(p[1]-14)}" width="24" height="26" rx="2" fill="#fffdf6" stroke="${INK}" stroke-width="1"/>`); roundel([p[0],p[1]-4],7,CRIMSON,'BUS'); out.push(`<text x="${n1(p[0])}" y="${n1(p[1]+10)}" text-anchor="middle" class="tt" font-size="7" fill="${INK}">42</text>`); });
  put(170,0,() => {
    pT(80,70,z,24,80,'#cfc6b5',.6);
    for (const [x,y] of [[80,70],[104,70],[80,150]]) post(x,y,z,60,'#7d8a94',2);
    glassQ([P(80,70,z),P(104,70,z),P(104,70,z+60),P(80,70,z+60)],.35);
    solid(92,88,z+12,10,46,3,'#c08a5a'); solid(100,88,z+15,2,46,12,'#c08a5a'); for (const y of [90,130]) solid(94,y,z,2,2,12,'#6d6a70');
    pY(80,150,z,24,60,'#e9eef0',.8); pY(83,150.3,z+18,18,30,'#fbf7ec',.6); { const l = []; for (let k = 0; k < 6; k++) l.push([P(85,150.5,z+42-k*4),P(99,150.5,z+42-k*4)]); rule(l,'#7d7568',.6); }
    ytext(92,150.5,z+52,'TIMES',{size:5.5,cls:'tt',col:INK,anchor:'middle',track:.6});
    glassQ([P(104,70,z),P(104,150,z),P(104,150,z+60),P(104,70,z+60)],.32); post(104,150,z,60,'#7d8a94',2.2);
    pT(76,66,z+60,32,88,'#7d8a94',1); pX(108,66,z+56,88,4,'#6d7a85',.7); pY(76,154,z+56,32,4,shadeOf('#6d7a85'),.7); });
  for (const y of [172,196,220]) put(74+y,0,() => cyl(74,y,z,3,12,'#6d6a70',{ink:.8}));
  put(176,0,() => { cyl(76,162,z,6,16,'#7d8a94',{ink:.9}); });
  /* the station entrance: a mouth with low walls, a glass canopy on four posts, the roundel on a totem */
  put(380,0,() => {
    well(296,46,z,48,34,'y0',() => { const l = []; for (let i = 0; i < 10; i++) l.push([P(298,48+i*3.4,z-6-i*5),P(342,48+i*3.4,z-6-i*5)]); rule(l,'#9aa3a8',1); pT(298,46,z-60,44,34,'#3d3940',0); },false);
    solid(292,46,z,4,38,14,'#b9b1a4'); solid(344,46,z,4,38,14,'#b9b1a4'); solid(292,80,z,56,4,14,'#b9b1a4');
    for (const [x,y] of [[294,44],[346,44],[294,82]]) post(x,y,z+14,52,'#6d7a85',1.8);
    glassQ([P(288,38,z+66),P(352,38,z+66),P(352,88,z+66),P(288,88,z+66)],.5); rim([P(288,38,z+66),P(352,38,z+66),P(352,88,z+66),P(288,88,z+66)],1.2,'#6d7a85');
    pX(352,38,z+62,50,4,'#6d7a85',.7); pY(288,88,z+62,64,4,shadeOf('#6d7a85'),.7); post(346,82,z+14,48,'#6d7a85',1.8);
    ytext(320,88.3,z+63,'METRO',{size:7,cls:'tt',col:'#fffdf6',anchor:'middle',track:1.4}); });
  put(320,0,() => { post(282,40,z,96,'#4f5a63',2.6); roundel(P(282,40,z+104),11,CRIMSON,'METRO'); });
  put(400,0,() => { glassBox(354,4,z,40,40,90,{roof:'#6d7a85'}); });
  put(401,0,() => glassFront(354,4,z,40,40,90,'LIFT'));
  put(355,0,() => shrub(150,205,z,15));
  put(212,0,() => shrub(200,14,z,14));
  /* the bus, parked at the stop for drawing; it is moved along the road in init */
  put(60,0,() => {
    clipHull('busclip',[0,66].flatMap(x => [0,DP].flatMap(y => [z,z+70].map(zz => P(x,y,zz)))));
    out.push('<g clip-path="url(#busclip)"><g id="m-bus">');
    const x0 = 30, x1 = 60, y0 = 40, y1 = 150, zb = z+6, h = 50, BUS = '#cf5a4a';
    out.push(`<path fill="#8f8796" opacity=".2" d="${pathOf([P(x0+4,y0,z),P(x1+6,y0,z),P(x1+6,y1+4,z),P(x0+4,y1+4,z)])}Z"/>`);
    pT(x0,y0,zb+h,x1-x0,y1-y0,'#ece6db',.9);
    pX(x1,y0,zb,y1-y0,h,BUS,1); pY(x0,y1,zb,x1-x0,h,shadeOf(BUS),1);
    pX(x1+.2,y0+20,zb+26,y1-y0-26,16,GLAZE,.7); rule([60,84,108,132].map(y => [P(x1+.3,y,zb+26),P(x1+.3,y,zb+42)]),INK,.8);
    pY(x0+4,y1+.2,zb+28,x1-x0-8,14,GLAZE,.6);
    pX(x1+.2,y0+52,zb+2,14,40,'#a8473b',.6); rule([[P(x1+.3,y0+59,zb+2),P(x1+.3,y0+59,zb+42)]],INK,.6);
    pX(x1+.2,y0+4,zb+2,14,40,'#3d3940',.6);
    out.push('<g id="m-busdoor">'); pX(x1+.4,y0+4,zb+2,7,40,GLAZE,.6); pX(x1+.4,y0+11,zb+2,7,40,GLAZE,.6); out.push('</g>');
    pX(x1+.2,y0+4,zb+44,40,5,'#2f3a44',.5); xtext(x1+.4,y0+42,zb+45,'42 TOWN HALL',{size:4.6,cls:'tt',col:AMBER,track:.6});
    xtext(x1+.4,y1-10,zb+10,'42',{size:9,cls:'tt',col:'#fffdf6',track:.5});
    for (const y of [y0+24,y1-20]){ const r = ringAt((a,b) => P(x1+.5,y+a*9,zb+3+b*9),20); flat(r,'#3f3a39'); rim(r,.8,INK); dot(...P(x1+.6,y,zb+3),2.6,'#a6a4a4',.5); }
    out.push('</g></g>'); });
  flush();
}

/* the people: one pool, drawn once, moved by transform; a red ring marks the traveller you send */
const LOOKS = (() => { const hair = ['short','bun','bob','long','wavy','cap','hat','short','bob','long'], shirt = [PAL.sky,PAL.pink,PAL.sage,PAL.gold,'#e08b60','#b9a6d6','#7fb6c9','#e6c07a','#9fc78f','#d98f9f','#8fa8d9'], says = ['off to work','is this my line?','mind the gap','two stops for me','running late!','tap in, tap out','lovely day','where is the lift?','just visiting','meeting a friend','home time','I love trains'];
  return Array.from({length:24},(_,i) => ({size:.42,hair:hair[i%hair.length],shirt:shirt[(i*5)%shirt.length],arm:i%7 === 3 ? 'hold' : 'down',look:1,kid:i%9 === 4,say:says[i%says.length]})); })();
function pool(){
  out.push('<g id="m-pool" style="display:none">');
  LOOKS.forEach((o,i) => { out.push(`<g class="mv" data-i="${i}"><ellipse class="mring" cx="0" cy="0" rx="12" ry="6" fill="none" stroke="${RED}" stroke-width="2.4" style="display:none"/><g class="fl">`); person(0,0,o); out.push('</g></g>'); });
  /* the lift car, drawn at hall level; init slides it up and down the shaft */
  out.push('<g id="m-car">'); const z = ZC; solid(358,8,z,32,32,66,'#c3c9cc'); pY(361,40.2,z+4,26,54,'#dfe6e8',.7); rule([[P(374,40.4,z+4),P(374,40.4,z+58)]],INK,.7); pY(361,40.3,z+40,26,14,GLAZE,.5); out.push('</g>');
  out.push('</g>');
}

function draw(seed){
  begin(seed); OX = 640; OY = 985;
  title('an exploded view · statechart','Metro station');
  out.push(`<text x="72" y="236" class="it" font-size="19" fill="${LEAD}">Three levels pulled apart. Follow anyone from the bus stop down to the train.</text>`);
  /* bottom up, so each slab covers what passes under it */
  out.push('<g id="lv-p">'); platformLevel(); train(); platformKit();
  for (const [x,y] of [[52,110],[96,110],[52,136],[96,136],[50,160],[96,160],[50,194],[96,194]]) dash(P(x,y,ZC-TH),P(x,y,ZP+100));
  out.push('<g id="mv-p"></g></g>');
  out.push('<g id="lv-c">'); hallLevel(); hallKit();
  for (const [x,y] of [[298,56],[342,56],[298,80],[342,80],[354,4],[394,4],[354,44],[394,44]]) dash(P(x,y,ZS-TH),P(x,y,ZC+100));
  out.push('<g id="mv-c"></g></g>');
  out.push('<g id="lv-s">'); streetLevel(); streetKit(); out.push('<g id="mv-s"></g></g>');
  /* margin notes: street */
  const stag = (st,fn) => group(`class="stag" data-for="${st}"`,fn);
  stag('street',() => label(40,262,'street level','ground, where buses stop',[40,DP,ZS-12]));
  label(40,322,'road','the bus lane by the kerb',[22,190,ZS]);
  label(40,382,'bus stop sign','the flag: route 42',[72,40,ZS+70]);
  label(40,442,'bus shelter','glass, open to the kerb',[104,110,ZS+56]);
  label(40,502,'bench','inside the shelter',[96,112,ZS+16]);
  label(40,562,'timetable','every 8 min, illustrative',[92,150,ZS+34]);
  label(1360,262,'station sign','the metro roundel',[282,40,ZS+104],'end');
  label(1360,322,'station entrance','escalators down',[320,63,ZS+66],'end');
  label(1360,382,'lift','step-free, street to hall',[394,24,ZS+70],'end');
  label(1360,442,'pavement','paving slabs',[250,170,ZS],'end');
  /* the hall */
  stag('concourse',() => label(40,640,'ticket hall','one level down',[30,DP,ZC-12]));
  label(40,700,'vending machine','drinks and snacks',[135,18,ZC+44]);
  label(40,760,'escalator well','down to the platform',[60,123,ZC]);
  label(40,820,'stairwell','stairs to the platform',[58,177,ZC]);
  stag('paid',() => label(40,880,'paid side','past the gates',[150,215,ZC]));
  label(1360,560,'lift shaft','glass, one car',[394,24,ZC+60],'end');
  label(1360,620,'ticket machines','buy or top up a card',[258,221,ZC+44],'end');
  label(1360,680,'escalators','one down, one up',[340,150,ZC+40],'end');
  label(1360,740,'service counter','help and tickets',[236,18,ZC+50],'end');
  label(1360,800,'fare gates','paddles fold back',[230,92,ZC+24],'end');
  label(1360,860,'card reader','the yellow pad: tap',[226,141,ZC+34],'end');
  /* the platform */
  stag('platform',() => label(40,960,'platform','two levels down',[30,DP,ZP-12]));
  label(40,1020,'escalator','down from the hall',[140,134,ZP+56]);
  label(40,1080,'staircase','up and down',[130,192,ZP+48]);
  label(40,1140,'platform edge','mind the gap',[20,57,ZP]);
  label(40,1200,'yellow line','tactile strip: wait behind',[16,68,ZP]);
  label(40,1260,'track','rails, sleepers, ballast',[24,28,ZP-8]);
  stag('aboard',() => label(1360,940,'train','two cars, line 2',[372,30,ZP+40],'end'));
  label(1360,1000,'train doors','slide open at the stop',[330,48,ZP+26],'end');
  label(1360,1060,'next-train sign','counts the train in',[388,140,ZP+74],'end');
  label(1360,1120,'platform bench','for the wait',[356,204,ZP+12],'end');
  out.push(`<text x="72" y="1348" class="it" font-size="14.5" fill="${LEAD}">Illustrative: the depths, the 8-minute timetable and the 42 bus are made up, and the gap between levels is stretched.</text>`);
  out.push(`<text x="72" y="1370" class="it" font-size="14.5" fill="${LEAD}">Tap anyone to hear them. Tap a label to find its part.</text>`);
  plus(1180,120); plus(1230,170,5); plus(1290,1340,5);
  pool();
  finish();
}

function init(ctx){
  const $ = id => document.getElementById(id), G = {s:$('mv-s'),c:$('mv-c'),p:$('mv-p')}, home = $('m-pool');
  const free = [...home.querySelectorAll('.mv')], car = $('m-car'), trainEl = $('m-train'), busEl = $('m-bus'), busDoor = $('m-busdoor'), signB = $('m-signb');
  const leaves = [...trainEl.querySelectorAll('.dl,.dr')], wake = () => window.wake && window.wake();
  const lanes = LANES.map((y,i) => ({y,i,busy:null,want:0,close:0,pc:document.querySelector(`.pc[data-lane="${i}"]`),po:document.querySelector(`.po[data-lane="${i}"]`)}));
  const pads = [...document.querySelectorAll('.pad,.padb')];
  const R = (a,b) => a+Math.random()*(b-a), pick = l => l[Math.floor(Math.random()*l.length)];
  const easeOut = k => 1-(1-k)**3, easeIn = k => k**3;
  const A = []; let featured = null, frameN = 0, spawnT = 0, lastPoke = performance.now();
  const train = {st:'away',t:0,off:-480,doors:0,left:0,carried:0}, bus = {st:'away',t:0,off:320,left:0}, lift = {z:ZS,to:ZS,moving:false,hold:0,riders:new Set()};

  /* the steps a person follows, one at a time */
  const go = (x,y,z,v = WALK) => ({go:[x,y,z],v});
  const fn = f => ({fn:f}), until = f => ({until:f}), wait = s => ({wait:s});
  const ghost = on => fn(a => { a.ghost = on; });
  const vanish = after => [fn(a => { a.opT = 0; }),until(a => a.op < .03),fn(a => { if (after) after(a); drop(a); })];
  const note = (text,st) => fn(a => { if (a !== featured) return; ctx.say(text); light(st); });

  function mk(x,y,z){ const el = free.pop(); if (!el) return null; const a = {el,x,y,z,q:[],op:0,opT:1,ghost:false,face:1,k:'',tr:'',o:'',walk:0}; A.push(a); el._a = a; place(a); return a; }
  function drop(a){ a.dead = true; A.splice(A.indexOf(a),1); a.el.querySelector('.mring').style.display = 'none'; home.append(a.el); free.push(a.el); if (a === featured) clearFeatured(); }
  const groupOf = z => z >= ZS-1 ? G.s : z >= ZC-1 ? G.c : G.p;
  function place(a){ const p = P(a.x,a.y,a.z), bob = a.walk ? Math.abs(Math.sin(a.walk*9))*1.6 : 0, tr = `translate(${n1(p[0])} ${n1(p[1]-bob)})`;
    if (tr !== a.tr){ a.el.setAttribute('transform',tr); a.tr = tr; }
    const g = groupOf(a.z); if (a.el.parentNode !== g) g.append(a.el);
    const o = (a.op*(a.ghost ? .5 : 1)).toFixed(2); if (o !== a.o){ a.el.style.opacity = o; a.o = o; }
    const f = a.face < 0 ? 'scale(-1 1)' : ''; if (f !== a.k){ a.el.querySelector('.fl').setAttribute('transform',f); a.k = f; } }
  function run(a,dt){ let b = dt; a.walk = 0;
    if (a.op !== a.opT){ a.op = a.opT > a.op ? Math.min(a.opT,a.op+dt*3) : Math.max(a.opT,a.op-dt*3); }
    while (a.q.length && b > 0 && !a.dead){ const s = a.q[0];
      if (s.go){ const [tx,ty,tz] = s.go, dx = tx-a.x, dy = ty-a.y, dz = tz-a.z, d = Math.hypot(dx,dy,dz), m = s.v*b, sx = dx-dy;
        if (Math.abs(sx) > .5) a.face = sx > 0 ? 1 : -1;
        if (s.v === WALK || s.v === STAIR) a.walk = performance.now()/1000;
        if (d <= m){ a.x = tx; a.y = ty; a.z = tz; b -= d/s.v; a.q.shift(); } else { a.x += dx/d*m; a.y += dy/d*m; a.z += dz/d*m; b = 0; } }
      else if (s.wait != null){ s.left = (s.left ?? s.wait)-b; if (s.left <= 0){ b = -s.left; a.q.shift(); } else b = 0; }
      else if (s.until){ if (s.until(a)) a.q.shift(); else b = 0; }
      else if (s.fn){ a.q.shift(); s.fn(a); } }
    if (!a.dead) place(a); }
  const idle = a => !a.q.length || (a.q[0].until && !a.riding && a.op === a.opT);

  /* routes. Street: the escalator mouth is entered from behind (y < 46); the lift kiosk door faces the front */
  const edgeS = () => pick([[R(120,350),6],[R(120,380),224],[396,R(160,220)],[396,R(60,90)]]);
  const toMouth = a => { const st = []; if (a.y > 44){ if (a.x >= 286) st.push(go(286,R(92,100),ZS)); st.push(go(R(282,288),30,ZS)); } st.push(go(309,32,ZS)); return st; };
  const fromMouth = e => e[1] < 20 ? [go(...e,ZS)] : e[0] < 286 ? [go(286,30,ZS),go(...e,ZS)] : [go(286,30,ZS),go(286,98,ZS),go(...e,ZS)];
  const liftRide = (from,to) => [go(374,54,from),fn(a => { a.lw = {from,to}; }),until(a => !lift.moving && lift.z === a.lw.from),go(R(366,384),R(18,32),from,26),fn(a => { a.riding = true; lift.riders.add(a); }),until(a => !a.riding),go(374,54,to)];
  const laneFor = inward => { const l = lanes.filter(L => inward ? L.i < 3 : L.i >= 3); return l.reduce((m,L) => L.want < m.want ? L : m,l[0]); };
  const gate = inward => { let L; const xa = inward ? 246 : 184, xb = inward ? 184 : 246;
    return [fn(a => { L = laneFor(inward); L.want++; a.q.unshift(go(xa,L.y,ZC),until(a => { if (!L.busy) L.busy = a; return L.busy === a; }),fn(() => openLane(L,inward)),wait(.45),go(xb,L.y,ZC,WALK*.8),fn(() => { L.busy = null; L.want--; L.close = .5; }))})]; };
  const spot = () => [R(222,384),R(80,104)];
  const nearDoor = x => DOORS.reduce((m,d) => Math.abs(d-x) < Math.abs(m-x) ? d : m,DOORS[0]);

  /* a traveller from wherever they are on the street, all the way onto a train */
  function toTrain(a){ const lift_ = Math.random() < .3, card = Math.random() < .7, steps = [];
    if (lift_){ if (a.x < 300) steps.push(go(286,98,ZS)); steps.push(go(360,96,ZS),...liftRide(ZS,ZC),note('Down in the lift to the ticket hall.','concourse'),go(346,30,ZC),go(292,30,ZC),go(292,60,ZC)); }
    else steps.push(...toMouth(a),go(309,58,ZS),ghost(true),go(309,58,ZC+100,GLIDE),ghost(false),go(309,70,ZC+100,ESC),go(309,200,ZC,ESC),note('Down the escalator into the ticket hall.','concourse'),go(309,214,ZC),go(292,222,ZC));
    if (!card){ const y = pick([207,221]); steps.push(go(292,y,ZC),go(267,y,ZC),note('No card: buying a ticket at the machine.','concourse'),wait(1.8)); }
    steps.push(...gate(true),note('Ticket tapped: the paddles fold back, through the gates.','paid'));
    if (Math.random() < .15) steps.push(go(135,28,ZC),wait(1.4));
    if (Math.random() < .62) steps.push(go(104,123,ZC),go(66,123,ZC),ghost(true),go(66,123,ZP+100,GLIDE),ghost(false),go(72,123,ZP+100,ESC),go(200,123,ZP,ESC),go(214,123,ZP),go(228,108,ZP));
    else steps.push(go(104,170,ZC),go(63,170,ZC),ghost(true),go(63,170,ZP+100,GLIDE),ghost(false),go(70,170,ZP+100,STAIR),go(190,170,ZP,STAIR),go(204,170,ZP),go(228,150,ZP),go(228,108,ZP));
    const [sx,sy] = spot(); steps.push(go(sx,sy,ZP),note('On the platform, behind the yellow line. Press Train arrives.','platform'),...board());
    a.q.push(...steps); }
  const board = () => [until(() => train.st === 'open'),fn(a => { a.boarding = true; const d = nearDoor(a.x)+R(-4,4); a.q.unshift(go(d,74,ZP),go(d,54,ZP,WALK*.7),note('Aboard. The doors close and the train pulls out.','aboard'),...vanish(a => { a.boarding = false; train.carried++; })); })];
  const toBus = () => { const y = R(80,140); return [go(R(83,90),y,ZS),until(() => bus.st === 'stopped'),fn(a => { a.boarding = true; a.q.unshift(go(74,58,ZS),go(64,50,ZS,WALK*.7),...vanish(a => { a.boarding = false; })); })]; };
  /* off a train: up the stairs, out through the gates, up to the street, then away or to the bus */
  function outOfStation(a){ const steps = [go(a.x,74,ZP),go(228,108,ZP),go(228,184,ZP),go(204,184,ZP),go(190,184,ZP),go(70,184,ZP+100,STAIR),go(63,184,ZP+100),ghost(true),go(63,184,ZC,GLIDE),ghost(false),go(104,184,ZC),...gate(false)];
    if (Math.random() < .25) steps.push(go(292,130,ZC),go(292,30,ZC),go(346,30,ZC),...liftRide(ZC,ZS),go(360,96,ZS));
    else steps.push(go(331,228,ZC),go(331,214,ZC),go(331,200,ZC),go(331,70,ZC+100,ESC),go(331,58,ZC+100),ghost(true),go(331,58,ZS,GLIDE),ghost(false),go(331,38,ZS));
    steps.push(fn(a => { const byLift = a.x > 350; if (Math.random() < .25) a.q.unshift(go(286,byLift ? 98 : 30,ZS),...toBus()); else if (byLift) a.q.unshift(go(...pick([[R(120,380),224],[396,R(150,220)]]),ZS),...vanish()); else a.q.unshift(...fromMouth(edgeS()),...vanish()); }));
    a.q.push(...steps); }

  function spawnStreet(kind){ const e = kind === 'lift' ? [396,R(160,220)] : edgeS(), a = mk(e[0],e[1],ZS); if (!a) return null;
    if (kind === 'bus' || (!kind && Math.random() < .3)){ if (a.x > 280 && a.y < 100) a.q.push(go(330,24,ZS)); a.q.push(...toBus()); } else toTrain(a); return a; }

  /* the gates, the train, the bus and the lift */
  function openLane(L,inward){ L.pc.style.display = 'none'; L.po.style.display = ''; L.close = 0;
    const pad = pads.find(p => p.dataset.cab == L.i+1 && p.classList.contains(inward ? 'pad' : 'padb')); if (pad){ pad.querySelector('path').setAttribute('fill','#7fc28a'); L.pad = pad; } }
  function shutLane(L){ L.pc.style.display = ''; L.po.style.display = 'none'; if (L.pad) L.pad.querySelector('path').setAttribute('fill',YEL); }
  const putTrain = () => { trainEl.setAttribute('transform',`translate(${n1(C*train.off)} ${n1(S*train.off)})`); trainEl.style.display = train.st === 'away' ? 'none' : ''; };
  const putDoors = () => { const d = train.doors*9; leaves.forEach(l => l.setAttribute('transform',`translate(${n1((l.classList.contains('dl') ? -1 : 1)*C*d)} ${n1((l.classList.contains('dl') ? -1 : 1)*S*d)})`)); };
  const putBus = () => { busEl.setAttribute('transform',`translate(${n1(-C*bus.off)} ${n1(S*bus.off)})`); busEl.style.display = bus.st === 'away' ? 'none' : ''; busDoor.style.display = bus.st === 'stopped' ? 'none' : ''; };
  const putCar = () => { car.setAttribute('transform',`translate(0 ${n1(-(lift.z-ZC))})`); const g = lift.z >= ZS-1 ? G.s : G.c; if (car.parentNode !== g) g.prepend(car); };
  const sign = t => { signB.textContent = t; };

  function tickTrain(dt){ const T = train;
    if (T.st === 'arriving'){ T.t += dt; const k = Math.min(1,T.t/4.2); T.off = -480*(1-easeOut(k)); if (k >= 1){ T.st = 'open'; T.t = 0; T.left = Math.floor(R(1,4.99)); sign('doors open'); if (!featured) ctx.say('Doors open: people step off first, then the platform gets on.'); } }
    else if (T.st === 'open'){ T.t += dt; T.doors = Math.min(1,T.doors+dt*2);
      if (T.doors >= 1 && T.left > 0 && T.t > .5+(3-T.left)*.45){ T.left--; const d = pick(DOORS)+R(-4,4), a = mk(d,52,ZP); if (a) outOfStation(a); }
      const boarding = A.some(a => a.boarding && a.z < 1);
      if (T.t > 4.2 && T.left <= 0 && !boarding){ T.st = 'closing'; sign('stand clear'); if (!featured) ctx.say('Doors closing. Stand clear.'); } }
    else if (T.st === 'closing'){ T.doors = Math.max(0,T.doors-dt*1.6); if (T.doors <= 0){ T.st = 'leaving'; T.t = 0; if (!featured) ctx.say(`The train pulls out${T.carried ? ` with ${T.carried} new passenger${T.carried > 1 ? 's' : ''}` : ''}.`); } }
    else if (T.st === 'leaving'){ T.t += dt; const k = Math.min(1,T.t/4); T.off = 480*easeIn(k); if (k >= 1){ T.st = 'away'; T.off = -480; sign('8 min'); } }
    else return false;
    putTrain(); putDoors(); return true; }
  function tickBus(dt){ const B = bus;
    if (B.st === 'arriving'){ B.t += dt; const k = Math.min(1,B.t/3.6); B.off = 320*(1-easeOut(k)); if (k >= 1){ B.st = 'stopped'; B.t = 0; B.left = Math.floor(R(0,3.99)); ctx.say('The 42 stops: doors open, people step off and the queue gets on.'); } }
    else if (B.st === 'stopped'){ B.t += dt;
      if (B.left > 0 && B.t > .5+(3-B.left)*.6){ B.left--; const a = mk(66,52,ZS); if (a){ a.q.push(go(78,60,ZS)); if (Math.random() < .6) toTrain(a); else { const e = edgeS(); a.q.push(go(...(e[1] < 20 || e[0] < 286 ? e : [R(120,280),224]),ZS),...vanish()); } } }
      const boarding = A.some(a => a.boarding && a.z > ZS-1);
      if (B.t > 2.6 && B.left <= 0 && !boarding){ B.st = 'leaving'; B.t = 0; ctx.say('The bus pulls away.'); } }
    else if (B.st === 'leaving'){ B.t += dt; const k = Math.min(1,B.t/3.4); B.off = -330*easeIn(k); if (k >= 1){ B.st = 'away'; B.off = 320; } }
    else return false;
    putBus(); return true; }
  function tickLift(dt){ const L = lift;
    if (L.moving){ const d = L.to-L.z, m = 110*dt; if (Math.abs(d) <= m){ L.z = L.to; L.moving = false; L.hold = 1; for (const r of L.riders){ r.z = L.z; r.riding = false; r.lw = null; } L.riders.clear(); } else L.z += Math.sign(d)*m;
      for (const r of L.riders) r.z = L.z; putCar(); return true; }
    const other = L.z === ZS ? ZC : ZS, here = A.some(a => a.lw && !a.riding && a.lw.from === L.z), there = A.some(a => a.lw && !a.riding && a.lw.from === other);
    if (L.hold > 0){ L.hold -= dt; return true; }
    if (!here && (L.riders.size || there)){ L.to = other; L.moving = true; return true; }
    return false; }

  /* the lit state: the label of the level the red-ringed traveller is on */
  const stags = [...document.querySelectorAll('.stag')];
  function light(st){ stags.forEach(g => g.classList.toggle('lit-on',g.dataset.for === st)); }
  function clearFeatured(){ if (featured) featured.el.querySelector('.mring').style.display = 'none'; featured = null; }

  const poke = () => { lastPoke = performance.now(); if (!spawnT) spawnLoop(); wake(); };
  function spawnLoop(){ spawnT = setTimeout(() => { spawnT = 0; if (performance.now()-lastPoke > 90000) return; if (A.length < 18) spawnStreet(); spawnLoop(); wake(); },R(2600,5600)); }
  $('sheet').addEventListener('pointerdown',poke);

  ctx.button('bus arrives',() => { poke();
    if (bus.st !== 'away') return ctx.say(bus.st === 'leaving' ? 'Not yet: the last bus is still pulling away.' : 'Not yet: a bus is already at the stop.');
    bus.st = 'arriving'; bus.t = 0; bus.off = 320; putBus(); ctx.say('The 42 bus pulls in to the stop.'); });
  ctx.button('train arrives',() => { poke();
    if (train.st !== 'away') return ctx.say(train.st === 'leaving' ? 'Not yet: the last train is still pulling out.' : 'Not yet: a train is already at the platform.');
    train.st = 'arriving'; train.t = 0; train.off = -480; train.carried = 0; train.doors = 0; sign('arriving'); putTrain(); putDoors(); ctx.say('A train pulls in to the platform. Nobody steps past the yellow line.'); });
  ctx.button('send a traveller',() => { poke();
    if (featured) return ctx.say('Not yet: your traveller (red ring) is still on the way.');
    const a = spawnStreet('train'); if (!a) return ctx.say('The station is full just now: wait a moment.');
    featured = a; a.el.querySelector('.mring').style.display = ''; light('street'); ctx.say('A traveller (red ring) arrives on the street, heading for the train.'); });
  ctx.hint('people also arrive on their own; tap anyone');
  ctx.say('Press Bus arrives or Train arrives, or send a traveller and follow the red ring.');

  /* a station already going about its day */
  putTrain(); putBus(); putCar(); sign('8 min');
  for (let i = 0; i < 2; i++){ const a = mk(R(83,90),R(84,136),ZS); a.op = 1; a.q.push(until(() => bus.st === 'stopped'),fn(a => { a.boarding = true; a.q.unshift(go(74,58,ZS),go(64,50,ZS,WALK*.7),...vanish(a => { a.boarding = false; })); })); }
  for (let i = 0; i < 3; i++){ const [x,y] = spot(), a = mk(x,y,ZP); a.op = 1; a.face = Math.random() < .5 ? 1 : -1; a.q.push(...board()); }
  { const a = mk(292,222,ZC); a.op = 1; a.q.push(...gate(true),...[go(104,123,ZC),go(66,123,ZC),ghost(true),go(66,123,ZP+100,GLIDE),ghost(false),go(72,123,ZP+100,ESC),go(200,123,ZP,ESC),go(214,123,ZP),go(228,108,ZP),go(...spot(),ZP)],...board()); }
  for (let i = 0; i < 2; i++){ const a = spawnStreet('train'); if (a){ a.op = 1; for (let k = 0; k < 40*i+20; k++) run(a,.05); } }
  A.forEach(place);
  spawnLoop();

  return { tick(t,dt){ frameN++;
    let busy = false;
    busy = tickTrain(dt) || busy; busy = tickBus(dt) || busy; busy = tickLift(dt) || busy;
    for (const L of lanes) if (L.close > 0){ L.close -= dt; busy = true; if (L.close <= 0) shutLane(L); }
    for (const a of [...A]) run(a,dt);
    if (A.some(a => !idle(a))) busy = true;
    /* nearer people cover farther ones: re-stack each level's people a few times a second */
    if (frameN%6 === 0) for (const g of Object.values(G)){ const kids = [...g.children], key = el => el === car ? 400 : el._a ? el._a.x+el._a.y : 0, sorted = [...kids].sort((p,q) => key(p)-key(q)); if (sorted.some((el,i) => el !== kids[i])) sorted.forEach(el => g.append(el)); }
    return busy; },
    stop(){ clearTimeout(spawnT); $('sheet').removeEventListener('pointerdown',poke); } };
}
