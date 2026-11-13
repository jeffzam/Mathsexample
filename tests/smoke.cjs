const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(fs.readFileSync(__dirname+'/../index.html'));});await new Promise(r=>server.listen(0,'127.0.0.1',r));server.unref();
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || "/usr/bin/chromium"});const page=await browser.newPage({acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));let requests=0;
 await page.route('https://**/*',route=>{requests++;return route.abort();});
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.context().setOffline(true);
 assert.equal(await page.locator('#key').count(),0);
 await page.locator('#student').fill('Ada');await page.getByRole('button',{name:'Start exercise',exact:true}).click();
 for(let n=1;n<=10;n++){
 await page.waitForFunction(()=>!document.getElementById('answer').disabled);
 await page.evaluate(()=>{started=performance.now();});
 const answer=await page.evaluate(()=>String(current.a+current.b));await page.locator('#answer').fill(answer);
 if(n===10){const download=page.waitForEvent('download');await page.locator('#submit').click();await (await download).saveAs('/tmp/addition-smoke.pdf');}else{await page.locator('#submit').click();await page.locator('#next').click();}
 }
 assert.match(await page.locator('#reports').innerText(),/Level 10\/10.*10\/10 correct/);
 await page.context().setOffline(false);await page.reload();await page.context().setOffline(true);assert.match(await page.locator('#reports').innerText(),/Ada/);
 await page.locator('#student').fill('Sam');await page.locator('#start button').click();await page.waitForFunction(()=>!document.getElementById('answer').disabled);const correction=await page.evaluate(()=>`${current.a} + ${current.b} = ${current.a+current.b}`);await page.locator('#answer').fill('999');await page.locator('#submit').click();assert.match(await page.locator('#feedback').innerText(),new RegExp(correction.replace('+','\\+')));
 const d=page.waitForEvent('download');await page.locator('#stop').click();await d;
 const checks=await page.evaluate(()=>({down:adapt(5,[{correct:false,seconds:2,level:5}]),slow:adapt(3,[3,2,1.5].map(seconds=>({correct:true,seconds,level:3}))),steady:adapt(3,[{correct:true,seconds:4,level:3}])}));assert.deepEqual(checks,{down:4,slow:4,steady:3});
 assert.deepEqual(errors,[]);assert.equal(requests,0);await browser.close();server.close();console.log('PASS: offline operation, no API requests, 10 levels, completion, PDF, report persistence, corrections, stop, adaptive rules.');
})().catch(e=>{console.error(e);process.exit(1);});
