import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';
const configured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE_') && !firebaseConfig.projectId.startsWith('PASTE_');
const auth = configured ? getAuth(initializeApp(firebaseConfig)) : null;
const friendly = e => ({'auth/invalid-credential':'帳號或密碼錯誤。','auth/invalid-email':'Email 格式不正確。','auth/too-many-requests':'嘗試次數過多，請稍後再試。','auth/network-request-failed':'網路連線失敗。','auth/unauthorized-domain':'此網域尚未加入 Firebase 授權網域。'}[e.code] || '登入失敗，請確認 Firebase 設定與網路連線。');
const page = location.pathname.split('/').pop() || 'index.html';
if (page === 'login.html') {
  const form=document.querySelector('#loginForm'),msg=document.querySelector('#loginMessage'),submit=document.querySelector('#loginSubmit');
  if(!configured){msg.textContent='尚未設定 Firebase，請先編輯 firebase-config.js。';submit.disabled=true;}
  else {
    onAuthStateChanged(auth,user=>{if(user) location.replace('index.html');});
    form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;msg.textContent='驗證中…';try{await setPersistence(auth,browserLocalPersistence);await signInWithEmailAndPassword(auth,form.email.value.trim(),form.password.value);location.replace('index.html');}catch(err){msg.textContent=friendly(err);submit.disabled=false;}});
  }
} else {
  const overlay=document.createElement('div');overlay.className='auth-loading';overlay.textContent='正在確認登入狀態…';document.body.prepend(overlay);
  if(!configured){location.replace('login.html');}
  else onAuthStateChanged(auth,user=>{
    if(!user){location.replace('login.html');return;}
    window.IRS_AUTH_UID=user.uid;
    document.querySelectorAll('[data-user-email]').forEach(el=>el.textContent=user.email||'已登入');
    document.querySelectorAll('[data-logout]').forEach(btn=>btn.addEventListener('click',async()=>{btn.disabled=true;try{await signOut(auth);location.replace('login.html');}catch{btn.disabled=false;alert('登出失敗，請重試');}}));
    for(const name of ['app.js', ...(page==='start.html'?['training.js']:page==='record.html'?['records.js']:[])]){
      const script=document.createElement('script');script.src=name;script.async=false;document.body.appendChild(script);
    }
    if(page==='index.html'){
      const script=document.createElement('script');script.src='dashboard.js';script.async=false;document.body.appendChild(script);
    }
    overlay.remove();document.documentElement.classList.add('auth-ready');
  },()=>{overlay.textContent='驗證服務暫時無法使用，請重新整理。';});
}
