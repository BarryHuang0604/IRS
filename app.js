'use strict';
// IRS 2.0 — demonstration only. No real device commands or credentials.
const IRS = (() => {
  const KEY='irs2_sessions', LOG='irs2_events', MAX=100;
  function read(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return []}}
  function sessions(){return read(KEY).filter(x=>x&&Number.isFinite(x.target)&&Number.isFinite(x.completed)&&x.target>0&&x.completed>=0&&x.completed<=x.target&&typeof x.id==='string').slice(0,MAX)}
  function events(){return read(LOG).slice(0,MAX)}
  function saveSession(s){const all=[s,...sessions()].slice(0,MAX);try{localStorage.setItem(KEY,JSON.stringify(all));return true}catch{return false}}
  function log(message){const e=[{at:new Date().toISOString(),message:String(message).slice(0,160)},...events()].slice(0,MAX);try{localStorage.setItem(LOG,JSON.stringify(e))}catch{}}
  function clear(){localStorage.removeItem(KEY);localStorage.removeItem(LOG)}
  function stats(){const all=sessions();return {count:all.length,completed:all.reduce((n,x)=>n+x.completed,0),avg:all.length?Math.round(all.reduce((n,x)=>n+x.completed/x.target*100,0)/all.length):0}}
  function date(s){const d=new Date(s);return Number.isNaN(d.getTime())?'—':d.toLocaleString('zh-TW',{hour12:false})}
  function safeId(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2)}
  return {sessions,events,saveSession,log,clear,stats,date,safeId};
})();
