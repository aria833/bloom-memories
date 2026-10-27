# Bloom Memories — 全站翻譯稽核

## 本輪已完成

- 新增 `en-phrases-04.js` 至 `en-phrases-08.js` 與 `ja-phrases-04.js` 至 `ja-phrases-08.js`，補齊首頁、相冊製作、封面預覽、結帳、訂單、配送、帳戶空狀態、表單提示、錯誤與成功通知等介面文字。
- 更新 `src/js/locales/en.js`、`src/js/locales/ja.js`，將新增字典批次納入載入流程；繁體中文字典也補上相對應的來源字串。
- 擴充 `localizeHTML()`：將一般 HTML 文字節點中的模板縮排正規化後再比對字典，減少換行／縮排導致整句無法翻譯的情況；保留編輯中的明信片文字換行。
- 在 `index.html` 補上品牌副標題、導覽列、幣別、購物袋與偏好設定的 `data-i18n`／`data-i18n-attr`。
- 動態產生的頁面仍會透過 `localizeHTML()` 將字典中可辨識的文字包成帶有 `data-i18n` 的元素；表單 placeholder、title、alt 與 aria-label 也會在字典有對應項目時套用翻譯。
- 補上首頁英文眉標、裝飾按鈕無障礙標籤、商品詳情按鈕標籤，以及明信片頁碼和製作進度的英文／日文格式。
- 將明信片 `place`、`continent`、`region`、`method` 的翻譯集中在 `public/js/chunks/postcard-translations.js`，並在 `01-data.js` 前載入，避免同一份地點字典重複維護。
- 帳戶與草稿頁面的日期格式依目前語言顯示。

## 程式檢查

- 已用 `node --check` 檢查 `public/js/chunks/*.js`、`src/js/*.js`、`src/js/locales/*.js`，語法檢查通過。
- 已用 Node.js 比對三個語系的字典鍵，英文與日文對目前字典鍵的覆蓋率皆為 100%。
- Vite production build 尚未完成：目前環境的依賴目錄不完整，執行 `npm ci` 時逾時，因此未能完成正式建置或瀏覽器實際畫面驗收。

## 仍建議人工確認

- 在瀏覽器逐頁切換繁中／英文／日文，尤其是相冊編輯、結帳、訂單、FAQ、配送、隱私權政策與表單通知。
- 確認已存在於瀏覽器 `localStorage` 的舊草稿內容。使用者自行輸入的相冊名稱、回憶文字與地址不應被自動翻譯；新建草稿的預設標題則會依語言顯示。
- 確認所有明信片圖片與商品圖片載入正常，並以手機、平板和桌面寬度完成 RWD 實際驗收。
