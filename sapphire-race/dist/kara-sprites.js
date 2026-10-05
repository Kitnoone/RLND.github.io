(() => {
'use strict';
const image=new Image();image.src='./assets/kara-action-atlas.png';
const meta=window.SapphireAtlasMeta,rows={overtake:0,ram:1,universal_ram:1,calm:2};
function draw(ctx,{key,time=0,progress=0,reduced=false,width=100,success=true}={}){
 const row=rows[key];if(row===undefined||!image.complete||!image.naturalWidth)return false;
 const phase=Math.max(0,Math.min(.999,progress));
 const index=reduced?5:key==='overtake'?Math.floor(time/115)%6:Math.floor(phase*6);
 const f=meta.frames[row*6+index],scale=Math.min(width/meta.maxW,width*1.5/meta.maxH);
 ctx.drawImage(image,f.x,f.y,f.w,f.h,-f.anchorX*scale,-f.anchorY*scale,f.w*scale,f.h*scale);
 return true;
}
window.KaraSprites={draw,has:key=>rows[key]!==undefined,get ready(){return image.complete&&!!image.naturalWidth}};
})();
