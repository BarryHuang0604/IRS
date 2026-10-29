'use strict';
const $ = id => document.getElementById(id);
const directions = [
  ['上',0,-1],['右上',Math.SQRT1_2,-Math.SQRT1_2],['右',1,0],
  ['右下',Math.SQRT1_2,Math.SQRT1_2],['下',0,1],
  ['左下',-Math.SQRT1_2,Math.SQRT1_2],['左',-1,0],['左上',-Math.SQRT1_2,-Math.SQRT1_2]
];
let phase='idle', target=3, completed=0, stepMs=1200, order=[], directionIndex=0;
let frame=null, countdownTimer=null, elapsedInSet=0, lastFrameTime=0, elapsedRunning=0;
let events=[];
function log(message){
  events.unshift({at:new Date().toLocaleTimeString('zh-TW',{hour12:false}),message});
  $('eventLog').replaceChildren(...events.slice(0,30).map(e=>{const div=document.createElement('div');div.textContent=e.at+' · '+e.message;return div;}));
  IRS.log(message);
}
function shuffle(){
  const a=Array.from({length:8},(_,i)=>i);
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function moveCart(direction,portion){
  const d=directions[direction];
  const radius=(portion<=.5?portion*2:(1-portion)*2)*33.75;
  $('sliderCart').style.left=(50+d[1]*radius)+'%';
  $('sliderCart').style.top=(50+d[2]*radius)+'%';
}
function resetCart(){ $('sliderCart').style.left='50%';$('sliderCart').style.top='50%'; }
function render(){
  const labels={idle:'待機中',countdown:'倒數準備',running:'進行中',paused:'已暫停',finished:'已完成'};
  const english={idle:'READY',countdown:'STARTING',running:'RUNNING',paused:'PAUSED',finished:'DONE'};
  $('stateBadge').textContent=labels[phase];$('phase').textContent=english[phase];
  $('title').textContent=({idle:'準備開始',countdown:'即將開始',running:'復健進行中',paused:'已暫停',finished:'訓練結束'})[phase];
  $('counter').textContent=completed+' / '+target+' 組';
  const progress=Math.min(100,(completed+Math.min(1,elapsedInSet/(stepMs*8)))/target*100);
  $('percent').textContent=Math.round(progress)+'%';$('progress').style.width=progress+'%';
  const active=phase==='running'||phase==='paused';
  $('startBtn').disabled=active||phase==='countdown';$('pauseBtn').disabled=!active;
  $('pauseBtn').textContent=phase==='paused'?'繼續':'暫停';
  $('stopBtn').disabled=!(active||phase==='countdown');
  $('target').disabled=active||phase==='countdown';$('speed').disabled=active||phase==='countdown';
  if(phase==='idle'){$('countdown').textContent='準備開始';$('direction').textContent='目前方向：待機';}
  if(phase==='paused')$('countdown').textContent='已暫停';
  if(phase==='finished')$('countdown').textContent='本次訓練結束';
}
function cancel(){clearInterval(countdownTimer);countdownTimer=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;}
function finish(reason){
  if(!['running','paused','countdown'].includes(phase))return;
  cancel();phase='finished';resetCart();
  const record={id:IRS.safeId(),date:new Date().toISOString(),target,completed,
    durationSeconds:Math.round(elapsedRunning/1000),status:reason};
  const saved=IRS.saveSession(record);
  log((reason==='completed'?'完成':'結束')+'：'+completed+' / '+target+' 組'+(saved?'，已儲存':'，儲存失敗'));
  $('message').textContent=saved?'訓練紀錄已儲存。':'訓練結束，但紀錄儲存失敗。';render();
}
function animate(now){
  if(phase!=='running')return;
  const delta=Math.max(0,Math.min(now-lastFrameTime,100));lastFrameTime=now;
  elapsedInSet+=delta;elapsedRunning+=delta;
  const setDuration=stepMs*8;
  while(elapsedInSet>=setDuration){
    elapsedInSet-=setDuration;completed++;
    log('完成第 '+completed+' 組（8 個方向）');
    if(completed>=target){elapsedInSet=0;finish('completed');return;}
    order=shuffle();directionIndex=-1;
    log('第 '+(completed+1)+' 組：已重新隨機排列八方向');
  }
  const index=Math.min(7,Math.floor(elapsedInSet/stepMs));
  const portion=(elapsedInSet%stepMs)/stepMs;
  const direction=order[index];moveCart(direction,portion);
  if(index!==directionIndex){directionIndex=index;log('第 '+(completed+1)+' 組，第 '+(index+1)+'/8 方向：'+directions[direction][0]);}
  $('direction').textContent='第 '+(completed+1)+' 組 · '+(index+1)+'/8 · '+directions[direction][0];
  $('countdown').textContent='本組方向隨機，八方向各一次';
  render();frame=requestAnimationFrame(animate);
}
function resume(){phase='running';lastFrameTime=performance.now();log('訓練'+(elapsedRunning?'繼續':'開始'));$('message').textContent='每組八個方向隨機排序，完成後開始下一組。';render();frame=requestAnimationFrame(animate);}
$('startBtn').addEventListener('click',()=>{
  const n=Number($('target').value);
  if(!Number.isInteger(n)||n<1||n>100){$('message').textContent='請輸入 1 至 100 組。';return;}
  cancel();target=n;completed=0;elapsedInSet=0;elapsedRunning=0;stepMs=Number($('speed').value);
  order=shuffle();directionIndex=-1;events=[];resetCart();phase='countdown';
  log('準備開始：'+target+' 組，每組八方向隨機排列');render();
  let seconds=5;$('countdown').textContent=seconds+' 秒';
  countdownTimer=setInterval(()=>{seconds--;$('countdown').textContent=seconds>0?seconds+' 秒':'開始！';if(seconds<=0){clearInterval(countdownTimer);countdownTimer=null;resume();}},1000);
});
$('pauseBtn').addEventListener('click',()=>{
  if(phase==='running'){cancel();phase='paused';log('訓練暫停');}
  else if(phase==='paused'){resume();return;}
  render();
});
$('stopBtn').addEventListener('click',()=>finish('stopped'));
window.addEventListener('pagehide',cancel);
resetCart();render();
