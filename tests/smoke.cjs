const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(fs.readFileSync(__dirname+'/../index.html'));});await new Promise(r=>server.listen(0,'127.0.0.1',r));server.unref();
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || "/usr/bin/chromium"});const page=await browser.newPage({acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));let requests=0;
 await page.route('https://api.mistral.ai/v1/chat/completions',async route=>{
 const req=route.request();const body=req.postDataJSON();assert.equal(body.model,'open-mistral-7b');assert.equal(req.headers().authorization,'Bearer test-key');assert(!body.messages[0].content.includes('Ada'));requests++;
 const level=Number(body.messages[0].content.match(/level (\d+)/)[1]);const mins=[1,1,5,10,20,100,100,1000,10000,100000];await route.fulfill({json:{choices:[{message:{content:JSON.stringify({a:mins[level-1],b:mins[level-1]})}}]}});
 });
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.locator('#key').fill('test-key');await page.getByRole('button',{name:'Confirm',exact:true}).click();await page.locator('#app').waitFor({state:'visible'});
 await page.locator('#student').fill('Ada');await page.getByRole('button',{name:'Start exercise',exact:true}).click();
 for(let n=1;n<=10;n++){
 await page.waitForFunction(()=>!document.getElementById('answer').disabled);
 await page.evaluate(()=>{started=performance.now();});
 const answer=await page.evaluate(()=>String(current.a+current.b));await page.locator('#answer').fill(answer);
 if(n===10){const download=page.waitForEvent('download');await page.locator('#submit').click();await (await download).saveAs('/tmp/addition-smoke.pdf');}else{await page.locator('#submit').click();await page.locator('#next').click();}
 }
 assert.match(await page.locator('#reports').innerText(),/Level 10\/10.*10\/10 correct/);
 await page.reload();await page.locator('#key').fill('test-key');await page.getByRole('button',{name:'Confirm',exact:true}).click();await page.locator('#app').waitFor({state:'visible'});assert.match(await page.locator('#reports').innerText(),/Ada/);
 await page.locator('#student').fill('Sam');await page.locator('#start button').click();await page.waitForFunction(()=>!document.getElementById('answer').disabled);await page.locator('#answer').fill('999');await page.locator('#submit').click();assert.match(await page.locator('#feedback').innerText(),/1 \+ 1 = 2/);
 const d=page.waitForEvent('download');await page.locator('#stop').click();await d;
 const checks=await page.evaluate(()=>({down:adapt(5,[{correct:false,seconds:2,level:5}]),slow:adapt(3,[3,2,1.5].map(seconds=>({correct:true,seconds,level:3}))),steady:adapt(3,[{correct:true,seconds:4,level:3}]),reject:(()=>{try{parseSum('{"a":999,"b":1}',1);return false;}catch{return true;}})()}));assert.deepEqual(checks,{down:4,slow:4,steady:3,reject:true});
 assert.deepEqual(errors,[]);assert(requests>=13);await browser.close();server.close();console.log('PASS: connection gate, API request, 10 levels, completion, PDF, report persistence, corrections, stop, adaptive rules, AI validation.');
})().catch(e=>{console.error(e);process.exit(1);});
