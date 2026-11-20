/* a comic page for a small child: one family's day out to an indoor flower garden, nine panels read left to right.
   Every panel is a state; a little red flower sticker hops along the gutters to the panel we are in, the camera
   leans in on it, and the panels still to come wait under a paper veil. The photo panel has the one detour:
   a sneeze spoils the picture, so it is taken again before we may go on. */
const GX = [36,489,942], GW = 422, GY = 248, GH = 356, GAP = 18;
const PANELS = [
  {id:'wake',bg:'#f6ecd6',cap:['1 · Garden day!','Hat, bottle, bag!'],say:'Wake up! Today is garden day!'},
  {id:'train',bg:'#eef0ea',cap:['2 · Whoosh!','We count the stops.'],say:'Beep! Through the gates. Whoosh, here comes the train!'},
  {id:'dome',bg:'#dcecf3',cap:['3 · A giant bubble','Brrr! Cool inside.'],say:'A giant glass bubble! Inside it is cool, like spring.'},
  {id:'flowers',bg:'#f4ede0',cap:['4 · So many flowers','Sniff, gently!'],say:'Red, yellow, pink and purple. We look with our eyes, not our hands.'},
  {id:'fountain',bg:'#e6eef0',cap:['5 · Splish splash','A tiny rainbow!'],say:'Splish, splash! Can you see the tiny rainbow?'},
  {id:'tree',bg:'#f3ecdc',cap:['6 · The bottle tree','Fat and funny!'],say:'A tree like a giant bottle. It keeps water inside, like a camel.'},
  {id:'photo',bg:'#f6ecd6',cap:['7 · Say cheese!','One, two, three…'],say:'Everyone together. One, two, three… cheese!'},
  {id:'snack',bg:'#eef0e4',cap:['8 · Snack time','Bye-bye, flowers!'],say:'A snack on the bench. Bye-bye, flowers! Bye-bye, fountain!'},
  {id:'home',bg:'#333a5c',cap:['9 · Goodnight','Can we go again?'],say:'Clickety-clack, home and to bed. Goodnight, flowers!'}];
PANELS.forEach((p,i) => { p.x = GX[i%3]; p.y = GY+Math.floor(i/3)*(GH+GAP); p.poly = [[p.x,p.y],[p.x+GW,p.y],[p.x+GW,p.y+GH],[p.x,p.y+GH]]; p.rest = [p.x+GW-30,p.y+30]; });

/* the family: the kit picks a face from where a person stands, so each of us is drawn at a spot found to give
   the same face, hair and clothes as our first drawing, whatever the pose */
const FAM = {kid:{shirt:'#f4b829',hair:'bob',kid:true},mum:{shirt:'#f3a6bb',hair:'long'},dad:{shirt:'#76a0e2',hair:'short'}};
const HL = {short:7,bun:5,bob:3,long:3};
const hsh = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h*31+s.charCodeAt(i))>>>0; return h; };
const lookOf = n => [(n>>>1)%8,(n>>>4),(n>>>7)%7,(n>>>10)%6,(n>>>13)%3,(n>>>17)%8,(n>>>6)%5 === 0,(n>>>9)%5 === 0,(n>>>12)%7 === 0,(n>>>14)%5 === 0].join();
const SPOT = {};
function spot(who,arm){ const k = who+arm; if (SPOT[k]) return SPOT[k]; const o = FAM[who], key = n => lookOf(n).replace(/^(\d+),(\d+)/,(m,a,b) => a+','+(+b%HL[o.hair])), want = key(hsh(`${o.hair}${o.shirt}00down`));
  for (let i = 0; i < 4e6; i++){ const a = i%2000, b = Math.floor(i/2000); if (key(hsh(`${o.hair}${o.shirt}${a}${b}${arm}`)) === want) return SPOT[k] = [a*5,b*5]; }
  return SPOT[k] = [0,0]; }
const SAYS = {kid:['Garden day!','Choo choo!','Wow!','Pretty!','Splash!','A bottle tree!','Cheese!','Yummy!','Goodnight!'],mum:['Good morning!','Hold my hand.','Look up!','Sniff gently.','A rainbow!','So big!','Cheese!','Bye-bye, flowers!','Sweet dreams.'],dad:['Got the bottles?','Three more stops.','Here we are!','Look at the colours!','Count the splashes!','It drinks lots of water.','Cheese!','More juice?','Sleep tight.']};
let PN = 0;
function fam(who,x,y,o = {}){ const arm = o.arm || 'down', [a,b] = spot(who,arm); out.push(`<g transform="translate(${n1(x-a)} ${n1(y-b)})">`); person(a,b,{...FAM[who],...o,arm,say:SAYS[who][PN]}); out.push('</g>'); }

/* small drawing helpers, as in the kit's comic example */
const yq = (x0,x1,z0,z1,y) => [P(x0,y,z0),P(x1,y,z0),P(x1,y,z1),P(x0,y,z1)], xq = (x,y0,y1,z0,z1) => [P(x,y0,z0),P(x,y1,z0),P(x,y1,z1),P(x,y0,z1)], zq = (x0,x1,y0,y1,z) => [P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)];
const lines = (n,f) => Array.from({length:n},(_,i) => f(i));
const solid = (x,y,z,w,d,h,col,top,ink = 1.1) => box(x,y,z,w,d,h,{left:col,top:top || litOf(col),marks:false,ink});
const quad = (q,col,w = .8) => { flat(q,col); if (w) rim(q,w,INK); };
const cap = (p,ls) => { const x = p.x+12, y = p.y+12, w = Math.max(...ls.map((s,i) => s.length*(i ? 10.4 : 11.6)))+24, h = 16+ls.length*25, q = [[x,y],[x+w,y],[x+w,y+h],[x,y+h]]; out.push(`<path d="${pathOf(q)}Z" fill="#fffdf6"/>`); rim(q,1.1,INK); ls.forEach((s,i) => out.push(`<text x="${x+12}" y="${y+28+i*25}" class="tt" font-size="${i ? 17 : 19}" ${i ? '' : 'font-weight="600"'} fill="${INK}">${s}</text>`)); };
function talk(x,y,rx,ry,s,tx,ty){ const q = blob(x,y,rx,ry); out.push(`<path d="${pathOf([[x-12,y+ry-6],[tx,ty],[x+12,y+ry-6]])}Z" fill="#fffdf6"/>`); pen([[x-12,y+ry-5],[tx,ty],[x+12,y+ry-5]],1.1); out.push(`<path d="${pathOf(q)}Z" fill="#fffdf6"/>`); pen([...q,q[0]],1.1); out.push(`<text x="${x}" y="${y+7}" text-anchor="middle" class="it" font-size="21" fill="${INK}">${s}</text>`); }
const sfx = (id,x,y,s,size,col,rot = -8) => out.push(`<g class="sfx" id="${id}" style="opacity:0;transition:opacity .15s,transform .35s cubic-bezier(.3,1.9,.5,1);transform-box:fill-box;transform-origin:center;transform:scale(.3)"><text transform="translate(${x} ${y}) rotate(${rot})" text-anchor="middle" font-family="Impact,'Arial Black',sans-serif" font-size="${size}" fill="${col}" stroke="${INK}" stroke-width="1.6" letter-spacing="1">${s}</text></g>`);
const FLOW = ['#ef6a4c','#f4b829','#f3a6bb','#b9a6d6','#fffdf6','#e0574a','#f7d26a'];
/* a flower head: petals round a gold eye, on a sheet point */
function bloom(c,r,col){ const pts = lines(5,i => { const t = i/5*6.283-1.57; return [c[0]+Math.cos(t)*r*.62,c[1]+Math.sin(t)*r*.5]; }); out.push(pts.map(p => `<ellipse cx="${n1(p[0])}" cy="${n1(p[1])}" rx="${n1(r*.5)}" ry="${n1(r*.42)}" fill="${col}" stroke="${INK}" stroke-width=".6"/>`).join('')+`<circle cx="${n1(c[0])}" cy="${n1(c[1])}" r="${n1(r*.3)}" fill="#e3a72f" stroke="${INK}" stroke-width=".5"/>`); }
/* a bed of flowers along world x at depth y: leaves first, then the heads */
function bed(x0,x1,y,z,{n = 9,r = 9,seed = 0} = {}){ const g = blob(...P((x0+x1)/2,y,z+8),Math.abs(P(x1,y)[0]-P(x0,y)[0])/2+14,20,.08,6); flat(g,'#93c79d'); inkLoop(g,{w:.9,over:0});
  for (let i = 0; i < n; i++){ const u = lerp(x0,x1,(i+.5)/n), c = P(u,y+((i*7+seed)%3-1)*6,z+16+((i+seed)%2)*6); pen([[c[0],c[1]+r],[c[0],c[1]+r+12]],.8); bloom(c,r,FLOW[(i+seed)%FLOW.length]); } }
const leafy = (c,rx,ry,col = '#93c79d') => { const b = blob(c[0],c[1],rx,ry,.1,7); flat(b,col); inkLoop(b,{w:1,over:0}); const h = blob(c[0]-rx*.3,c[1]-ry*.3,rx*.35,ry*.3); flat(h,mixC(col,'#ffffff',.3)); };
const head = (c,r,hair) => { dot(c[0],c[1],r,'#f6e2cc',.9); out.push(`<path d="M${n1(c[0]-r)} ${n1(c[1]-1)}Q${n1(c[0])} ${n1(c[1]-r*1.9)} ${n1(c[0]+r)} ${n1(c[1]-1)}Q${n1(c[0])} ${n1(c[1]-r*.8)} ${n1(c[0]-r)} ${n1(c[1]-1)}Z" fill="${hair}" stroke="${INK}" stroke-width=".7"/><circle cx="${n1(c[0]-r*.35)}" cy="${n1(c[1]+r*.1)}" r="1.4" fill="${INK}"/><circle cx="${n1(c[0]+r*.35)}" cy="${n1(c[1]+r*.1)}" r="1.4" fill="${INK}"/><path d="M${n1(c[0]-r*.3)} ${n1(c[1]+r*.45)}q${n1(r*.3)} ${n1(r*.3)} ${n1(r*.6)} 0" fill="none" stroke="${INK}" stroke-width=".8"/>`); };

const scene = {
  wake(p){ OX = p.x+GW/2+40; OY = p.y+GH/2+110;
    quad(zq(-230,230,-230,230,0),'#d8bf92',0); rule(lines(24,i => [P(-230,-230+i*20,0),P(230,-230+i*20,0)]),'#a8875c',.5,.7);
    quad(xq(-230,-230,230,0,300),'#f3e3c4',0); quad(yq(-230,230,0,300,-230),'#ecd8b6',0); rule([[P(-230,-230,0),P(-230,-230,300)]],INK,1);
    rule(lines(14,i => [P(-230,-230+i*34,0),P(-230,-230+i*34,300)]),'#e2cba2',.6,.7);
    openL(-150,-230,110,120,110,10,'#bfe0f5',B => { flat(B,'#bfe0f5'); const c = [lerp(B[0][0],B[2][0],.62),lerp(B[0][1],B[2][1],.4)]; dot(c[0],c[1],16,'#f7d26a',.8); rule(lines(8,i => { const t = i/8*6.283; return [[c[0]+Math.cos(t)*21,c[1]+Math.sin(t)*21],[c[0]+Math.cos(t)*28,c[1]+Math.sin(t)*28]]; }),'#e3a72f',1.4); rim(B,.8,INK); });
    /* the bed against the left wall, the blanket thrown back */
    solid(-226,-90,0,150,110,34,'#c08a5a'); solid(-226,-90,34,150,110,14,'#fffdf6'); quad(zq(-150,-76,-90,20,48.2),'#a9c8ee'); quad(xq(-226,-90,20,34,90),'#c08a5a'); solid(-220,-80,48,40,90,10,'#fffdf6');
    /* the backpack, packed */
    solid(30,-160,0,40,28,50,'#ef6a4c'); quad(yq(34,66,26,46,-132),mixC('#ef6a4c','#ffffff',.25)); cyl(86,-150,0,10,34,'#8cc9ea',{ink:.9,cap:'#3d79a8'});
    fam('mum',...P(70,60,0),{arm:'wave',look:-1,size:1.2}); fam('kid',...P(-20,80,0),{arm:'up',look:1,size:1.25});
    talk(p.x+300,p.y+150,92,30,'Garden day!',P(-20,80,0)[0]+6,P(-20,80,0)[1]-120); },
  train(p){ OX = p.x+GW/2+40; OY = p.y+GH/2+20;
    quad(zq(-500,500,-200,500,-14),'#8a837b',0); quad(zq(-500,500,60,500,0),'#d9d3c4',0); rule(lines(22,i => [P(-500+i*46,60,0),P(-500+i*46,500,0)]),'#b9b0a2',.5,.7); quad(zq(-500,500,60,74,0),'#f2c84b',.5);
    /* the car: a long box, a blue band, big windows with our faces at them */
    const y = 40, d = 80, X0 = -300, X1 = 150; solid(X0,y-d,-10,X1-X0,d,110,'#eeeae2','#d9dde0',1.2); quad(yq(X0,X1,30,40,y),'#5f86b5',0); quad(yq(X0,X1,-10,6,y),'#5d5a63',.6);
    for (const [a,b] of [[-280,-200],[-120,-40],[40,110]]) quad(yq(a,b,48,92,y),'#cfe2e8',.9);
    head(P(-262,y,64),12,'#2f2520'); head(P(-240,y,58),8,'#5a3a28'); head(P(-218,y,64),12,'#2f2520');
    for (const a of [-160,0]){ quad(yq(a-26,a+26,0,98,y+.5),'#c8574a',.8); rule([[P(a,y+.6,0),P(a,y+.6,98)]],INK,.8); quad(yq(a-18,a-4,52,80,y+.8),'#cfe2e8',.4); quad(yq(a+4,a+18,52,80,y+.8),'#cfe2e8',.4); }
    quad(xq(X1,y-d,y,-10,100),'#e3ded4',1.1); quad(xq(X1+.4,y-d+12,y-12,46,84),'#cfe2e8',.7); for (const u of [y-d+8,y-8]) dot(...P(X1+.4,u,20),3,'#fff3c4',.6);
    rule(lines(5,i => { const a = P(X1+24,y-60+i*12,10+i*16); return [a,[a[0]+50,a[1]+28]]; }),INK,1.2);
    fam('mum',...P(-40,170,0),{look:1,size:1}); fam('kid',...P(-10,200,0),{arm:'wave',look:1,size:1.05}); fam('dad',...P(40,190,0),{arm:'hold',look:-1,size:1}); },
  dome(p){ OX = p.x+GW/2; OY = p.y+GH-40; const c = [p.x+GW/2+20,p.y+GH-120], R = 175, H = 150;
    out.push(`<rect x="${p.x}" y="${p.y+GH-130}" width="${GW}" height="140" fill="#b6dd8e"/>`); rule(lines(40,i => { const a = [p.x+(i*53)%GW,p.y+GH-110+(i*37)%110]; return [a,[a[0]+3,a[1]-7]]; }),'#6f8a66',.7,.8);
    dot(p.x+GW-70,p.y+80,24,'#f7d26a',.9);
    /* the glass bubble: a half shell, ribs running over it, the plants showing through */
    const shell = [...lines(41,i => { const t = Math.PI+i/40*Math.PI; return [c[0]+R*Math.cos(t),c[1]+H*Math.sin(t)]; }),[c[0]+R,c[1]+18],[c[0]-R,c[1]+18]];
    out.push(`<path d="${pathOf(shell)}Z" fill="#cfe7ef"/>`);
    leafy([c[0]-90,c[1]-20],46,34); leafy([c[0]+70,c[1]-34],56,42,'#a9d49a'); leafy([c[0]-10,c[1]-60],40,40,'#7fbf8a'); for (let i = 0; i < 9; i++) bloom([c[0]-140+i*34,c[1]+4-(i%2)*8],7,FLOW[i%FLOW.length]);
    out.push(`<path d="${pathOf(shell)}Z" fill="#e8f4f8" opacity=".38"/>`);
    rule(lines(7,i => { const k = (i+1)/8, e = lines(25,j => { const t = Math.PI+j/24*Math.PI; return [c[0]+R*k*Math.cos(t)*1,c[1]+H*Math.sin(t)]; }); return e; }).flatMap(e => e.slice(1).map((q,j) => [e[j],q])),'#7d8a94',.7,.9);
    rule(lines(4,i => { const h = (i+1)/5, w = Math.sqrt(1-h*h); return [[c[0]-R*w,c[1]-H*h],[c[0]+R*w,c[1]-H*h]]; }),'#7d8a94',.7,.9);
    pen(shell.slice(0,41),1.6); quad([[c[0]-R-6,c[1]+4],[c[0]+R+6,c[1]+4],[c[0]+R+6,c[1]+20],[c[0]-R-6,c[1]+20]],'#d9d3c4',1);
    { const d = [[c[0]-26,c[1]-40],[c[0]+26,c[1]-40],[c[0]+26,c[1]+4],[c[0]-26,c[1]+4]]; quad(d,'#3d5560',1); rule([[[c[0],c[1]-40],[c[0],c[1]+4]]],'#cfe2e8',1.2); }
    fam('mum',p.x+120,p.y+GH-22,{look:1,size:1}); fam('kid',p.x+168,p.y+GH-14,{arm:'up',look:1,size:1.05}); fam('dad',p.x+230,p.y+GH-24,{arm:'out',look:-1,size:1});
    talk(p.x+100,p.y+138,62,28,'Wow!',p.x+160,p.y+GH-90); },
  flowers(p){ OX = p.x+GW/2-10; OY = p.y+GH/2+10;
    quad(zq(-260,260,-260,260,0),'#c9b58f',0);
    for (let k = 0; k < 6; k++){ const y = -170+k*62; quad(zq(-260,260,y,y+40,0),'#b98655',0); bed(-250,250,y+20,0,{n:14,r:10,seed:k*3}); }
    fam('mum',...P(60,70,0),{arm:'hold',look:-1,size:1.1}); fam('kid',...P(10,110,0),{arm:'front',look:-1,size:1.2});
    talk(p.x+320,p.y+150,74,30,'Sniff!',P(10,110,0)[0]+14,P(10,110,0)[1]-96);
    out.push(`<path d="M${p.x+250} ${p.y+110}c-10-14 6-20 10-8c4-12 20-6 10 8z" fill="#b9a6d6" stroke="${INK}" stroke-width=".8"/>`); },
  fountain(p){ OX = p.x+GW/2-20; OY = p.y+GH/2+40;
    quad(zq(-260,260,-260,260,0),'#e4dbcb',0); rule(lines(16,i => [P(-260+i*34,-260,0),P(-260+i*34,260,0)]).concat(lines(16,i => [P(-260,-260+i*34,0),P(260,-260+i*34,0)])),'#c9bda6',.5,.7);
    bed(-240,-60,-200,0,{n:7,seed:2}); bed(40,240,-210,0,{n:7,seed:5});
    cyl(0,0,0,100,26,'#d9d3c4',{ink:1.2,cap:'#8cc9ea'}); { const w = ringAt((a,b) => P(70*a,70*b,26.5),30); rim(w,.6,'#5f9fc4'); }
    cyl(0,0,26,12,48,'#cfc6b5',{ink:1}); cyl(0,0,74,26,8,'#d9d3c4',{ink:1,cap:'#8cc9ea'});
    /* the jets: water thrown up and out, falling back into the basin */
    const top = P(0,0,86); out.push(`<g id="jets">`); for (let i = 0; i < 8; i++){ const t = i/8*6.283, e = P(80*Math.cos(t),80*Math.sin(t),28), m = [lerp(top[0],e[0],.5),Math.min(top[1],e[1])-70]; out.push(`<path d="M${n1(top[0])} ${n1(top[1])}Q${n1(m[0])} ${n1(m[1])} ${n1(e[0])} ${n1(e[1])}" fill="none" stroke="#5f9fc4" stroke-width="3.4" stroke-linecap="round"/><path d="M${n1(top[0])} ${n1(top[1])}Q${n1(m[0])} ${n1(m[1])} ${n1(e[0])} ${n1(e[1])}" fill="none" stroke="#d6eef8" stroke-width="1.6" stroke-linecap="round"/>`); }
    out.push(`<path d="M${n1(top[0])} ${n1(top[1])}l0 -70" stroke="#5f9fc4" stroke-width="5" stroke-linecap="round"/><path d="M${n1(top[0])} ${n1(top[1])}l0 -70" stroke="#d6eef8" stroke-width="2.4" stroke-linecap="round"/>`);
    out.push(lines(26,i => { const a = top[0]+Math.sin(i*2.1)*90, b = top[1]-40+Math.cos(i*1.7)*50; return `<circle cx="${n1(a)}" cy="${n1(b)}" r="2.2" fill="#d6eef8" stroke="#5f9fc4" stroke-width=".6"/>`; }).join('')); out.push('</g>');
    { const c = [top[0]+70,top[1]-30]; ['#ef6a4c','#f4b829','#93c79d','#76a0e2'].forEach((col,i) => out.push(`<path d="M${c[0]-34+i*4} ${c[1]}a${34-i*4} ${30-i*4} 0 0 1 ${68-i*8} 0" fill="none" stroke="${col}" stroke-width="4" opacity=".8"/>`)); }
    fam('kid',...P(30,150,0),{arm:'up',look:-1,size:1.2}); fam('dad',...P(110,120,0),{arm:'out',look:-1,size:1.1}); },
  tree(p){ OX = p.x+GW/2; OY = p.y+GH-30; const b = [p.x+GW/2+50,p.y+GH-40];
    out.push(`<rect x="${p.x}" y="${p.y+GH-70}" width="${GW}" height="80" fill="#c9b58f"/>`); rule([[[p.x,p.y+GH-70],[p.x+GW,p.y+GH-70]]],INK,.8);
    bed(-330,-160,40,0,{n:6,seed:4});
    /* the baobab: a fat bottle of a trunk, short arms at the top with little leaves */
    const t = [[b[0]-70,b[1]],[b[0]-80,b[1]-44],[b[0]-74,b[1]-104],[b[0]-44,b[1]-155],[b[0]-30,b[1]-185],[b[0]+30,b[1]-185],[b[0]+44,b[1]-155],[b[0]+74,b[1]-104],[b[0]+80,b[1]-44],[b[0]+70,b[1]]];
    const tr = spline(t,false,4); ground(blob(b[0],b[1]+4,100,16)); flat([...tr],'#c9a27a'); clipped(tr,() => { flat([[b[0]+20,b[1]],[b[0]+40,b[1]-185],[b[0]+90,b[1]-185],[b[0]+90,b[1]]],'#b08a62'); rule(lines(9,i => [[b[0]-60+i*15,b[1]-7],[b[0]-50+i*12,b[1]-170]]),'#8c6f4e',.6,.7); }); pen(tr,1.4);
    for (const [dx,dy,ex,ey] of [[-24,-184,-90,-222],[-6,-185,-20,-238],[14,-185,60,-235],[28,-182,110,-212]]){ const a = [b[0]+dx,b[1]+dy], e = [b[0]+ex,b[1]+ey]; rule([[a,e]],INK,7); rule([[a,e]],'#c9a27a',5); leafy(e,26,16,'#93c79d'); }
    fam('dad',b[0]-130,b[1]+6,{arm:'up',look:1,size:1.05}); fam('kid',b[0]-176,b[1]+14,{arm:'up',look:1,size:1.05});
    talk(p.x+120,p.y+140,86,30,'A bottle tree!',b[0]-170,b[1]-66); },
  photo(p){ OX = p.x+GW/2; OY = p.y+GH/2+40;
    quad(zq(-260,260,-260,260,0),'#d9cfb6',0); for (let k = 0; k < 3; k++) bed(-260,260,-200+k*44,0,{n:14,r:11,seed:k*5});
    out.push('<g id="pose">'); fam('dad',...P(30,60,0),{arm:'wave',look:1,size:1.1}); fam('kid',...P(-10,90,0),{arm:'up',look:1,size:1.15}); fam('mum',...P(-60,50,0),{arm:'wave',look:1,size:1.1}); out.push('</g>');
    /* the camera on its legs, looking back at us */
    const c = P(150,190,0); for (const dx of [-16,0,16]) pen([[c[0],c[1]-70],[c[0]+dx*1.4,c[1]]],1.4); quad([[c[0]-22,c[1]-96],[c[0]+22,c[1]-96],[c[0]+22,c[1]-68],[c[0]-22,c[1]-68]],'#3f3a39',1); dot(c[0]-6,c[1]-82,9,'#8e9cc0',.8); quad([[c[0]+8,c[1]-102],[c[0]+18,c[1]-102],[c[0]+18,c[1]-96],[c[0]+8,c[1]-96]],'#c6ccce',.6);
    out.push(`<g id="flash" style="opacity:0;transition:opacity .2s"><circle cx="${c[0]-6}" cy="${c[1]-82}" r="60" fill="#fff6a8" opacity=".7"/></g>`);
    /* the photo that comes out of it once we are all smiling */
    out.push(`<g id="snap" style="display:none" transform="translate(${p.x+GW-118} ${p.y+GH-140}) rotate(6)">`); out.push(`<rect x="0" y="0" width="96" height="108" fill="#fffdf6" stroke="${INK}" stroke-width="1.2"/><rect x="8" y="8" width="80" height="74" fill="#cfe7ef" stroke="${INK}" stroke-width=".7"/>`); head([30,52],9,'#2f2520'); head([48,58],7,'#5a3a28'); head([66,52],9,'#2f2520'); bloom([22,74],6,'#ef6a4c'); bloom([74,74],6,'#f3a6bb'); out.push(`<text x="48" y="100" text-anchor="middle" class="it" font-size="12" fill="${INK}">us!</text></g>`); },
  snack(p){ OX = p.x+GW/2-20; OY = p.y+GH/2+100;
    quad(zq(-260,260,-260,260,0),'#e4dbcb',0); rule(lines(16,i => [P(-260+i*34,-260,0),P(-260+i*34,260,0)]),'#c9bda6',.5,.7);
    leafy(P(-150,-150,60),60,46); leafy(P(-40,-190,70),50,44,'#7fbf8a'); bed(40,240,-170,0,{n:7,seed:1});
    /* the bench, and us on it */
    solid(-150,-40,30,250,44,6,'#c08a5a'); for (const x of [-140,80]) solid(x,-34,0,10,34,30,'#6d6a70'); solid(-150,-48,36,250,8,40,'#c08a5a');
    fam('dad',...P(40,-18,30),{arm:'hold',look:1,size:1.05,sit:30}); fam('kid',...P(-30,-18,30),{arm:'wave',look:1,size:1.1,sit:30}); fam('mum',...P(-100,-18,30),{arm:'lap',look:1,size:1.05,sit:30});
    solid(-70,10,0,30,22,14,'#f4b829'); cyl(110,10,0,8,22,'#ef6a4c',{ink:.8,cap:'#fffdf6'});
    talk(p.x+290,p.y+108,110,30,'Bye-bye, flowers!',P(-30,-18,30)[0]+10,P(-30,-18,30)[1]-110); },
  home(p){ OX = p.x+GW/2+70; OY = p.y+GH/2+170;
    out.push(lines(40,i => `<circle cx="${n1(p.x+(i*97)%GW)}" cy="${n1(p.y+40+(i*61)%150)}" r="${n1(.8+(i%3)*.5)}" fill="#f6efd8"/>`).join(''));
    quad(zq(-230,230,-230,230,0),'#4b5279',0); quad(xq(-230,-230,230,0,300),'#424a70',0); quad(yq(-230,230,0,300,-230),'#3a4166',0); rule([[P(-230,-230,0),P(-230,-230,300)]],'#1d2238',1);
    openL(-140,-230,110,120,110,10,'#272d4c',B => { flat(B,'#272d4c'); const c = [lerp(B[0][0],B[2][0],.5),lerp(B[0][1],B[2][1],.45)]; dot(c[0],c[1],15,'#f7e9a8',.6); out.push(`<circle cx="${c[0]+7}" cy="${c[1]-5}" r="13" fill="#272d4c"/>`); rim(B,.8,INK); });
    /* our photo, on the wall already */
    { const q = xq(-229,40,96,140,210); quad(q,'#fffdf6',1); quad(xq(-228.6,46,90,150,202),'#cfe7ef',.6); }
    /* the bed, the kid in it, eyes shut */
    solid(-226,-60,0,190,120,30,'#8c6f9c'); solid(-226,-60,30,190,120,12,'#e4dbcb'); quad(zq(-150,-36,-60,60,42.4),'#f4b829'); rule(lines(5,i => [P(-140+i*22,-60,42.6),P(-140+i*22,60,42.6)]),'#c99b20',.7); quad(xq(-226,-60,60,30,110),'#8c6f9c'); solid(-216,-40,42,46,70,10,'#fffdf6');
    { const c = P(-188,0,62); dot(c[0],c[1],13,'#f6e2cc',.9); out.push(`<path d="M${c[0]-13} ${c[1]-1}Q${c[0]} ${c[1]-24} ${c[0]+13} ${c[1]-1}Q${c[0]} ${c[1]-11} ${c[0]-13} ${c[1]-1}Z" fill="#a8683a" stroke="${INK}" stroke-width=".7"/><path d="M${c[0]-7} ${c[1]+2}q3 3 6 0M${c[0]+2} ${c[1]+2}q3 3 6 0" fill="none" stroke="${INK}" stroke-width="1"/>`); }
    out.push(`<g class="zz" fill="#f6efd8" font-family="Impact,'Arial Black',sans-serif">${['z','z','Z'].map((s,i) => `<text x="${p.x+190+i*26}" y="${p.y+200-i*28}" font-size="${20+i*8}">${s}</text>`).join('')}</g>`); }
};

function draw(seed){
  begin(seed); OX = 700; OY = 700;
  out.push(`<defs>${PANELS.map((p,i) => `<clipPath id="fd${i}"><path d="M${p.poly.map(q => q.join(' ')).join('L')}Z"/></clipPath>`).join('')}</defs>`);
  title('a comic strip · a family day out','Our day at the Flower Dome');
  out.push(`<text x="72" y="232" class="it" font-size="21" fill="${LEAD}">Ride the train, see the flowers, take a photo, and home to bed.</text>`);
  PANELS.forEach((p,i) => { PN = i;
    out.push(`<g clip-path="url(#fd${i})" data-state="${p.id}"><rect x="${p.x}" y="${p.y}" width="${GW}" height="${GH}" fill="${p.bg}"/>`); scene[p.id](p); flush(); OX = 700; OY = 700; cap(p,p.cap);
    out.push(`<rect class="veil" id="veil${i}" x="${p.x}" y="${p.y}" width="${GW}" height="${GH}" fill="#f6f1e6" style="opacity:0;transition:opacity .8s"/></g>`);
    rim(p.poly,1.6,INK); out.push(`<path class="lit" id="lit${i}" d="M${p.poly.map(q => q.join(' ')).join('L')}Z" fill="none" stroke="${RED}" stroke-width="5" style="opacity:0;transition:opacity .4s"/>`); });
  /* the way through: red arrows across the gutters, the order the eye reads */
  const rt = pts => { line(pts,{w:1.9,col:RED,amp:.4,over:0}); const [a,b] = pts.slice(-2), l = Math.hypot(b[0]-a[0],b[1]-a[1]), u = [(b[0]-a[0])/l,(b[1]-a[1])/l]; fill([[b[0]+u[0]*13,b[1]+u[1]*13],[b[0]-u[1]*6.5,b[1]+u[0]*6.5],[b[0]+u[1]*6.5,b[1]-u[0]*6.5]],RED,{dx:0,dy:0,amp:.1}); };
  for (let r = 0; r < 3; r++){ const y = GY+r*(GH+GAP)+GH/2; rt([[GX[0]+GW-12,y],[GX[1]+4,y]]); rt([[GX[1]+GW-12,y],[GX[2]+4,y]]); if (r < 2){ const g = GY+r*(GH+GAP)+GH+GAP/2; rt([[GX[2]+GW/2,GY+r*(GH+GAP)+GH-10],[GX[2]+GW/2,g],[GX[0]+GW/2,g],[GX[0]+GW/2,g+GAP/2+4]]); } }
  sfx('s1',PANELS[1].x+310,PANELS[1].y+300,'WHOOSH!',50,'#fbf7ec',-6); sfx('s4',PANELS[4].x+120,PANELS[4].y+140,'SPLISH!',44,'#d6eef8',-10); sfx('s4b',PANELS[4].x+320,PANELS[4].y+300,'SPLASH!',44,'#d6eef8',6);
  sfx('s6',PANELS[6].x+300,PANELS[6].y+120,'CLICK!',52,'#fff6a8',-6); sfx('s6x',PANELS[6].x+130,PANELS[6].y+150,'ACHOO!',58,'#f3a6bb',-10); sfx('s8',PANELS[8].x+300,PANELS[8].y+110,'ZZZ…',46,'#f7e9a8',-4);
  out.push(`<text x="72" y="1382" class="it" font-size="15" fill="${LEAD}">Illustrative: one family's day out, drawn for a little one. The Flower Dome really is cool inside and has baobab trees.</text>`);
  /* the sticker that travels: a red flower */
  group('id="token"',() => { out.push(`<circle r="20" fill="${RED}" stroke="${INK}" stroke-width="1.4"/>`); bloom([0,0],14,'#fffdf6'); });
  finish();
}

function init(ctx){
  const $ = id => document.getElementById(id), token = $('token'), ids = PANELS.map(p => p.id);
  const SFX = {train:['s1'],fountain:['s4','s4b'],home:['s8']};
  let i = 0, sneezed = false, taken = false, moving = null, playing = false, timer = 0;
  const seat = q => token.setAttribute('transform',`translate(${n1(q[0])} ${n1(q[1])})`);
  const pop = (id,ms = 2400) => { const g = $(id); if (!g) return; g.style.opacity = 1; g.style.transform = 'scale(1)'; setTimeout(() => { g.style.opacity = 0; g.style.transform = 'scale(.3)'; },ms); };
  const look = k => { const p = PANELS[k]; ctx.focus(p.x+GW/2,p.y+GH/2,2.3); };
  const show = () => PANELS.forEach((p,k) => { $('veil'+k).style.opacity = k > i ? .62 : 0; $('lit'+k).style.opacity = k === i ? 1 : 0; });
  /* the way between two panels, through the gutters */
  const way = (a,b) => { const A = PANELS[a].rest, B = PANELS[b].rest; if (Math.floor(a/3) === Math.floor(b/3)) return [A,B];
    const g = PANELS[a].y+GH+GAP/2; return [A,[1384,A[1]],[1384,g],[B[0],g],B]; };
  function arrive(){ const p = PANELS[i]; show(); look(i); (SFX[p.id] || []).forEach(s => pop(s)); ctx.say(p.say);
    if (p.id === 'photo'){ sneezed = false; taken = false; $('snap').style.display = 'none'; ctx.hint('press Achoo! for a sneeze'); } else ctx.hint(i === 8 ? 'the end! press Next to go again' : 'tap a person to hear them');
    if (playing) timer = setTimeout(step,p.id === 'photo' ? 1200 : 3400); }
  function goTo(k){ const path = way(i,k); i = k; moving = {path,d:0}; window.wake?.(); }
  function click(){ taken = true; pop('s6'); const f = $('flash'); f.style.opacity = 1; setTimeout(() => { f.style.opacity = 0; },260); $('snap').style.display = ''; ctx.say('Click! A lovely photo of all of us.'); ctx.hint('press Next to go on'); }
  function step(){ clearTimeout(timer);
    if (moving) return ctx.say('Wait a moment: we are still on our way.');
    const id = ids[i];
    if (id === 'photo'){
      if (sneezed){ sneezed = false; $('pose').classList.remove('shake'); const x = $('s6x'); x.style.opacity = 0; x.style.transform = 'scale(.3)'; ctx.say('Let\'s take it again. Cheeeese!'); if (playing) timer = setTimeout(step,1600); return; }
      if (!taken){ click(); if (playing) timer = setTimeout(step,2400); return; } }
    if (i === 8){ playing = false; i = 0; sneezed = false; taken = false; $('snap').style.display = 'none'; seat(PANELS[0].rest); ctx.focus(700,700,1,.01); show(); ctx.say('Back to the start. Wake up, it\'s garden day again!'); return; }
    goTo(i+1); }
  ctx.button('next stop',() => { playing = false; step(); });
  ctx.button('play it in order',() => { if (playing) return ctx.say('We are already on our way!'); playing = true; if (i === 8){ i = 0; seat(PANELS[0].rest); } step(); });
  ctx.button('achoo!',() => {
    if (ids[i] !== 'photo') return ctx.say(i < 6 ? 'Not yet: no sneezing till the photo!' : 'No more sneezing: the photo is taken.');
    if (moving) return ctx.say('Wait a moment: we are still on our way.');
    if (taken) return ctx.say('Too late to sneeze: the photo is taken. Press Next.');
    if (sneezed) return ctx.say('Bless you! Press Next to take it again.');
    sneezed = true; clearTimeout(timer); pop('s6x',1800); $('pose').classList.add('shake'); ctx.say('Ah… ah… ACHOO! Oops, a wobbly photo. Press Next to take it again.');
    if (playing) timer = setTimeout(step,2200); });
  seat(PANELS[0].rest); show(); ctx.say('Press Next step to start our day, or Play all to watch it all.'); ctx.hint('tap a person to hear them');
  return { tick(t,dt){ if (!moving) return false; const m = moving; m.d = Math.min(1,m.d+dt*1.1); const n = m.path.length-1, u = m.d*n, k = Math.min(n-1,Math.floor(u)), f = u-k, e = f*f*(3-2*f), a = m.path[k], b = m.path[k+1], q = [lerp(a[0],b[0],e),lerp(a[1],b[1],e)];
      seat(q); ctx.focus(q[0],q[1],1.6); if (m.d >= 1){ moving = null; arrive(); } return true; },
    stop(){ clearTimeout(timer); } };
}
