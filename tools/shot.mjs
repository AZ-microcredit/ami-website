import puppeteer from 'puppeteer-core';
import fs from 'fs';
const urls = fs.readFileSync(process.argv[2],'utf8').split('\n').filter(Boolean);
const outdir = process.argv[3] || 'shots2';
fs.mkdirSync(outdir,{recursive:true});
const slugOf = u => { let s=u.replace(/^https:\/\/www\.azmicrocredit\.org\/?/,''); if(!s) s='index'; s=decodeURIComponent(s).replace(/[\/:?&|]/g,'__').replace(/[^A-Za-z0-9._-]/g,'_'); return s; };
const browser = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--hide-scrollbars','--no-sandbox']});
const CONC = 4;
let i=0;
async function worker(){
  while(i<urls.length){
    const u=urls[i++]; const slug=slugOf(u); const f=`${outdir}/${slug}.png`;
    if(fs.existsSync(f) && !process.env.FORCE) continue;
    const page = await browser.newPage();
    try{
      await page.setViewport({width:1280,height:800});
      await page.goto(u,{waitUntil:'networkidle2',timeout:60000});
      // dismiss cookie banner
      try{ await page.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Accept'); if(b) b.click(); }); }catch(e){}
      // scroll through
      const h = await page.evaluate(()=>document.body.scrollHeight);
      for(let y=0;y<h;y+=500){ await page.evaluate(y=>window.scrollTo(0,y),y); await new Promise(r=>setTimeout(r,150)); }
      await new Promise(r=>setTimeout(r,1500));
      await page.evaluate(()=>window.scrollTo(0,0));
      await new Promise(r=>setTimeout(r,800));
      await page.screenshot({path:f, fullPage:true});
      console.log('ok', slug);
    }catch(e){ console.log('ERR', slug, e.message); }
    await page.close();
  }
}
await Promise.all(Array.from({length:CONC},worker));
await browser.close();
