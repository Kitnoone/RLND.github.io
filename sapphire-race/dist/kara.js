(() => {
'use strict';
// One transparent, consistently proportioned token; articulated pieces share its coordinates.
const image=new Image();image.src='./assets/kara-token.webp';
const definitions={
  gallop:['Скачка',1200],overtake:['Обгон',2400],ram:['Таран',2400],
  scout:['Разведать путь',2000],calm:['Успокоить Кару',2200],brace:['Удержать корпус',2000],
  repair:['Провести ремонт',2400],guard:['Защитить экипаж',2200],
  speed:['Быстрее ветра',2400],flight:['Небесный шаг',2800],light:['Свет пегаса',2600],
  ultimate:['Последний полёт Дюрана',3400],drive:['Управление колесницей',1800],
  hit:['Удар препятствия',1500],arc_shield:['Арка Щита',1800],arc_sword:['Арка Меча',1800],
  arc_star:['Платиновая звезда',1800],arc_wing:['Серебряное крыло',1800]
};
const W=1024,H=1536,parts={};let base;
const outlines={
 left:[[0,180],[330,305],[389,394],[454,440],[449,509],[424,571],[390,637],[369,700],[0,700]],
 right:[[1024,180],[694,305],[635,394],[570,440],[575,509],[600,571],[634,637],[655,700],[1024,700]],
 tail:[[482,676],[570,704],[609,842],[598,967],[575,1003],[463,1003],[430,939],[442,819]],
 cloak:[[444,1146],[515,1180],[605,1160],[704,1310],[653,1367],[558,1391],[449,1376],[401,1301]],
 wheelL:[[222,1073],[296,1073],[300,1406],[222,1406]],
 wheelR:[[728,1073],[802,1073],[802,1406],[724,1406]]
};
function polygon(c,points){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath()}
image.onload=()=>{base=document.createElement('canvas');base.width=W;base.height=H;const c=base.getContext('2d');c.drawImage(image,0,0,W,H);
 for(const [name,points] of Object.entries(outlines)){const layer=document.createElement('canvas');layer.width=W;layer.height=H;const l=layer.getContext('2d');polygon(l,points);l.clip();l.drawImage(image,0,0,W,H);parts[name]=layer;c.save();c.globalCompositeOperation='destination-out';polygon(c,points);c.fill();c.restore()}
};
function mode({busy=false,key=null,lap=0}={}){if(key==='universal_ram')return 'ram';if(key&&definitions[key])return key;return busy?(lap===2?'flight':'gallop'):'idle'}
function pose(key,time,progress=0,reduced=false){
 const moving=key!=='idle',flying=['flight','ultimate','arc_wing'].includes(key),sprint=['speed','overtake','ram'].includes(key);
 // Continuous motion of one model. Ease action motion in/out without changing its scale.
 const phase=Math.max(0,Math.min(1,progress));
 const envelope=moving?Math.sin(Math.PI*phase)**2:0;
 const wave=reduced?0:Math.sin(time/(flying?190:sprint?125:170));
 const intensity=key==='calm'?.18:moving?1:.12;
 return{moving,flying,wave:wave*intensity,lift:flying?envelope*30:0,
  bob:reduced?0:wave*(moving?1.1*envelope:.18),
  wing:flying?.26:.025,fold:flying?.32:0,
  motion:reduced?0:envelope*intensity};
}
function draw(c,{key='idle',time=0,progress=0,reduced=false,width=92}={}){
 if(!base)return false;const p=pose(key,time,progress,reduced),scale=width/W;
 c.save();c.translate(0,p.bob-p.lift);c.scale(scale,scale);c.translate(-W/2,-H/2);
 // Articulated wing recovery: pivot at shoulder, foreshorten span without stretching the horse.
 for(const [name,sign,x] of [['left',-1,450],['right',1,574]]){c.save();c.translate(x,470);c.rotate(sign*p.wave*p.wing);c.scale(1-p.fold*(p.wave+1)/2,1);c.translate(-x,-470);c.drawImage(parts[name],0,0);c.restore()}
 c.drawImage(base,0,0);
 for(const [name,y0,y1,amount] of [['tail',676,1004,16],['cloak',1146,1392,11]]){
  for(let y=y0;y<y1;y+=8){const f=(y-y0)/(y1-y0),shift=reduced?0:Math.sin(time/(p.moving?95:350)-f*3)*f*amount*(p.moving?p.motion:.15);c.drawImage(parts[name],0,y,W,Math.min(8,y1-y),shift,y,W,Math.min(8,y1-y))}
 }
 for(const [name,x] of [['wheelL',260],['wheelR',764]]){c.save();c.translate(x,1240);const v=p.moving&&!reduced?Math.sin(time/100)*.009*p.motion:0;c.scale(1+v,1-v);c.translate(-x,-1240);c.drawImage(parts[name],0,0);c.restore();if(p.moving&&!reduced){c.save();c.globalAlpha=.25;c.strokeStyle='#ffe1a1';c.lineWidth=5;const offset=(time*.3)%50;for(let n=0;n<5;n++){c.beginPath();c.moveTo(x-19,1130+n*50+offset);c.lineTo(x+19,1130+n*50+offset);c.stroke()}c.restore()}}
 c.restore();return true;
}
function effects(c,key,p,time,t=0,success=true,reduced=false){if(key==='idle')return;const alpha=Math.sin(Math.PI*t)*(success?1:.4),white='#fff3c4',cyan='#a6edff';c.save();c.translate(p.x,p.y);c.rotate(p.angle);c.globalAlpha=alpha;c.lineCap='round';
 const line=(points,color=cyan,width=2)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()};
 const oval=(x,y,rx,ry,color=cyan)=>{c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.stroke()};
 if(['gallop','drive','overtake','speed','ram'].includes(key)){for(let n=0;n<9;n++){const x=(n%2?1:-1)*(20+n*3),y=35+(n*19+(reduced?0:time*.16))%80;line([[x,y],[x,y+(key==='speed'?34:15)]],n%2?white:cyan,1.5)}if(key==='overtake')line([[0,30],[-60,-10],[-60,-80],[0,-135]],white,3)}
 if(key==='scout'){const reach=80+t*110;c.fillStyle='#77d8e8';c.globalAlpha=alpha*.14;c.beginPath();c.moveTo(0,-18);c.lineTo(-60,-reach);c.lineTo(60,-reach);c.closePath();c.fill();c.globalAlpha=alpha;for(let i=0;i<3;i++){const y=-60-i*40-t*24;line([[-12,y+10],[0,y],[12,y+10]],cyan)}oval(0,-reach,16,16)}
 if(key==='calm'){for(let i=0;i<3;i++)oval(0,-25,20+(t*45+i*15)%50,12+(t*30+i*8)%30,'#9cf1bc')}
 if(['brace','guard','light','arc_shield'].includes(key)){c.fillStyle=key==='light'?'#fff4b8':'#68ddff';c.globalAlpha=alpha*.12;c.beginPath();c.ellipse(0,0,55,84,0,0,Math.PI*2);c.fill();c.globalAlpha=alpha;oval(0,0,55,84,key==='light'?white:cyan);if(key==='brace')for(const side of [-1,1])line([[side*52,-43],[side*60,-43],[side*60,54],[side*52,54]],cyan,4);if(key==='guard')line([[-17,22],[0,12],[17,22],[15,43],[0,55],[-15,43],[-17,22]],cyan,3)}
 if(key==='repair'){for(let i=0;i<6;i++){const x=Math.sin(i*2.4)*30,y=40-i*5-t*30;c.strokeStyle='#91ffc0';c.lineWidth=2;c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y);c.moveTo(x,y-4);c.lineTo(x,y+4);c.stroke()}line([[-20,52],[-7,39],[8,52],[22,39]],'#ffc777',3)}
 if(['flight','ultimate','arc_wing'].includes(key)){for(let s of [-1,1])for(let n=0;n<3;n++)line([[s*38,0],[s*(62+n*8),35+t*20],[s*(50+n*8),85+t*30]],cyan,1.5);if(key==='ultimate'){oval(0,-10,65+t*180,65+t*180,white);for(let n=0;n<12;n++){const a=n*Math.PI/6;line([[Math.cos(a)*70,Math.sin(a)*70],[Math.cos(a)*(90+t*120),Math.sin(a)*(90+t*120)]],white,2)}}}
 if(['light','arc_star','arc_sword'].includes(key)){const color=key==='arc_sword'?'#ffb085':white;for(let n=0;n<8;n++){const a=n*Math.PI/4+(reduced?0:time/850),r=45+t*35;line([[Math.cos(a)*r,Math.sin(a)*r-20],[Math.cos(a)*(r+10),Math.sin(a)*(r+10)-20]],color)}}
 c.restore();
}
window.KaraAnimator={definitions,mode,pose,draw,effects,get ready(){return !!base}};
})();
