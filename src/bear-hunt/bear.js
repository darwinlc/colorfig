/* a comic page for a small child, after the old campfire chant: a family goes on a bear hunt. Every panel is a state,
   and every frame is cut to its moment: a leafy edge for the leaf pile, a wavy one for the brook, a hilltop, a cloud
   of fog, a cave's arch, a starburst for the bear, soft pillows for home. A red paw sticker hops panel to panel;
   from the bear it runs all the way back through every place to the blanket. One detour: stomp in the cave and the
   bear grumbles, so we try again on tiptoe. */
const PANELS = [
  {id:'start',x:36,y:262,w:400,h:318,bg:'#dcecf3',cap:['1 · Off we go!','Boots on, hats on!'],say:'Boots on, hats on, off we go! Are we scared? Not one bit!'},
  {id:'leaves',x:456,y:262,w:440,h:318,bg:'#f4e6cc',cap:['2 · Leaves!','Crunch, munch!'],say:'A big pile of leaves! Can\'t go over it, can\'t go under it. Through it! Crunch, munch!'},
  {id:'brook',x:916,y:262,w:448,h:318,bg:'#e3efe0',cap:['3 · A bubbly brook','Hop, plop!'],say:'A bubbly brook! Can\'t go over it, can\'t go under it. Hop across! Hop, plop!'},
  {id:'hill',x:36,y:600,w:450,h:330,bg:'#dcecf3',cap:['4 · A bumpy hill','Clamber, clatter!'],say:'A big bumpy hill! Can\'t go over it… oh wait, yes we can! Clamber, clatter!'},
  {id:'fog',x:506,y:600,w:400,h:330,bg:'#d3d8dc',cap:['5 · Fog!','Tip-toe, hush.'],say:'A thick grey fog. We can\'t see our toes! Hold hands. Tip-toe, hush.'},
  {id:'cave',x:926,y:600,w:438,h:330,bg:'#8d8478',cap:['6 · A dark cave','Shh… tiptoe in.'],say:'A dark, dark cave. Shh… Two shiny eyes. One wet nose…'},
  {id:'bear',x:36,y:950,w:520,h:400,bg:'#f7d26a',cap:['7 · IT\'S A BEAR!','Run!'],say:'ROARRR! It\'s a bear! Quick, run home!'},
  {id:'blanket',x:576,y:950,w:380,h:400,bg:'#e9dcc4',cap:['8 · Under the blanket','Who\'s that?'],say:'Under the blanket! Six eyes peek out. Knock, knock. Who\'s at the door?'},
  {id:'surprise',x:976,y:950,w:388,h:400,bg:'#c9e6a8',cap:['9 · A surprise!','Picnic time!'],say:'It\'s the bear, with our picnic basket! "Can I have a honey sandwich?" Are we scared? Not one bit!'}];

/* the frames: each edge is a line, a wave, a row of scallops or a hilltop, always inside the panel's box */
const lines = (n,f) => Array.from({length:n},(_,i) => f(i));
function edge(a,b,kind = 'line',amp = 0,hs = null){ const dx = b[0]-a[0], dy = b[1]-a[1], L = Math.hypot(dx,dy), nx = dy/L, ny = -dx/L, at = (t,o) => [a[0]+dx*t+nx*o,a[1]+dy*t+ny*o];
  if (kind === 'line') return [a];
  if (kind === 'wave'){ const k = Math.max(2,Math.round(L/120)); return lines(60,i => at(i/60,amp*(Math.sin(i/60*k*2*Math.PI)-1))); }
  if (kind === 'scallop'){ const k = Math.max(3,Math.round(L/(amp*3.4))), m = 10; return lines(k*m,i => { const j = Math.floor(i/m), s = (i%m)/m; return at((j+s)/k,amp*(Math.sin(s*Math.PI)-1)); }); }
  if (kind === 'peaks'){ const n = hs.length-1; return lines(n*8,i => { const u = i/(n*8), k = Math.min(n-1,Math.floor(u*n)), f = u*n-k, e = f*f*(3-2*f); return at(u,-lerp(hs[k],hs[k+1],e)*amp); }); }
}
const box4 = ({x,y,w,h},[t,r,b,l]) => [...edge([x,y],[x+w,y],...t),...edge([x+w,y],[x+w,y+h],...r),...edge([x+w,y+h],[x,y+h],...b),...edge([x,y+h],[x,y],...l)];
function rounded({x,y,w,h},r){ const c = (cx,cy,a0) => lines(9,i => { const t = a0+i/8*Math.PI/2; return [cx+r*Math.cos(t),cy+r*Math.sin(t)]; }); return [...c(x+r,y+r,Math.PI),...c(x+w-r,y+r,-Math.PI/2),...c(x+w-r,y+h-r,0),...c(x+r,y+h-r,Math.PI/2)]; }
const SHAPE = {
  start: p => [[p.x,p.y],[p.x+p.w,p.y],[p.x+p.w-26,p.y+p.h],[p.x,p.y+p.h]],
  leaves: p => box4(p,[['scallop',14],['line'],['line'],['line']]),
  brook: p => box4(p,[['line'],['line'],['wave',9],['line']]),
  hill: p => box4(p,[['peaks',96,[.1,0,.12,.4,.62,.5,.78,.9]],['line'],['line'],['line']]),
  fog: p => box4(p,[['scallop',13],['scallop',13],['scallop',13],['scallop',13]]),
  cave: p => { const ah = p.h*.42; return [...lines(33,i => { const t = Math.PI+i/32*Math.PI; return [p.x+p.w/2+p.w/2*Math.cos(t),p.y+ah+ah*Math.sin(t)]; }),[p.x+p.w,p.y+p.h],[p.x,p.y+p.h]]; },
  bear: p => lines(30,i => { const t = i/30*2*Math.PI-Math.PI/2, k = i%2 ? .8 : 1.06; return [Math.max(p.x,Math.min(p.x+p.w,p.x+p.w/2+Math.cos(t)*p.w/2*k)),Math.max(p.y,Math.min(p.y+p.h,p.y+p.h/2+Math.sin(t)*p.h/2*k))]; }),
  blanket: p => rounded(p,52),
  surprise: p => rounded(p,74)};
const CAP = {cave:p => [p.x+p.w/2-118,p.y+40],bear:p => [p.x+p.w/2-120,p.y+70],surprise:p => [p.x+36,p.y+26],leaves:p => [p.x+14,p.y+26],fog:p => [p.x+24,p.y+24],blanket:p => [p.x+26,p.y+22]};
const REST = {start:p => [p.x+p.w-66,p.y+p.h-40],bear:p => [p.x+p.w*.78,p.y+p.h*.76],blanket:p => [p.x+p.w-62,p.y+p.h-62],surprise:p => [p.x+p.w-72,p.y+p.h-72],fog:p => [p.x+p.w-50,p.y+p.h-50]};
PANELS.forEach(p => { p.poly = SHAPE[p.id](p); p.rest = (REST[p.id] || (q => [q.x+q.w-44,q.y+q.h-46]))(p); p.cx = p.x+p.w/2; p.cy = p.y+p.h/2; });

/* the family, the same three as in our Flower Dome day: each drawn at a spot that gives the same face and clothes */
const FAM = {kid:{shirt:'#f4b829',hair:'bob',kid:true},mum:{shirt:'#f3a6bb',hair:'long'},dad:{shirt:'#76a0e2',hair:'short'}};
const HL = {short:7,bun:5,bob:3,long:3};
const hsh = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h*31+s.charCodeAt(i))>>>0; return h; };
const lookOf = n => [(n>>>1)%8,(n>>>4),(n>>>7)%7,(n>>>10)%6,(n>>>13)%3,(n>>>17)%8,(n>>>6)%5 === 0,(n>>>9)%5 === 0,(n>>>12)%7 === 0,(n>>>14)%5 === 0].join();
const SPOT = {};
function spot(who,arm){ const k = who+arm; if (SPOT[k]) return SPOT[k]; const o = FAM[who], key = n => lookOf(n).replace(/^(\d+),(\d+)/,(m,a,b) => a+','+(+b%HL[o.hair])), want = key(hsh(`${o.hair}${o.shirt}00down`));
  for (let i = 0; i < 4e6; i++){ const a = i%2000, b = Math.floor(i/2000); if (key(hsh(`${o.hair}${o.shirt}${a}${b}${arm}`)) === want) return SPOT[k] = [a*5,b*5]; }
  return SPOT[k] = [0,0]; }
const SAYS = {kid:['Bear hunt!','Crunchy!','Hop, plop!','Up, up, up!','I can\'t see!','Shh…','Run!','Who\'s that?','More honey?'],mum:['Got your boots?','Through it!','Careful, slippy!','Nearly there!','Hold my hand.','Tiptoe…','Quick, home!','Shh, hide!','Not scared one bit!'],dad:['Off we go!','Crunch, munch!','Big hop!','Clamber, clatter!','Tip-toe, hush.','What\'s that?','RUN!','Who\'s knocking?','Good bear!']};
let PN = 0;
function fam(who,x,y,o = {}){ const arm = o.arm || 'down', [a,b] = spot(who,arm); out.push(`<g transform="translate(${n1(x-a)} ${n1(y-b)})">`); person(a,b,{...FAM[who],...o,arm,say:SAYS[who][PN]}); out.push('</g>'); }

/* drawing helpers */
const yq = (x0,x1,z0,z1,y) => [P(x0,y,z0),P(x1,y,z0),P(x1,y,z1),P(x0,y,z1)], xq = (x,y0,y1,z0,z1) => [P(x,y0,z0),P(x,y1,z0),P(x,y1,z1),P(x,y0,z1)], zq = (x0,x1,y0,y1,z) => [P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)];
const solid = (x,y,z,w,d,h,col,top,ink = 1.1) => box(x,y,z,w,d,h,{left:col,top:top || litOf(col),marks:false,ink});
const quad = (q,col,w = .8) => { flat(q,col); if (w) rim(q,w,INK); };
const sh = (pts,col,w = 1.1) => { flat(pts,col); inkLoop(pts,{w,over:0}); };
const bl = (cx,cy,rx,ry,col,w = 1.1,b = .06) => { const q = blob(cx,cy,rx,ry,b,7); sh(q,col,w); return q; };
function cap(at,ls){ const [x,y] = at, w = Math.max(...ls.map((s,i) => s.length*(i ? 10.4 : 11.6)))+24, h = 16+ls.length*25, q = [[x,y],[x+w,y],[x+w,y+h],[x,y+h]]; out.push(`<path d="${pathOf(q)}Z" fill="#fffdf6"/>`); rim(q,1.1,INK); ls.forEach((s,i) => out.push(`<text x="${x+12}" y="${y+28+i*25}" class="tt" font-size="${i ? 17 : 19}" ${i ? '' : 'font-weight="600"'} fill="${INK}">${s}</text>`)); }
function talk(x,y,rx,ry,s,tx,ty){ const q = blob(x,y,rx,ry); out.push(`<path d="${pathOf([[x-12,y+ry-6],[tx,ty],[x+12,y+ry-6]])}Z" fill="#fffdf6"/>`); pen([[x-12,y+ry-5],[tx,ty],[x+12,y+ry-5]],1.1); out.push(`<path d="${pathOf(q)}Z" fill="#fffdf6"/>`); pen([...q,q[0]],1.1); out.push(`<text x="${x}" y="${y+7}" text-anchor="middle" class="it" font-size="21" fill="${INK}">${s}</text>`); }
const sfx = (id,x,y,s,size,col,rot = -8) => out.push(`<g class="sfx" id="${id}" style="opacity:0;transition:opacity .15s,transform .35s cubic-bezier(.3,1.9,.5,1);transform-box:fill-box;transform-origin:center;transform:scale(.3)"><text transform="translate(${x} ${y}) rotate(${rot})" text-anchor="middle" font-family="Impact,'Arial Black',sans-serif" font-size="${size}" fill="${col}" stroke="${INK}" stroke-width="1.6" letter-spacing="1">${s}</text></g>`);
const AUT = ['#e08a3c','#d4553a','#f2b84b','#c9702e','#e9a23b','#b8452f'];
const leafAt = (c,a,s,col) => leaf(c,a,16*s,7*s,col,true);
const tuft = (x,y) => out.push(`<path d="M${x-6} ${y}l2 -9M${x} ${y}l0 -12M${x+6} ${y}l-2 -9" stroke="#5f7a4f" stroke-width="1.3" fill="none" stroke-linecap="round"/>`);

/* the bear: round and soft, a cream tummy and snout. c is where its feet touch the ground */
function bear(c,s,{roar = false,sit = false,say = 'Grrr!'} = {}){ const B = '#9a6a45', L = '#e3c198', X = c[0], Y = c[1]; out.push(`<g class="who hit" data-say="${say}">`);
  ground(blob(X,Y+2,60*s,12*s));
  if (sit){ bl(X-34*s,Y-10*s,22*s,14*s,B); bl(X+34*s,Y-10*s,22*s,14*s,B); dot(X-48*s,Y-10*s,7*s,L,.8); dot(X+48*s,Y-10*s,7*s,L,.8); }
  else { bl(X-24*s,Y-14*s,18*s,16*s,B); bl(X+24*s,Y-14*s,18*s,16*s,B); }
  const by = sit ? Y-50*s : Y-58*s; bl(X,by,48*s,52*s,B,1.3); bl(X,by+8*s,30*s,32*s,L,.8);
  const arm = (side) => { if (roar){ const a = [X+side*44*s,by-26*s], e = [X+side*64*s,by-74*s]; out.push(`<path d="M${n1(a[0])} ${n1(a[1])}L${n1(e[0])} ${n1(e[1])}" stroke="${INK}" stroke-width="${n1(26*s)}" stroke-linecap="round"/><path d="M${n1(a[0])} ${n1(a[1])}L${n1(e[0])} ${n1(e[1])}" stroke="${B}" stroke-width="${n1(23*s)}" stroke-linecap="round"/>`); rule(lines(3,k => [[e[0]+(k-1)*6*s,e[1]-9*s],[e[0]+(k-1)*8*s,e[1]-17*s]]),INK,1.6); }
    else bl(X+side*42*s,by+4*s,13*s,24*s,B); };
  arm(-1); arm(1);
  const hy = by-60*s; for (const side of [-1,1]){ dot(X+side*30*s,hy-28*s,13*s,B,1.1); dot(X+side*30*s,hy-28*s,7*s,L,.5); }
  bl(X,hy,40*s,35*s,B,1.3); bl(X,hy+12*s,19*s,14*s,L,.8);
  out.push(`<ellipse cx="${n1(X)}" cy="${n1(hy+5*s)}" rx="${n1(6*s)}" ry="${n1(4.4*s)}" fill="#2f2520"/><circle cx="${n1(X-15*s)}" cy="${n1(hy-8*s)}" r="${n1(3.6*s)}" fill="${INK}"/><circle cx="${n1(X+15*s)}" cy="${n1(hy-8*s)}" r="${n1(3.6*s)}" fill="${INK}"/><circle cx="${n1(X-14*s)}" cy="${n1(hy-9.4*s)}" r="${n1(1.2*s)}" fill="#fff"/><circle cx="${n1(X+16*s)}" cy="${n1(hy-9.4*s)}" r="${n1(1.2*s)}" fill="#fff"/>`);
  if (roar) out.push(`<ellipse cx="${n1(X)}" cy="${n1(hy+20*s)}" rx="${n1(10*s)}" ry="${n1(8*s)}" fill="#7a2f2f" stroke="${INK}" stroke-width="1"/><path d="M${n1(X-6*s)} ${n1(hy+13*s)}l2 4 2 -4M${n1(X+2*s)} ${n1(hy+13*s)}l2 4 2 -4" fill="#fffdf6" stroke="${INK}" stroke-width=".5"/>`);
  else out.push(`<path d="M${n1(X-7*s)} ${n1(hy+15*s)}q${n1(7*s)} ${n1(7*s)} ${n1(14*s)} 0" fill="none" stroke="${INK}" stroke-width="1.3"/><ellipse cx="${n1(X-24*s)}" cy="${n1(hy+8*s)}" rx="${n1(5*s)}" ry="${n1(3*s)}" fill="#e58b8b" opacity=".7"/><ellipse cx="${n1(X+24*s)}" cy="${n1(hy+8*s)}" rx="${n1(5*s)}" ry="${n1(3*s)}" fill="#e58b8b" opacity=".7"/>`);
  out.push('</g>'); }
const basket = (c,s = 1) => { const q = [[c[0]-20*s,c[1]-22*s],[c[0]+20*s,c[1]-22*s],[c[0]+16*s,c[1]],[c[0]-16*s,c[1]]]; sh(q,'#c08a5a'); rule(lines(3,k => [[c[0]-18*s,c[1]-16*s+k*6*s],[c[0]+18*s,c[1]-16*s+k*6*s]]),'#8c6242',.8); out.push(`<path d="M${n1(c[0]-14*s)} ${n1(c[1]-22*s)}q${n1(14*s)} ${n1(-22*s)} ${n1(28*s)} 0" fill="none" stroke="${INK}" stroke-width="2.4"/><path d="M${n1(c[0]-14*s)} ${n1(c[1]-22*s)}q${n1(14*s)} ${n1(-22*s)} ${n1(28*s)} 0" fill="none" stroke="#c08a5a" stroke-width="1.2"/>`); quad([[c[0]-20*s,c[1]-22*s],[c[0]-4*s,c[1]-22*s],[c[0]-8*s,c[1]-30*s],[c[0]-22*s,c[1]-28*s]],'#d4553a',.6); };

const scene = {
  start(p){ OX = p.cx+20; OY = p.cy+40;
    out.push(`<rect x="${p.x}" y="${p.cy-10}" width="${p.w}" height="${p.h}" fill="#b6dd8e"/>`);
    quad(zq(-400,400,-60,400,0),'#b6dd8e',0); dot(p.x+p.w-70,p.y+90,24,'#f7d26a',.9);
    /* home: a corner of the house and the garden fence with its gate open */
    solid(-330,-330,0,170,170,180,'#f3e3c4','#ef6a4c'); openL(-300,-160,60,50,60,6,'#bfe0f5',B => { flat(B,'#bfe0f5'); rim(B,.7,INK); });
    fence([[-150,-70],[-40,-70]]); fence([[40,-70],[260,-70]]);
    { const g = [P(40,-70,0),P(40,-20,0),P(40,-20,28),P(40,-70,28)]; quad(g,'#d8c09a',.8); rule(lines(4,i => [P(40,-66+i*12,2),P(40,-66+i*12,26)]),INK,.5); }
    for (let i = 0; i < 12; i++) tuft(p.x+30+(i*37)%(p.w-40),p.cy+70+(i*53)%120);
    fam('dad',...P(20,60,0),{arm:'hold',look:1,size:1.05}); basket([P(20,60,0)[0]+28,P(20,60,0)[1]-26],.8); fam('kid',...P(-30,100,0),{arm:'up',look:1,size:1.1}); fam('mum',...P(-80,60,0),{arm:'wave',look:1,size:1.05});
    talk(p.x+300,p.y+130,84,30,'Bear hunt!',P(-30,100,0)[0]+10,P(-30,100,0)[1]-100); },
  leaves(p){ OX = p.cx; OY = p.cy+40; const c = [p.cx+10,p.y+p.h-70];
    out.push(`<rect x="${p.x}" y="${p.cy-20}" width="${p.w}" height="${p.h}" fill="#d9c49a"/>`);
    for (const [x,r,col] of [[p.x+60,60,'#e9a23b'],[p.x+p.w-70,70,'#d4553a'],[p.x+p.w/2-40,50,'#f2b84b']]){ quad([[x-7,p.cy+10],[x+7,p.cy+10],[x+6,p.y+60],[x-6,p.y+60]],'#8c6242',.9); bl(x,p.y+70,r,r*.7,col); }
    /* the pile: the family wade in, the front of the pile covers their legs */
    bl(c[0],c[1]-30,190,62,'#e08a3c',1.2,.12);
    fam('mum',c[0]-110,c[1]-6,{arm:'up',look:1,size:1.05}); fam('kid',c[0]-20,c[1]+10,{arm:'up',look:1,size:1.1}); fam('dad',c[0]+90,c[1]-4,{arm:'out',look:-1,size:1.05});
    bl(c[0],c[1]+18,210,40,'#d9823b',1.2,.14);
    for (let i = 0; i < 70; i++){ const a = rnd()*6.28, r = Math.sqrt(rnd()), q = [c[0]+Math.cos(a)*r*200,c[1]+10+Math.sin(a)*r*44]; leafAt(q,rnd()*6.28,.9+rnd()*.5,AUT[i%AUT.length]); }
    for (let i = 0; i < 9; i++) leafAt([p.x+60+i*42,p.y+110+(i%3)*40],i,1.1,AUT[(i+2)%AUT.length]); },
  brook(p){ OX = p.cx-10; OY = p.cy+20;
    quad(zq(-500,500,-500,500,0),'#b6dd8e',0); quad(zq(-500,500,-40,50,0),'#8cc9ea',0); rule(lines(14,i => { const a = P(-260+i*40,-30+(i%3)*30,0); return [a,[a[0]+22,a[1]-4]]; }),'#e8f6fb',1.6); pen([P(-500,-40,0),P(500,-40,0)],1); pen([P(-500,50,0),P(500,50,0)],1);
    for (const [x,y] of [[-40,-20],[0,4],[40,30]]) cyl(x,y,0,20,6,'#a6a39c',{ink:1,cap:'#c8c4bc'});
    for (const [x,y] of [[-200,-70],[180,-60],[-160,70],[230,80]]) reeds(x,y);
    fam('dad',...P(-90,-80,0),{arm:'wave',look:1,size:1}); fam('kid',...P(0,4,6),{arm:'up',look:1,size:1.1}); fam('mum',...P(90,90,0),{arm:'out',look:-1,size:1.05}); },
  hill(p){ OX = p.cx; OY = p.cy;
    const H = [[p.x-10,p.y+p.h+10],[p.x-10,p.y+p.h*.36],[p.x+p.w*.22,p.y+p.h*.3],[p.x+p.w*.5,p.y+p.h*.5],[p.x+p.w*.78,p.y+p.h*.72],[p.x+p.w+10,p.y+p.h*.78],[p.x+p.w+10,p.y+p.h+10]];
    sh(spline(H,false,4),'#b9ae98',1.3);
    for (let i = 0; i < 16; i++){ const u = rnd(), x = p.x+u*p.w, y = p.y+p.h*(.4+u*.4)+rnd()*90; bl(x,y,12+rnd()*14,8+rnd()*8,['#a39b8f','#8f877c','#b7ae9f'][i%3],.9,.15); }
    for (let i = 0; i < 8; i++) tuft(p.x+40+i*52,p.y+p.h*.55+i*18);
    fam('dad',p.x+p.w*.24,p.y+p.h*.44,{arm:'up',look:-1,size:1}); fam('kid',p.x+p.w*.48,p.y+p.h*.6,{arm:'up',look:-1,size:1.05}); fam('mum',p.x+p.w*.7,p.y+p.h*.78,{arm:'up',look:-1,size:1}); },
  fog(p){ OX = p.cx; OY = p.cy;
    out.push(`<rect x="${p.x}" y="${p.cy+60}" width="${p.w}" height="${p.h}" fill="#b9bfb0"/>`);
    out.push('<g opacity=".72">'); fam('mum',p.cx-90,p.cy+110,{arm:'out',look:1,size:1}); fam('kid',p.cx-10,p.cy+120,{arm:'out',look:1,size:1.05}); fam('dad',p.cx+70,p.cy+108,{arm:'out',look:1,size:1}); out.push('</g>');
    for (const [k,cls] of [[0,'drift'],[1,'drift b'],[2,'drift']]){ out.push(`<g class="${cls}" opacity=".62">`); for (let i = 0; i < 5; i++) { const q = blob(p.x+30+i*90+(k*40)%70,p.y+90+k*80+(i%2)*26,70,30,.12,6); out.push(`<path d="${pathOf(q)}Z" fill="#f4f6f7"/>`); } out.push('</g>'); } },
  cave(p){ OX = p.cx; OY = p.cy; const m = [p.cx,p.y+p.h-36], W = 130, Hh = 170;
    for (let i = 0; i < 14; i++) bl(p.x+(i*67)%p.w,p.y+40+(i*41)%(p.h-60),40+(i%3)*16,26+(i%2)*12,['#9a9184','#857c70','#a39a8c'][i%3],.8,.15);
    out.push(`<rect x="${p.x}" y="${m[1]}" width="${p.w}" height="60" fill="#6f675c"/>`);
    const mouth = [[m[0]-W,m[1]],...lines(25,i => { const t = Math.PI+i/24*Math.PI; return [m[0]+W*Math.cos(t),m[1]+Hh*Math.sin(t)*.95]; }),[m[0]+W,m[1]]]; sh(mouth,'#241f2a',1.6);
    out.push(`<g id="eyes"><circle cx="${m[0]-24}" cy="${m[1]-100}" r="8" fill="#f7d26a"/><circle cx="${m[0]+24}" cy="${m[1]-100}" r="8" fill="#f7d26a"/><circle cx="${m[0]-22}" cy="${m[1]-100}" r="3" fill="${INK}"/><circle cx="${m[0]+26}" cy="${m[1]-100}" r="3" fill="${INK}"/></g><ellipse cx="${m[0]}" cy="${m[1]-80}" rx="9" ry="6" fill="#4a3b36"/>`);
    out.push(`<text id="huh" x="${m[0]+40}" y="${m[1]-120}" font-family="Impact,'Arial Black',sans-serif" font-size="40" fill="#f7d26a" style="display:none">?</text>`);
    fam('dad',p.x+70,p.y+p.h-24,{arm:'front',look:1,size:1}); fam('mum',p.x+p.w-60,p.y+p.h-20,{arm:'front',look:-1,size:1}); fam('kid',m[0]+70,p.y+p.h-10,{arm:'front',look:-1,size:1.05}); },
  bear(p){ OX = p.cx; OY = p.cy;
    rule(lines(24,i => { const t = i/24*6.283; return [[p.cx+Math.cos(t)*60,p.cy+Math.sin(t)*50],[p.cx+Math.cos(t)*320,p.cy+Math.sin(t)*260]]; }),'#e9b43a',3);
    bear([p.x+p.w*.38,p.y+p.h-46],1.35,{roar:true,say:'ROARRR!'});
    fam('dad',p.x+p.w*.68,p.y+p.h-70,{arm:'up',look:1,size:.95}); fam('kid',p.x+p.w*.78,p.y+p.h-52,{arm:'up',look:1,size:1}); fam('mum',p.x+p.w*.88,p.y+p.h-86,{arm:'up',look:1,size:.95});
    rule(lines(4,i => [[p.x+p.w*.62,p.y+p.h-150+i*22],[p.x+p.w*.66-30,p.y+p.h-150+i*22]]),INK,1.4); },
  blanket(p){ OX = p.cx+40; OY = p.cy+150;
    quad(zq(-300,300,-300,300,0),'#c9a97e',0); quad(xq(-230,-300,300,0,320),'#f3e3c4',0); quad(yq(-300,300,0,320,-230),'#ecd8b6',0); rule([[P(-230,-230,0),P(-230,-230,320)]],INK,1);
    quad(yq(40,120,0,190,-229),'#c08a5a',1); dot(...P(108,-229,95),4,'#f2b84b',.6);
    solid(-226,-110,0,200,200,30,'#8c6f9c');
    /* the blanket over a lump of three, six eyes peeking from the top edge */
    const c = P(-130,-10,30), q = [...lines(25,i => { const t = Math.PI+i/24*Math.PI; return [c[0]+150*Math.cos(t),c[1]+8+118*Math.sin(t)]; }),[c[0]+150,c[1]+26],[c[0]-150,c[1]+26]]; sh(q,'#a9c8ee',1.4); out.push(lines(14,i => `<circle cx="${n1(c[0]-110+(i*41)%220)}" cy="${n1(c[1]-70+(i*29)%90)}" r="5" fill="#fffdf6" opacity=".8"/>`).join(''));
    out.push('<g class="peek">'); for (const [dx,r] of [[-70,10],[0,8],[70,10]]){ const e = [c[0]+dx,c[1]-112+Math.abs(dx)*.5]; for (const s of [-1,1]) out.push(`<ellipse cx="${n1(e[0]+s*r)}" cy="${n1(e[1])}" rx="${n1(r*.75)}" ry="${n1(r)}" fill="#fffdf6" stroke="${INK}" stroke-width="1"/><circle cx="${n1(e[0]+s*r+3)}" cy="${n1(e[1]+1)}" r="${n1(r*.36)}" fill="${INK}"/>`); } out.push('</g>'); },
  surprise(p){ OX = p.cx; OY = p.cy+90;
    quad(zq(-140,140,-100,140,0),'#fffdf6',1); for (let a = 0; a < 7; a++) for (let b = 0; b < 6; b++) if ((a+b)%2) quad(zq(-140+a*40,-100+a*40,-100+b*40,-60+b*40,.2),'#e0574a',0);
    bear(P(-20,-70,0),.92,{sit:true,say:'Yum, honey!'}); basket(P(60,-90,0),1);
    cyl(10,10,0,14,26,'#f2b84b',{ink:1,cap:'#c99b20'}); { const t = P(10,10,13); out.push(`<text x="${n1(t[0])}" y="${n1(t[1]+4)}" text-anchor="middle" class="tt" font-size="10" fill="${INK}">HONEY</text>`); }
    for (const [x,y] of [[-60,30],[60,40],[-10,80]]){ const a = P(x,y,1); sh([[a[0]-14,a[1]+6],[a[0]+14,a[1]+6],[a[0],a[1]-12]],'#f4e0b0',.8); }
    fam('kid',...P(120,-10,0),{arm:'up',look:-1,size:1.05,sit:6}); fam('mum',...P(-120,60,0),{arm:'lap',look:1,size:1,sit:6}); fam('dad',...P(60,140,0),{arm:'wave',look:-1,size:1,sit:6});
    for (const [x,y,s] of [[p.x+p.w-70,p.y+60,1],[p.x+p.w-40,p.y+120,.8]]) out.push(`<path d="M${x} ${y+14*s}C${x-26*s} ${y-8*s} ${x-6*s} ${y-22*s} ${x} ${y-6*s}C${x+6*s} ${y-22*s} ${x+26*s} ${y-8*s} ${x} ${y+14*s}Z" fill="#e0574a" stroke="${INK}" stroke-width="1"/>`);
    talk(p.x+118,p.y+140,100,30,'Honey, please?',P(-20,-70,0)[0]-20,P(-20,-70,0)[1]-110); }
};

function draw(seed){
  begin(seed); OX = 700; OY = 700;
  out.push(`<defs>${PANELS.map((p,i) => `<clipPath id="bh${i}"><path d="${pathOf(p.poly)}Z"/></clipPath>`).join('')}</defs>`);
  title('a comic strip · after the old campfire chant','The Bear Hunt');
  out.push(`<text x="72" y="236" class="it" font-size="21" fill="${LEAD}">We're going on a bear hunt! Boots on, hats on, off we go! Are we scared? Not one bit!</text>`);
  PANELS.forEach((p,i) => { PN = i;
    out.push(`<g clip-path="url(#bh${i})" data-state="${p.id}"><rect x="${p.x-20}" y="${p.y-20}" width="${p.w+40}" height="${p.h+40}" fill="${p.bg}"/>`); scene[p.id](p); flush(); OX = 700; OY = 700; cap((CAP[p.id] || (q => [q.x+14,q.y+14]))(p),p.cap);
    out.push(`<rect class="veil" id="veil${i}" x="${p.x-20}" y="${p.y-20}" width="${p.w+40}" height="${p.h+40}" fill="#f6f1e6" style="opacity:0;transition:opacity .8s"/></g>`);
    rim(p.poly,1.7,INK); out.push(`<path id="lit${i}" d="${pathOf(p.poly)}Z" fill="none" stroke="${RED}" stroke-width="5" stroke-linejoin="round" style="opacity:0;transition:opacity .4s"/>`); });
  /* the way through: red arrows across the gutters, the order the eye reads */
  const rt = pts => { line(pts,{w:1.9,col:RED,amp:.4,over:0}); const [a,b] = pts.slice(-2), l = Math.hypot(b[0]-a[0],b[1]-a[1]), u = [(b[0]-a[0])/l,(b[1]-a[1])/l]; fill([[b[0]+u[0]*13,b[1]+u[1]*13],[b[0]-u[1]*6.5,b[1]+u[0]*6.5],[b[0]+u[1]*6.5,b[1]-u[0]*6.5]],RED,{dx:0,dy:0,amp:.1}); };
  for (const [a,b] of [[0,1],[1,2],[3,4],[4,5],[6,7],[7,8]]){ const A = PANELS[a], B = PANELS[b], y = Math.max(A.y,B.y)+Math.min(A.h,B.h)/2+40; rt([[A.x+A.w-(a === 0 ? 20 : 4),y],[B.x+6,y]]); }
  for (const [a,b] of [[2,3],[5,6]]){ const A = PANELS[a], B = PANELS[b], g = (A.y+A.h+B.y)/2; rt([[A.cx,A.y+A.h-6],[A.cx,g],[B.cx,g],[B.cx,B.y+16]]); }
  /* the run home, shown only once the bear roars: back through every place to the blanket */
  const RUN = [6,5,4,3,2,1,0,7].map(k => PANELS[k].rest);
  out.push(`<path id="runway" d="${pathOf(RUN)}" fill="none" stroke="${RED}" stroke-width="3" stroke-dasharray="10 9" stroke-linecap="round" style="opacity:0;transition:opacity .5s"/>`);
  const S = (k,dx,dy,s,size,col,rot) => sfx('fx'+k,PANELS[k].x+dx,PANELS[k].y+dy,s,size,col,rot);
  S(0,280,220,'STOMP STOMP',34,'#fbf7ec',-6); S(1,300,150,'CRUNCH MUNCH!',38,'#f2b84b',-6); S(2,320,120,'HOP! PLOP!',42,'#e8f6fb',-8); S(3,300,110,'CLAMBER CLATTER!',30,'#fbf7ec',-4);
  S(4,200,130,'tip-toe… hush…',32,'#fbf7ec',-3); S(6,250,130,'ROARRR!',78,'#e0574a',-8); S(7,290,140,'KNOCK KNOCK!',32,'#fbf7ec',8); S(8,120,320,'YUM!',40,'#f2b84b',-10);
  sfx('stomp',PANELS[5].x+110,PANELS[5].y+250,'STOMP!',50,'#e0574a',-8); sfx('grr',PANELS[5].x+300,PANELS[5].y+190,'GRRR…',44,'#f7d26a',6);
  out.push(`<text x="72" y="1384" class="it" font-size="15" fill="${LEAD}">After the traditional campfire chant. Our own places, sounds and friendly bear, drawn for a little one.</text>`);
  /* the sticker that travels: a red paw */
  group('id="token"',() => { out.push(`<circle r="21" fill="${RED}" stroke="${INK}" stroke-width="1.4"/><ellipse cx="0" cy="5" rx="9" ry="7.5" fill="#fffdf6"/>`+[[-10,-6],[-4,-11],[4,-11],[10,-6]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#fffdf6"/>`).join('')); });
  finish();
}

function init(ctx){
  const $ = id => document.getElementById(id), token = $('token'), ids = PANELS.map(p => p.id);
  let i = 0, noisy = false, moving = null, playing = false, timer = 0, knock = 0;
  const seat = q => token.setAttribute('transform',`translate(${n1(q[0])} ${n1(q[1])})`);
  const pop = (id,ms = 2400) => { const g = $(id); if (!g) return; g.style.opacity = 1; g.style.transform = 'scale(1)'; setTimeout(() => { g.style.opacity = 0; g.style.transform = 'scale(.3)'; },ms); };
  const hide = id => { const g = $(id); g.style.opacity = 0; g.style.transform = 'scale(.3)'; };
  const look = k => { const p = PANELS[k]; ctx.focus(p.cx,p.cy,Math.min(2.6,1400/(Math.max(p.w,p.h)+120))); };
  const show = () => PANELS.forEach((p,k) => { $('veil'+k).style.opacity = k > i ? .62 : 0; $('lit'+k).style.opacity = k === i ? 1 : 0; });
  const way = (a,b) => { const A = PANELS[a].rest, B = PANELS[b].rest; if (Math.floor(a/3) === Math.floor(b/3)) return [A,B];
    const g = (PANELS[a].y+PANELS[a].h+PANELS[b].y)/2; return [A,[A[0],g],[B[0],g],B]; };
  function arrive(){ const p = PANELS[i]; show(); look(i); pop('fx'+i); ctx.say(p.say);
    ctx.hint(p.id === 'cave' ? 'press Stomp! to see what happens' : i === 8 ? 'the end! press Next to go again' : 'tap anyone to hear them');
    if (p.id === 'blanket'){ clearTimeout(knock); knock = setTimeout(() => pop('fx7'),1400); }
    if (playing) timer = setTimeout(step,p.id === 'bear' ? 2200 : 3400); }
  function goTo(k,path,rate = 1.1){ i = k; moving = {path,d:0,rate,pass:-1}; window.wake?.(); }
  function runHome(){ $('runway').style.opacity = .9; ctx.say('Quick! Back through the fog, down the hill, across the brook, through the leaves, in the gate…'); goTo(7,[6,5,4,3,2,1,0,7].map(k => PANELS[k].rest),.22); moving.run = [6,5,4,3,2,1,0,7]; }
  function reset(){ playing = false; clearTimeout(timer); i = 0; noisy = false; $('runway').style.opacity = 0; $('huh').style.display = 'none'; seat(PANELS[0].rest); ctx.focus(700,700,1,.01); show(); ctx.say('Back to the start. Boots on, hats on, off we go again!'); ctx.hint('tap anyone to hear them'); }
  function step(){ clearTimeout(timer);
    if (moving) return ctx.say('Wait a moment: we are still on our way.');
    const id = ids[i];
    if (id === 'cave' && noisy){ noisy = false; $('huh').style.display = 'none'; hide('stomp'); hide('grr'); ctx.say('Shh… let\'s try again, very, very quietly. Tip-toe…'); if (playing) timer = setTimeout(step,1800); return; }
    if (id === 'bear') return runHome();
    if (i === 8) return reset();
    goTo(i+1,way(i,i+1)); }
  ctx.button('next stop',() => { playing = false; step(); });
  ctx.button('play it in order',() => { if (playing) return ctx.say('We are already on our way!'); if (i === 8) reset(); playing = true; step(); });
  ctx.button('stomp!',() => {
    const id = ids[i];
    if (moving) return ctx.say('Wait a moment: we are still on our way.');
    if (id !== 'cave') return ctx.say(i < 5 ? 'Not here! Save your stomps for later.' : id === 'bear' ? 'No time to stomp: run home!' : 'Shh! We\'re hiding. No stomping now.');
    if (noisy) return ctx.say('Already stomped! Press Next to try again quietly.');
    noisy = true; playing = false; clearTimeout(timer); pop('stomp',2000); setTimeout(() => pop('grr',2200),500); const e = $('eyes'); e.classList.remove('blink'); e.getBBox(); e.classList.add('blink'); $('huh').style.display = '';
    ctx.say('STOMP! Grrr… the bear grumbles in its sleep. Shh! Press Next to tiptoe in again.'); });
  seat(PANELS[0].rest); show(); ctx.say('Press Next step to start the hunt, or Play all to watch it all.'); ctx.hint('tap anyone to hear them');
  return { tick(t,dt){ if (!moving) return false; const m = moving; m.d = Math.min(1,m.d+dt*m.rate); const n = m.path.length-1, u = m.d*n, k = Math.min(n-1,Math.floor(u)), f = u-k, e = f*f*(3-2*f), a = m.path[k], b = m.path[k+1], q = [lerp(a[0],b[0],e),lerp(a[1],b[1],e)];
      if (m.run && k !== m.pass){ m.pass = k; if (k > 0 && m.run[k] <= 4) pop('fx'+m.run[k],1200); }
      seat(q); ctx.focus(q[0],q[1],m.run ? 1.35 : 1.6); if (m.d >= 1){ moving = null; arrive(); } return true; },
    stop(){ clearTimeout(timer); clearTimeout(knock); } };
}
