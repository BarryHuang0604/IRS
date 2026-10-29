# IRS 2.2 — 極簡版

保留 Firebase Email/Password 登入、復健模擬、紀錄統計與 CSV 匯出。首頁改為簡潔入口及三個統計數字。

## GitHub Pages 更新
1. 解壓縮 ZIP，將檔案上傳至 IRS 儲存庫根目錄，取代同名檔案。
2. 確認 Firebase Authentication 已啟用 Email/Password，且授權網域含 `barryhuang0604.github.io`。
3. 進入 `https://barryhuang0604.github.io/IRS/login.html` 測試登入。

## 說明
這是模擬展示系統，不會控制實體 ESP32。Firebase 驗證是真實登入，但復健紀錄仍存在瀏覽器 localStorage，不適合存放真實病患資料。
