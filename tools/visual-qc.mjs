import fs from 'node:fs/promises';
const sizes=[[320,568],[360,800],[390,844],[430,932],[667,375],[844,390],[768,1024],[820,1180],[1024,768],[1280,720],[1366,768],[1440,900],[1920,1080],[2560,1440]];
/** Run against an ego-browser Page in an active TaskSpace.
 * Checks rendered heading hierarchy and collisions at three scroll positions.
 * Example: await runVisualQc(task.page('p1'), { outputPath: '/tmp/ami-qc.json' });
 */
export async function runVisualQc(p, { baseUrl = 'http://localhost:4321', outputPath } = {}) {const results=[];
for(const [route,selector] of [['/copy-2-of-consulting','.expertise-network'],['/copy-of-loans','.funding-blueprint'],['/copy-of-donate','.support-amplifier']]){
 await p.goto(baseUrl+route);
 for(const [width,height] of sizes){
  await p.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  for(const progress of [0,.5,1]){
   await p.evaluate(({selector,progress})=>{const e=document.querySelector(selector);const travel=Math.max(0,e.offsetHeight-innerHeight+72);scrollTo({top:e.getBoundingClientRect().top+scrollY-72+travel*progress,behavior:'instant'})},{selector,progress});
   await p.evaluate(()=>new Promise(r=>{const timer=setTimeout(r,350);let n=0;function tick(){if(++n>=20){clearTimeout(timer);r()}else requestAnimationFrame(tick)}requestAnimationFrame(tick)}));
   const result=await p.evaluate(selector=>{
    const root=document.querySelector(selector);const h=root.querySelector('h2'),em=h.querySelector('em');const collisions=[];
    const cards=[...root.querySelectorAll('.topic')];
    if(root.classList.contains('is-resolve'))for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++){
     const a=cards[i].getBoundingClientRect(),b=cards[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)collisions.push([i,j]);
    }
    const note=root.querySelector('.board-footnote');
    const noteOverlap=note?[...root.querySelectorAll('.blueprint-notes article')].some(e=>e.offsetTop+e.offsetHeight+new DOMMatrix(getComputedStyle(e).transform).m42>note.offsetTop+1):false;
    return {emSize:em?parseFloat(getComputedStyle(em).fontSize):null,headingSize:parseFloat(getComputedStyle(h).fontSize),collisions,noteOverlap,pageOverflow:document.documentElement.scrollWidth>innerWidth+1,flowClipping:root.classList.contains('is-flow')&&[...root.querySelectorAll('.word-window')].some(e=>getComputedStyle(e).overflow==='hidden')};
   },selector);
   results.push({route,width,height,progress,...result});
  }
 }
 console.log(route,'done');
}
const failures=results.filter(r=>r.emSize!==r.headingSize||r.collisions.length||r.noteOverlap||r.pageOverflow||r.flowClipping);
if (outputPath) await fs.writeFile(outputPath,JSON.stringify(results,null,2));
if (failures.length) throw new Error(JSON.stringify(failures,null,2));
return { checks: results.length, failures: 0 };
}
