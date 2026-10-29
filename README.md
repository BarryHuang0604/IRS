# IRS 2.1 — Firebase Authentication + 極簡模擬展示

## 上線方式
1. Firebase Console 建立專案 → Authentication → Sign-in method → 啟用 Email/Password。
2. Authentication → Users → Add user，建立專門的展示帳號。**不要在 GitHub 寫入密碼**。
3. Project settings → Your apps → 建立 Web app，複製 Firebase 網頁設定到 `firebase-config.js`。這些網頁設定值是公開的專案識別資訊，不是私密憑證。
4. Authentication → Settings → Authorized domains，新增 `barryhuang0604.github.io`（不包含 https:// 或路徑）。
5. 將此資料夾中的全部檔案上傳至 GitHub `barryhuang0604/IRS` 儲存庫根目錄，取代同名檔案。保持 GitHub Pages 既有設定。
6. 開啟 `https://barryhuang0604.github.io/IRS/login.html` 測試登入；登入後可進入首頁、模擬訓練與紀錄頁。

## 安全範圍與限制
- 使用 Firebase Authentication 驗證帳號密碼，前端不包含硬編碼密碼。
- `index.html`、`start.html`、`record.html` 的操作內容在驗證後才初始化；但 GitHub Pages 上的 HTML/JS 原始碼仍可被任何人下載。**這不是保護靜態頁面內容的伺服器端存取控制**。
- 模擬紀錄儲存在 localStorage，使用 Firebase UID 分開儲存，但同一瀏覽器的其他使用者仍可能透過開發者工具讀取或修改 localStorage。**不能用於真實個資、醫療紀錄或保密資料**。
- 登入不代表後端資料存取授權；若要跨裝置同步，請使用 Firestore 並設定每位使用者只能讀寫自己 UID 的 Security Rules。
- 沒有任何 ESP32 控制指令；訓練與設備狀態皆為模擬。
- Firebase 設定中不得放置 service account private key、管理員金鑰、Arduino Cloud Access Token。
- 舊版 Google Apps Script 資料讀取不在本版啟用。

## 檔案
- `login.html` 登入頁
- `auth.js` Firebase 登入、登出、頁面登入狀態
- `firebase-config.js` 填入 Firebase 專案網頁設定
- `index.html` 首頁
- `start.html` 訓練模擬
- `record.html` 紀錄分析
- `app.js` 本機資料與統計
- `dashboard.js` 首頁統計
- `training.js` 訓練邏輯
- `records.js` 紀錄表格與 CSV 匯出
- `style.css` 極簡淺色樣式

## 測試
- 未登入直接開 `start.html` / `record.html` 應轉至登入頁。
- 正確帳號密碼可登入，錯誤密碼應顯示提示。
- 登入後訓練模擬、暫停、結束、紀錄、匯出 CSV 可用。
- 登出後回登入頁，重新整理受保護頁面會轉回登入頁。
- 請使用 GitHub Pages / localhost HTTP server 測試，勿直接雙擊 `file://` 執行。
