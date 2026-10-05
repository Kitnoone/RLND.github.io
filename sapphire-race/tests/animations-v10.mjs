import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const nodes=new Map();let frame,clock=0,draws=0;
const ctx=new Proxy({},{get:(o,k)=>k in o?o[k]:(...args)=>{if(k==='drawImage')draws++;if(k==='createLinearGradient')return {addColorStop(){}};if(k==='createPattern')return {};}});
const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',value:'gallop',hidden:true,width:1024,height:1536,style:{},dataset:{},classList:{toggle(){},add(){},remove(){}},removeAttribute(k){delete this[k]},addEventListener(){},querySelector(){return node('child')},getBoundingClientRect(){return {width:0,right:0,bottom:72,top:700}},getContext(){return ctx},showModal(){}});return nodes.get(selector);};
class Image{constructor(){this.complete=true;this.naturalWidth=1024;this.naturalHeight=1536;images.push(this)}}const images=[];
const context={console,Image,Math,Date,JSON,Promise,Number,Object,Array,Set,String,Boolean,innerWidth:1280,innerHeight:900,devicePixelRatio:1,document:{addEventListener(){},querySelector:node,querySelectorAll:()=>[],createElement:()=>node(Math.random()),body:{dataset:{},append(){},classList:{toggle(){},remove(){}}}},localStorage:{getItem:()=>null,setItem(){}},sessionStorage:{getItem:()=>null,setItem(){}},location:{hash:''},history:{replaceState(){}},navigator:{},performance:{now:()=>clock},requestAnimationFrame:f=>frame=f,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},confirm:()=>true,MutationObserver:class{observe(){}},matchMedia:()=>({matches:false})};
context.clockTest=()=>clock;context.window=context;context.addEventListener=()=>{};
let app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');app=app.replace('  bindStaticControls();\n  render();\n  registerWebMCP();','globalThis.rules={defaultState,resolveDrive,sceneCue,set state(v){state=v},get state(){return state}};');
vm.runInNewContext(app,context);
for(const file of ['arena-style.js','kara.js','scene.js'])vm.runInNewContext(fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8').replace('window.SapphireScene={run,','window.SapphireScene={inspectTest:()=>({focus,follow,p:visualPoint(focus),lane:laneOffset(focus),pathPoint:point(.15),offsets:ids.map(id=>laneOffset(id)),formation:(arrangeVehicles(clockTest()),Array.from(formation.values())),duration:activeFx?.duration}),run,'),context);
images.forEach(im=>im.onload?.());assert(context.KaraAnimator.ready);
for(const key of Object.keys(context.KaraAnimator.definitions)){
 const before=JSON.stringify(context.SapphireRace.snapshot().state);
 assert(context.SapphireScene.previewKara(key),key+' preview begins');
 assert(!context.SapphireScene.previewKara(key),'Overlapping animation blocked');

 for(let i=0;i<20;i++){clock+=250;frame(clock)}
 assert(!context.SapphireScene.busy,key+' finishes');
 assert.equal(JSON.stringify(context.SapphireRace.snapshot().state),before,key+' preview never mutates race');
}
assert(draws>100,'Animated sprite rendered');
context.rules.state.phase='rivals';context.rules.state.masterTurnOrder=['aegon','saira'];context.rules.state.masterTurnIndex=0;context.SapphireScene.sync();assert.equal(context.SapphireScene.inspectTest().focus,'aegon');context.rules.state.masterTurnIndex=1;context.SapphireScene.sync();assert.equal(context.SapphireScene.inspectTest().focus,'saira','Camera follows the next active NPC');

// Changing route moves smoothly, then remains in that channel across stages and distance changes.
const laneState=context.rules.state;laneState.roadLanes.saira=5;laneState.lastCueRoadLanes={...laneState.roadLanes};context.SapphireScene.sync();clock+=1800;laneState.roadLanes.saira=0;laneState.lastCueRoadLanes={...laneState.roadLanes};context.SapphireScene.sync();const initial=context.SapphireScene.inspectTest().lane;
clock+=900;const midway=context.SapphireScene.inspectTest().lane;clock+=900;const settled=context.SapphireScene.inspectTest().lane;
assert(midway<initial&&midway>settled,'Lane change interpolates rather than snapping');assert(settled<0,'Left passage remains left');
laneState.stageIndex+=1;laneState.rivalRoutes={};laneState.distance.saira+=7;context.SapphireScene.sync();assert.equal(context.SapphireScene.inspectTest().lane,settled,'Next stage and distance gains do not reset the chosen lane');
laneState.roadLanes.saira=5;laneState.lastCueRoadLanes={...laneState.roadLanes};context.SapphireScene.sync();assert.equal(context.SapphireScene.inspectTest().lane,settled,'Opposite choice starts at the previous position');clock+=1800;assert(context.SapphireScene.inspectTest().lane>0,'Explicit opposite choice changes channel');
assert.equal(context.SapphireScene.inspectTest().pathPoint.x,952,'Right straight stays within track borders');

for(const [raw,total,wanted] of [[18,30,'overtake'],[10,14,'drive'],[1,1,'hit']]){
 const state=context.rules.defaultState();state.started=true;state.phase='drive';state.stageIndex=9;state.selection.arc='shield';context.rules.state=state;context.rules.resolveDrive({raw,total});assert(state.sceneEvents.some(e=>e.actor==='player'&&e.key===wanted),wanted+' roll routes to animation');
}
// Restored scene uses original map proportions and full-size tokens.
const pack=context.rules.defaultState();pack.started=true;pack.phase='choice';pack.trackLanes=Object.fromEntries(['player','aegon','saira','pello','mael','ordis'].map(id=>[id,-1]));pack.lastCueBranches={...pack.trackLanes};pack.distance=Object.fromEntries(Object.keys(pack.trackLanes).map(id=>[id,10]));context.rules.state=pack;context.SapphireScene.sync();clock+=1900;frame(clock);
let inspection=context.SapphireScene.inspectTest();assert(inspection.formation.every(p=>p.width===100),'Original token size is preserved');assert.equal(new Set(inspection.offsets).size,6,'Six distinct circular rails even in one passage');assert(inspection.offsets.every(n=>Math.abs(n)<=90),'Six lanes stay within the original track');assert(inspection.offsets[0]<inspection.offsets[5],'First lane is inner, sixth outer');
const beforeDistances=Object.fromEntries(Object.keys(pack.distance).map(id=>[id,10]));for(const id of Object.keys(pack.distance))pack.distance[id]=20;context.SapphireScene.sync();context.SapphireScene.enqueue({actor:'player',key:'drive',label:'Общий проезд',stage:pack.stageIndex,beforeDistances,afterDistances:{...pack.distance},success:true});
assert.equal(context.SapphireScene.inspectTest().duration,20000,'Group travel remains slow');clock+=5000;frame(clock);assert(context.SapphireScene.busy,'Group is still moving halfway through');clock+=15100;frame(clock);assert(!context.SapphireScene.busy,'Group travel completes without a second fake movement');assert(Object.values(pack.distance).every(n=>n===20),'Animation never changes rules distances');

assert.equal(context.KaraAnimator.mode({busy:true,lap:2}),'flight');assert.equal(context.KaraAnimator.mode({busy:true,lap:0}),'gallop');assert.equal(context.KaraAnimator.pose('flight',100,.5,true).wave,0);
console.log('PASS: 17 animation previews, exclusive queue, no race/resource mutation, sprite rendering, successful overtake/drive and failed-hit routing, airborne lap, reduced motion, camera follows active NPC, original map scale and token size, six lane offsets within track, persistent channels, slow group travel.');

for(const key of ['overtake','ram','calm']){
 for(const phase of [0,1]){
  const pose=context.KaraAnimator.pose(key,2345,phase,false);
  assert(Math.abs(pose.bob)<1e-10,'Action settles without a pose jump');
  assert(Math.abs(pose.motion)<1e-10,'Articulated motion eases at boundaries');
 }
}
assert(!fs.readFileSync(new URL('../dist/scene.js',import.meta.url),'utf8').includes('KaraSprites'),'All actions share original token renderer');
console.log('PASS: one model for all actions and smooth motion boundaries.');
