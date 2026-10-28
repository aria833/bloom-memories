function getLocalizedShowcaseText(item, key) {
  if (!item) return "";

  const language = state.language || "zh-Hant";
  const translations = item.translations || {};

  // 依序嘗試完整語系、底線格式與語系代碼。
  const localized =
    translations[language] ||
    translations[language.replace("-", "_")] ||
    translations[language.split("-")[0]] ||
    {};

  // 優先使用目前語系的翻譯，沒有翻譯時使用原始文字。
  return localized[key] || item[key] || "";
}
// ========================================
// 取得 Showcase 明信片目前語系的文字
// 直接讀取明信片內的 translations
// ========================================

function getShowcasePostcardText(card, key) {
  if (!card) {
    return "";
  }

  const language = state.language || "zh-Hant";

  // 取得目前語系的明信片翻譯
  const translated = card.translations?.[language]?.[key];

  if (translated) {
    return translated;
  }

  // 沒有翻譯時，回退至原始繁體中文資料
  return card[key] || "";
}

// ========================================
// 產生明信片 HTML
// ========================================

function showcasePostcardHTML(card, index) {
  // 明信片資料不存在時顯示提示
  if (!card) {
    return `
      <div class="showcase-postcard showcase-postcard-empty">
        <i class="bi bi-image"></i>
        <p>找不到這張明信片</p>
      </div>
    `;
  }

  // 依照目前語系取得地點名稱
  const title = getShowcasePostcardText(card, "place") || "旅行中的小地方";

  // 依照目前語系取得明信片文字
  const copy = (
    getShowcasePostcardText(card, "note") ||
    getShowcasePostcardText(card, "text") ||
    ""
  ).trim();

  // 取得日期
  const date = card.includeDate === false ? "" : card.date || "";

  // 裝飾貼紙
  const stickers = ["✿", "✦", "♡", "🌱"];
  const sticker = stickers[index % stickers.length];

  // 保留原本的圖片路徑，只處理必要的 HTML 跳脫
  const imageSrc = card.image ? escapeHTML(card.image) : "";

  const imageHTML = imageSrc
    ? `
      <img
        class="showcase-postcard-background"
        src="${imageSrc}"
        alt="${escapeHTML(title)}"
        loading="eager"
        onerror="this.dataset.failed='true'; console.error('明信片圖片載入失敗：', this.src);"
      >
    `
    : `
      <div class="showcase-postcard-background showcase-landscape landscape-one"></div>
    `;

  return `
    <div class="showcase-postcard showcase-postcard-fullbleed">
      ${imageHTML}

      <span
        class="showcase-sticker"
        aria-hidden="true"
      >${sticker}</span>

      <div class="showcase-caption">
        <strong>${escapeHTML(title)}</strong>

        ${date ? `<small>${escapeHTML(date)}</small>` : ""}

        ${copy ? `<p>${escapeHTML(copy)}</p>` : ""}
      </div>
    </div>
  `;
}

// ========================================
// 產生封面與封底 HTML
// ========================================
