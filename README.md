# CloudMeter US 儀表板

這是專為美國市場設計的「雲端水電表管理平台」前端互動式原型。本專案以單頁應用程式 (SPA) 的形式建立，能完整體驗客戶端與內部管理端的各種操作流程。

## 🌟 核心功能

### 客戶端功能 (Client Portal)
- **方案費用試算器**：輸入欲管理的水表及電表數量，即時獲取年度計費估算。
- **動態擴充表位 (Expand Meters)**：在合約期內隨時擴充管理表位數，系統將自動按照距離年度合約結束的比例推算應付金額。
- **付款與結帳流程模擬**：整合了 PayPal 線上刷卡與獨立付款模組，完成「訂閱中」付款流程並隨時追蹤交易紀錄。

### 管理端功能 (Admin Portal)
- **財務收益儀表板**：追蹤年度累積總收益 (YTD Revenue)、本月新增收益以及平均客單價 (Average Deal Size)。
- **客戶與訂閱狀態管理**：
  - 內建自訂過濾器：可透過狀態篩選客戶名單（如「全部」、「訂閱中」、「已逾期」）。
  - **客戶詳細資料檢視**：查詢特定企業的表位資源、訂閱模式、下期付款日推算，並且具備點擊「一鍵寄送續約提醒 Email」的實用功能。

## 🛠 技術棧 (Tech Stack)

* **框架與建置**：[React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **樣式排版**：[Tailwind CSS](https://tailwindcss.com/)
* **圖示庫**：[Lucide React](https://lucide.dev/)

## 🚀 本地端執行指南 (Local Development)

若要在這台電腦上運行開發環境，請確認你已安裝 Node.js。

1. **安裝依賴套件**:
   ```bash
   npm install
   ```

2. **啟動開發伺服器**:
   ```bash
   npm run dev
   ```
   終端機會顯示一串網址（例如 `http://localhost:5173/`），請點擊打開您的瀏覽器以檢視網頁。

## ⚙️ 部署至 GitHub Pages

本專案支援一鍵部署至 GitHub Pages，自動建置 `dist` 並推送到 `gh-pages` 分支。

1. **基礎設定**:
   請先確認 `vite.config.js` 中的 `base` 參數已經指向你的 GitHub Repository 名稱。
   例如 Repository 為 `cloud-metering-pay`：
   ```javascript
   export default defineConfig({
     base: '/cloud-metering-pay/',
     plugins: [react(), tailwindcss()],
   })
   ```

2. **執行部署指令**:
   ```bash
   npm run deploy
   ```
   指令將會自動化執行 `npm run build` 打包資源，並透過 `gh-pages` 推送至專屬分支。

3. **網頁啟用**:
   記得回到 GitHub 專案的 `Settings > Pages` 將來源 (Source) 分支改為 `gh-pages`。

---
*此專案為概念性原型，未包含真實串接之資料庫操作，所有的交易狀態皆為前端狀態 (State) 變數模擬。*
