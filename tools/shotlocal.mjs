import puppeteer from 'puppeteer-core';
import fs from 'fs';
const paths = process.argv.slice(3);
const outdir = process.argv[2];
fs.mkdirSync(outdir,{recursive:true});
const browser = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--hide-scrollbars','--no-sandbox']});
for (const p of paths) {
  const [path, w] = p.split('@'); const width = Number(w||1280);
  const page = await browser.newPage();
  await page.setViewport({width, height:800});
  await page.goto('http://localhost:4321'+path,{waitUntil:'networkidle0',timeout:60000});
  await page.evaluate(()=>{ try{localStorage.setItem('ami-cookie-consent','accepted')}catch(e){} document.getElementById('cookie-banner')?.remove(); });
  await new Promise(r=>setTimeout(r,800));
  const slug=(path==='/'?'index':path.replace(/^\//,'').replace(/\//g,'__'))+(w?'-'+w:'');
  await page.screenshot({path:`${outdir}/${slug}.png`, fullPage:true});
  console.log('ok', slug);
  await page.close();
}
await browser.close();
