(() => {
'use strict';
// Reference-inspired stonework is drawn in world coordinates and cached, keeping live animation light.
let ground=null,water=null;
const stone=new Image();stone.onload=()=>{ground=null;water=null};stone.src='./assets/arena-stone.webp';
function build(path,wet){const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=4096;const c=canvas.getContext('2d');
 const trace=()=>{c.beginPath();path.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath()};
 c.lineJoin='round';c.lineCap='round';trace();c.strokeStyle='#1d2630';c.lineWidth=366;c.stroke();trace();c.strokeStyle='#9f824e';c.lineWidth=350;c.stroke();trace();c.strokeStyle='#514331';c.lineWidth=336;c.stroke();trace();c.strokeStyle=wet?'#4b8691':'#c9b894';c.lineWidth=322;c.stroke();
 c.save();trace();c.lineWidth=320;c.strokeStyle='#fff';const mask=document.createElement('canvas');mask.width=1536;mask.height=4096;const m=mask.getContext('2d');m.lineJoin='round';m.lineCap='round';m.beginPath();path.forEach((p,i)=>i?m.lineTo(p.x,p.y):m.moveTo(p.x,p.y));m.closePath();m.strokeStyle='#fff';m.lineWidth=320;m.stroke();
 const texture=document.createElement('canvas');texture.width=1536;texture.height=4096;const t=texture.getContext('2d');
 for(let y=0;y<4096;y+=62)for(let x=0;x<1536;x+=84){const seed=(x*13+y*17)%97,offset=(Math.floor(y/62)%2)*42;t.fillStyle=wet?`rgba(178,229,228,${.025+seed/2400})`:`rgba(255,245,214,${.025+seed/1400})`;t.fillRect(x+offset+2,y+2,80,58);t.strokeStyle=wet?'#214e6230':'#6e573627';t.lineWidth=1;t.strokeRect(x+offset,y,84,62);if(seed%9===0){t.strokeStyle=wet?'#bddbd51a':'#fff0c630';t.beginPath();t.moveTo(x+offset+8,y+12);t.lineTo(x+offset+30,y+26);t.lineTo(x+offset+40,y+44);t.stroke()}}
 if(stone.complete&&stone.naturalWidth){t.save();t.globalAlpha=wet?.18:.85;t.scale(.6,.6);t.fillStyle=t.createPattern(stone,'repeat');t.fillRect(0,0,2560,6827);t.restore()}
 t.globalCompositeOperation='destination-in';t.drawImage(mask,0,0);c.drawImage(texture,0,0);c.restore();mask.width=1;texture.width=1;
 // Gold curb studs and fine blue inlay follow the oval instead of intruding into the stands.
 for(let i=1;i<path.length;i++){const p=path[i],prev=path[i-1],dx=p.x-prev.x,dy=p.y-prev.y,n=Math.hypot(dx,dy);if(!n||i%2)continue;for(const side of [-1,1]){const x=p.x-dy/n*side*168,y=p.y+dx/n*side*168;c.fillStyle='#ead49a';c.fillRect(x-3,y-3,6,6)}}
 c.fillStyle='#213841';c.strokeStyle='#a78b54';c.lineWidth=5;c.beginPath();c.roundRect(676,855,184,2535,80);c.fill();c.stroke();
 for(let y=1120;y<3140;y+=260){c.fillStyle='#12283c';c.fillRect(684,y,168,160);c.strokeStyle='#bd9b5b';c.lineWidth=3;c.strokeRect(684,y,168,160);c.strokeStyle='#3e9bb5';c.lineWidth=2;c.beginPath();c.arc(768,y+80,55,0,Math.PI*2);c.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(768+Math.cos(a)*18,y+80+Math.sin(a)*18);c.lineTo(768+Math.cos(a)*51,y+80+Math.sin(a)*51);c.stroke()}c.fillStyle='#a78b54';c.fillRect(760,y+72,16,16)}
 // Raised spectator platforms: a dark slate contrast to the pale racing surface.
 for(const side of [0,1]){const x=side?1203:183;c.fillStyle='#202b36';c.fillRect(x,730,150,2600);for(let row=0;row<65;row++){const y=740+row*40;c.fillStyle=row%2?'#3c4245':'#31383d';c.fillRect(x,y,150,35);c.fillStyle='#a38a56';c.fillRect(x,y+34,150,2)}for(let y=770;y<3300;y+=240){c.fillStyle='#c1ac7a';c.fillRect(x-10,y,17,90);c.fillRect(x+142,y,17,90);c.fillStyle='#151d2b';c.fillRect(x+35,y-15,80,65);c.strokeStyle='#ba9755';c.lineWidth=3;c.strokeRect(x+35,y-15,80,65);c.beginPath();c.arc(x+75,y+17,18,0,Math.PI*2);c.stroke()}}
 return canvas;
}
function render(c,path,lap){if(!ground)ground=build(path,false);if(lap===1&&!water)water=build(path,true);c.drawImage(lap===1?water:ground,0,0)}
function gate(c,key,active,time){const color={shield:'#62d4ff',sword:'#ffb079',star:'#ffdf80',wing:'#bfb1ff'}[key]||'#9ce6ff';c.save();
 c.fillStyle='#050f2033';c.fillRect(-74,-40,148,86);c.shadowColor=color;c.shadowBlur=active?18:5;
 for(const x of [-64,52]){const gradient=c.createLinearGradient(x,0,x+12,0);gradient.addColorStop(0,'#604a27');gradient.addColorStop(.4,'#edcf89');gradient.addColorStop(1,'#8f6a31');c.fillStyle=gradient;c.fillRect(x,-34,12,70);c.fillStyle='#e1c586';c.fillRect(x-4,-40,20,12);c.fillRect(x-4,29,20,12);c.strokeStyle='#563d21';c.lineWidth=1;c.strokeRect(x,-34,12,70)}
 c.shadowBlur=0;c.fillStyle='#b5975f';c.fillRect(-69,-44,138,10);c.fillStyle='#f2d997';c.fillRect(-71,-46,142,3);c.fillStyle='#173451';c.fillRect(-49,-43,98,7);
 const shimmer=.18+(active?.1:0)+Math.sin(time/600)*.04;c.globalAlpha=shimmer;c.fillStyle=color;c.fillRect(-50,-31,100,64);c.globalAlpha=1;c.strokeStyle=color;c.lineWidth=active?3:1.5;c.beginPath();c.moveTo(-49,-29);c.lineTo(49,-29);c.moveTo(-49,30);c.lineTo(49,30);c.stroke();
 for(let i=0;i<7;i++){const x=-40+i*13,y=-20+((time/30+i*11)%44);c.globalAlpha=(active?.75:.25)*(1-Math.abs(y-2)/24);c.fillStyle=color;c.fillRect(x,y,2,4)}c.globalAlpha=1;
 c.fillStyle='#16273c';c.strokeStyle='#e8c475';c.lineWidth=2;c.beginPath();c.arc(0,-40,17,0,Math.PI*2);c.fill();c.stroke();c.font='bold 18px serif';c.fillStyle=color;c.textAlign='center';c.fillText({shield:'◆',sword:'†',star:'✦',wing:'♢'}[key],0,-34);c.restore();}
window.ArenaStyle={render,gate};
})();
