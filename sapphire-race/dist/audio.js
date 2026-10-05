(() => {
'use strict';
let ac=null,master=null,noiseBuffer=null,enabled=true,timer=null,moving=false,lap=0,beat=0;
try{enabled=localStorage.getItem('sapphire-sound')!=='off'}catch{}
const button=document.querySelector('#soundToggle');function label(){button.textContent=enabled?'Звук: вкл':'Звук: выкл';button.setAttribute('aria-pressed',String(enabled))}label();
function unlock(){if(!enabled)return;try{if(!ac){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;ac=new A();master=ac.createGain();master.gain.value=.28;master.connect(ac.destination);noiseBuffer=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=noiseBuffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}if(ac.state==='suspended')ac.resume().catch(()=>{});}catch{}}
function tone(freq,duration,volume=.2,delay=0,type='sine',end=freq){if(!enabled||!ac||ac.state!=='running')return;const t=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,volume),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(master);o.start(t);o.stop(t+duration+.025)}
function noise(duration,volume=.2,freq=1200,delay=0,end=freq){if(!enabled||!ac||ac.state!=='running')return;const t=ac.currentTime+delay,b=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();b.buffer=noiseBuffer;f.type='bandpass';f.Q.value=.65;f.frequency.setValueAtTime(freq,t);f.frequency.exponentialRampToValueAtTime(Math.max(40,end),t+duration);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(volume,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+duration);b.connect(f);f.connect(g);g.connect(master);b.start(t,Math.random());b.stop(t+duration+.025)}
function chime(base=660){[1,1.25,1.5,2].forEach((n,i)=>{tone(base*n,.65,.12,i*.095);tone(base*n*2,.35,.035,i*.095)})}
function hoof(){const accents=[.32,.18,.24,.13];tone(160+(beat%4)*22,.085,accents[beat%4],0,'sine',48);noise(.065,.23,1500);if(lap===1)noise(.20,.18,420);if(lap===2)noise(.25,.10,1000,0,2200);if(beat%4===0)noise(.22,.09,230);beat++}
function movement(on,nextLap=0){lap=nextLap;moving=on;if(on&&!timer){beat=0;hoof();timer=setInterval(()=>{if(!document.hidden)hoof()},145)}if(!on&&timer){clearInterval(timer);timer=null}}
function effect(kind,success=true){if(!enabled||document.hidden)return;
if(kind==='ram'||kind==='hit'){noise(.30,.40,1600,0,350);tone(95,.35,.5,.20,'sine',28);noise(.22,.55,600,.22);tone(460,.30,.09,.25,'triangle',210);return}
if(kind==='dark'){noise(.7,.2,450,0,140);tone(110,.8,.18,0,'triangle',42);tone(190,.5,.08,.12,'sine',85)}
if(kind==='fire'){noise(.9,.25,550,0,2600);for(let i=0;i<6;i++)noise(.07,.16,1800,i*.12);tone(140,.65,.18,0,'sine',55)}
if(kind==='portal'){tone(260,.55,.14,0,'sine',1300);noise(.55,.18,600,0,3200);[520,780,1040].forEach((f,i)=>tone(f,.4,.10,.35+i*.07,'triangle'))}
if(kind==='crystal'){chime(440);[0,.22,.44].forEach(t=>noise(.10,.10,3500,t))}
if(kind==='lightning'){for(let i=0;i<7;i++){noise(.08,.30,1200+i*200,i*.075);tone(65,.15,.16,i*.08,'sawtooth',30)}noise(.45,.25,180,.32)}
if(kind==='steam')noise(1.1,.22,2600,0,900);
if(kind==='wind'){noise(.9,.2,450,0,2200);tone(740,.6,.05,.14,'sine',1100)}
if(kind==='light'||kind==='shield'){chime(kind==='shield'?330:660);noise(.55,.10,3200,.1)}
if(kind==='ultimate'){chime(440);chime(880);noise(1.3,.28,300,0,3000);tone(80,1,.32,.35,'sine',30)}
if(kind==='repair'){[800,1100,1350].forEach((f,i)=>tone(f,.15,.09,i*.15,'triangle'));noise(.07,.08,2800,.35)}
if(kind==='bird'){tone(1900,.08,.025,0,'sine',2800);tone(2600,.07,.018,.14,'sine',2000)}
if(kind==='gate'){chime(520)}
if(!success){tone(190,.28,.10,.5,'triangle',95)}
}
button.onclick=()=>{enabled=!enabled;try{localStorage.setItem('sapphire-sound',enabled?'on':'off')}catch{}if(enabled)unlock();if(master)master.gain.setTargetAtTime(enabled?.28:0,ac.currentTime,.08);label();if(enabled)chime(440)};
document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);document.addEventListener('visibilitychange',()=>{if(document.hidden&&master)master.gain.setTargetAtTime(0,ac.currentTime,.08);else if(master)master.gain.setTargetAtTime(enabled?.28:0,ac.currentTime,.08)});
function crowd(kind){if(!enabled||document.hidden)return;unlock();if(kind==='cheer'){
 // Irregular broadband transients read as applause; rising vowel tones give the crowd a shared swell.
 for(let i=0;i<30;i++)noise(.055,.09+(i%4)*.025,1600+(i%6)*350,i*.045);
 for(let i=0;i<7;i++){const delay=i*.045;noise(.9,.055,450+i*80,delay,1200);tone(210+i*31,.95,.025,delay,'triangle',330+i*35);tone(630+i*65,.7,.015,delay,'sine',850+i*60)}
 }else{for(let i=0;i<8;i++){tone(330+i*18,1.15,.025,i*.04,'triangle',130+i*13);tone(690+i*30,.95,.012,i*.04,'sine',390+i*18)}noise(1.1,.12,2400,.25,1700);noise(.8,.065,500,0,250)}
}
window.RaceAudio={movement,effect,crowd,unlock,get enabled(){return enabled}};
})();
