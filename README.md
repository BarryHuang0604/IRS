# IRS 2.0 — Intelligent Rehabilitation Slider

智慧手部復健車 **模擬展示網站**，延續原版 GitHub Pages 專題的首頁、開始復健、復健紀錄三個頁面。

## 已完成
- 響應式繁體中文首頁與系統狀態總覽
- 原版 5 秒倒數、8 顆 LED 狀態動畫（模擬）
- 目標次數、模擬速度、暫停、繼續、結束與完成率
- localStorage 模擬訓練紀錄、操作事件、統計圖表、CSV 匯出、資料清除
- 明確的 DEMO 標示，不會發送任何實體設備指令
- `legacy/` 保留原始程式碼供比對，包括 Arduino Cloud 讀取雛形與 Google Apps Script 紀錄頁

## 部署到 GitHub Pages
1. **先備份原始儲存庫**，避免覆蓋原本程式。
2. 將此資料夾中的 `index.html`、`start.html`、`record.html`、`style.css`、`app.js`、`training.js`、`records.js`、`README.md` 及 `legacy/` 上傳到 `IRS` 儲存庫的根目錄（取代同名檔案）。
3. 在儲存庫 Settings → Pages 中，選擇 Deploy from a branch，branch `main`、資料夾 `/ (root)`，儲存。
4. 開啟 `https://barryhuang0604.github.io/IRS/index.html`。
5. 測試：開始訓練 → 完成/結束 → 查看紀錄 → 匯出 CSV。

也可以直接在本機啟動簡易 HTTP 伺服器：`python3 -m http.server 8000`，開啟 `http://localhost:8000`。

## 安全與限制
- **這是模擬系統**，不是醫療設備或遠端控制介面，不能用於真實病患操作。
- 所有訓練數值皆為前端產生的模擬數值，並非 ESP32 感測結果。
- localStorage 只適合非敏感示範資料，並非受保護的醫療資料庫；不同瀏覽器/裝置不會同步。
- 沒有登入系統、雲端後端、設備驗證或真正的 TLS 設備通訊；GitHub Pages 的 HTTPS 僅保護網站內容傳輸。
- **不要**將 Arduino Cloud Access Token、API 金鑰或病患個資寫入公開前端程式。
- 舊版 `legacy/record-original.html` 包含舊的 Google Apps Script URL，若該服務仍在運作，應確認權限並考慮撤銷公開存取。若不希望舊版公開，部署時不要上傳 `legacy/`。
- 將來串接 ESP32，應先設計具認證的後端、授權控管與獨立於網站的實體緊急停止機制，並進行硬體安全測試。

## 技術
HTML、CSS、JavaScript、localStorage、GitHub Pages。無外部函式庫依賴。
