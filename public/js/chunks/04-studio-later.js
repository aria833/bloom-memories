function renderArrange() {
  const selected = getSelectedPostcards();
  return studioShell(
    `<section class="surface studio-content"><div class="studio-heading"><div><h2>編排頁面</h2><p>拖曳明信片調整閱讀順序，系統會自動套用相冊版面。這裡不需要手動排版。</p></div><span class="badge text-bg-light border">${selected.length} 張明信片</span></div><div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4"><p class="drag-hint mb-0"><i class="bi bi-arrows-move me-1"></i>可拖曳卡片重新排序，也可以使用左右箭頭調整。</p><button class="btn btn-sm btn-outline-primary" id="sortByDate"><i class="bi bi-sort-down me-1"></i>依取得日期排序</button></div><div class="page-thumbnails" id="sortablePages">${selected.map((card, index) => `<div class="page-thumb" draggable="true" data-page-id="${card.id}">${sceneHTML(card)}<div class="thumb-caption"><span>${formatPageLabel(index + 1)}</span><span class="d-flex gap-1"><button class="btn btn-sm p-0 px-1" data-move="left" data-id="${card.id}" aria-label="向前移動" ${index === 0 ? "disabled" : ""}><i class="bi bi-arrow-left"></i></button><button class="btn btn-sm p-0 px-1" data-move="right" data-id="${card.id}" aria-label="向後移動" ${index === selected.length - 1 ? "disabled" : ""}><i class="bi bi-arrow-right"></i></button></span></div><div class="small text-secondary mt-1">${escapeHTML(getPostcardFieldText(card, "place"))}</div></div>`).join("")}</div><div class="alert alert-light border mt-4 mb-0 small"><i class="bi bi-magic me-2"></i>相冊會依選定的單一規格自動安排頁面。此步驟只負責調整明信片順序。</div><div class="d-flex justify-content-between gap-3 mt-4"><button class="btn btn-outline-primary" data-studio-step="3"><i class="bi bi-arrow-left me-1"></i>返回編輯</button><button class="btn btn-primary" data-studio-step="5">設計封面 <i class="bi bi-arrow-right ms-1"></i></button></div></section>`,
  );
}

function renderCover() {
  const draft = currentDraft();

  // 三款封面設定
  // 圖片路徑目前為暫定值，之後只需要修改這裡
  const styles = [
    {
      id: "botanical",
      name: "植物觀察",
      swatch: "#dce6d2",
      frontImage: "/images/bloom-memories/covers/botanical-front.jpg",
      backImage: "/images/bloom-memories/covers/botanical-back.jpg",
    },
    {
      id: "orange",
      name: "旅途暖陽",
      swatch: "#f0d4bd",
      frontImage: "/images/bloom-memories/covers/orange-front.jpg",
      backImage: "/images/bloom-memories/covers/orange-back.jpg",
    },
    {
      id: "blue",
      name: "海岸微風",
      swatch: "#d7e5e7",
      frontImage: "/images/bloom-memories/covers/blue-front.jpg",
      backImage: "/images/bloom-memories/covers/blue-back.jpg",
    },
  ];

  // 取得目前選擇的封面
  const selectedStyle =
    styles.find((style) => style.id === state.coverStyle) || styles[0];

  // 取得目前相冊中的明信片
  // 依照草稿儲存的順序，取出第一張明信片
  const postcardIds = draft?.postcardIds || [];

  const firstPostcard = postcardIds.length
    ? postcards.find((postcard) => postcard.id === postcardIds[0])
    : null;

  // 第一張明信片的圖片
  const postcardImage = firstPostcard?.image || "";

  return studioShell(`
    <section class="surface studio-content">

      <!-- 頁面標題 -->
      <div class="studio-heading">
        <div>
          <h2>設計封面</h2>
          <p>
            為整本相冊選擇封面樣式與標題。
            內頁已經排好，現在替這段回憶選一個封面。
          </p>
        </div>
      </div>

      <div class="cover-layout">

        <!-- 左側：封面樣式選擇 -->
        <div class="cover-options">
          <h3 class="field-label">封面樣式</h3>

          ${styles
            .map(
              (style) => `
                <button
                  class="cover-choice ${
                    state.coverStyle === style.id ? "active" : ""
                  }"
                  type="button"
                  data-cover-style="${style.id}"
                  aria-pressed="${state.coverStyle === style.id}"
                >
                  <span
                    class="cover-swatch"
                    style="background:${style.swatch}"
                  ></span>

                  <span class="small fw-semibold">
                    ${style.name}
                  </span>

                  ${
                    state.coverStyle === style.id
                      ? '<i class="bi bi-check-circle-fill ms-auto text-success"></i>'
                      : ""
                  }
                </button>
              `,
            )
            .join("")}
        </div>

        <!-- 中間：封面預覽 -->
        <div class="cover-preview-area">

          <div class="cover-preview-label small text-secondary mb-3">
            封面預覽
          </div>

          <div
            class="cover-book cover-${selectedStyle.id}"
            style="
              background-image: url('${selectedStyle.frontImage}');
            "
          >

            <!-- 疊在封面背景上的第一張明信片 -->
            ${
              postcardImage
                ? `
                  <img
                    class="cover-book__postcard"
                    src="${postcardImage}"
                    alt="${escapeHTML(getPostcardFieldText(firstPostcard, "place") || "相冊明信片")}"
                  >
                `
                : `
                  <div class="cover-book__empty">
                    <i class="bi bi-image"></i>
                    <span>尚未選擇明信片</span>
                  </div>
                `
            }

            <!-- 封面標題與副標題 -->
            <div class="cover-book__copy">
              <h3 id="coverPreviewTitle">
                ${escapeHTML(state.coverTitle)}
              </h3>

              <p id="coverPreviewSubtitle">
                ${escapeHTML(state.coverSubtitle || "")}
              </p>
            </div>

          </div>

          <p class="small text-secondary mt-3 mb-0">
            預覽會使用目前相冊中的第一張明信片。
          </p>
        </div>

        <!-- 右側：封面與版權頁設定 -->
        <div>

          <h3 class="h6 fw-bold mb-3">封面文字</h3>

          <label class="field-label" for="coverTitle">
            相冊封面標題
          </label>

          <input
            class="form-control mb-3"
            id="coverTitle"
            maxlength="36"
            value="${escapeHTML(state.coverTitle)}"
          >

          <label class="field-label" for="coverSubtitle">
            相冊封面副標題
          </label>

          <input
            class="form-control"
            id="coverSubtitle"
            maxlength="60"
            value="${escapeHTML(state.coverSubtitle || "")}"
          >

          <p class="small text-secondary mt-2">
            封面標題與副標題會即時更新預覽。
          </p>

          <hr class="my-4">

          <h3 class="h6 fw-bold">版權頁資訊</h3>

          <label class="field-label mt-2" for="authorName">
            作者／製作人（選填）
          </label>

          <input
            class="form-control mb-3"
            id="authorName"
            maxlength="48"
            value="${escapeHTML(state.authorName || "")}"
            placeholder="例如：與同行的朋友"
          >

          <label class="field-label" for="completedDate">
            完稿日期
          </label>

          <input
            class="form-control mb-3"
            type="date"
            id="completedDate"
            value="${escapeHTML(state.completedDate || "")}"
          >

          <label class="field-label" for="printDate">
            送印日期（選填）
          </label>

          <input
            class="form-control mb-3"
            type="date"
            id="printDate"
            value="${escapeHTML(state.printDate || "")}"
          >

          <div class="alert alert-light border small mt-3">
            版權頁會列出作者、完稿日期、送印日期、
            Bloom Memories 概念原型聲明，以及「非官方概念作品」標示。
          </div>

        </div>
      </div>

      <!-- 步驟導覽 -->
      <div class="d-flex justify-content-between gap-3 mt-4">

        <button
          class="btn btn-outline-primary"
          type="button"
          data-studio-step="4"
        >
          <i class="bi bi-arrow-left me-1"></i>
          返回編排
        </button>

        <button
          class="btn btn-primary"
          type="button"
          data-studio-step="6"
        >
          預覽整本相冊
          <i class="bi bi-arrow-right ms-1"></i>
        </button>

      </div>

    </section>
  `);
}

function renderPreview() {
  const selected = getSelectedPostcards();
  const draft = currentDraft();

  const totalSpreads = selected.length + 3;

  const spreadIndex = Math.max(
    0,
    Math.min(state.previewIndex || 0, totalSpreads - 1),
  );

  const pageTurnClass =
    state.previewDirection === "forward"
      ? "book-page-turn-forward"
      : state.previewDirection === "backward"
        ? "book-page-turn-backward"
        : "";

  // 三款封面設定，與設計封面頁使用相同圖片路徑
  const coverStyles = {
    botanical: {
      frontImage: "/images/bloom-memories/covers/botanical-front.jpg",
      backImage: "/images/bloom-memories/covers/botanical-back.jpg",
    },
    orange: {
      frontImage: "/images/bloom-memories/covers/orange-front.jpg",
      backImage: "/images/bloom-memories/covers/orange-back.jpg",
    },
    blue: {
      frontImage: "/images/bloom-memories/covers/blue-front.jpg",
      backImage: "/images/bloom-memories/covers/blue-back.jpg",
    },
  };

  const cover = coverStyles[state.coverStyle] || coverStyles.botanical;

  // 產生封面與封底
  const coverPage = (isBack = false) => {
    const backgroundImage = isBack ? cover.backImage : cover.frontImage;

    // 封面使用第一張明信片，封底不疊加明信片
    const firstPostcard = selected[0];

    return `
      <div
        class="book-page cover-page ${isBack ? "back-cover" : ""} ${
          !isBack ? `cover-${state.coverStyle}` : ""
        } preview-closed-cover"
        style="background-image: url('${backgroundImage}')"
      >

        ${
          !isBack && firstPostcard
            ? `
              <img
                class="cover-book__postcard"
                src="${firstPostcard.image || ""}"
                alt="${escapeHTML(getPostcardFieldText(firstPostcard, "place") || "相冊明信片")}"
              >
            `
            : ""
        }

        <div class="cover-book__copy">
          <span class="book-end-label">
            ${isBack ? "封底" : "封面"}
          </span>

          ${
            !isBack
              ? `
                <h3>${escapeHTML(state.coverTitle)}</h3>
                <p>${escapeHTML(state.coverSubtitle || "")}</p>
              `
              : `
                <small>Bloom Memories</small>
              `
          }
        </div>
      </div>
    `;
  };

  // ========================================
  // 預覽相冊：明信片版型
  // 與編輯畫布共用文字結構
  // ========================================
  const postcardPanel = (card) => {
    if (!card) return "";

    const title = getPostcardFieldText(card, "place") || "旅行回憶";
    const date = card.includeDate ? card.date : "";
    const copy = (getPostcardNoteText(card) || "").trim();

    return `
    <div class="printed-postcard postcard-landscape">
      <div class="postcard-fullbleed-image">
        ${sceneHTML(card)}
      </div>

      <div class="postcard-message-overlay">
        <div class="postcard-message-location">
          ${escapeHTML(title)}
        </div>

        <span class="date-label ${date ? "" : "d-none"}">
          ${escapeHTML(date || "")}
        </span>

        <div class="editor-note">${escapeHTML(copy)}</div>
      </div>

      ${decorationHTML(card, { interactive: false })}
    </div>
  `;
  };
  let spread = "";

  // 第一頁：封面
  if (spreadIndex === 0) {
    spread = coverPage(false);
  }

  // 最後一頁：封底
  else if (spreadIndex === totalSpreads - 1) {
    spread = coverPage(true);
  }

  // 倒數第二頁：版權頁
  else if (spreadIndex === totalSpreads - 2) {
    spread = `
版權頁

    <div class="copyright-page-content">
      <span class="copyright-mark">✿</span>
      <h3 data-i18n="${escapeHTML(state.coverTitle)}">${escapeHTML(state.coverTitle)}</h3>
      <dl>
        <dt data-i18n="作者／製作人">作者／製作人</dt>
        <dd>
          <span data-i18n="作者：">作者：</span>
          ${escapeHTML(state.authorName || "未填寫")}
        </dd>
        <dt data-i18n="完稿日期">完稿日期</dt>
        <dd>${escapeHTML(state.completedDate || "未填寫")}</dd>
        <dt data-i18n="送印日期">送印日期</dt>
        <dd>${escapeHTML(state.printDate || "尚未設定")}</dd>
      </dl>
      <small>
        © ${new Date().getFullYear()} Bloom Memories Concept
        · All rights reserved to their respective owners.
      </small>
    </div>
  </div>
`;
  }

  // 明信片內頁
  else {
    spread = `
      <div class="book-page inner-page single-postcard-page">
        ${postcardPanel(selected[spreadIndex - 1])}
      </div>
    `;
  }

  return studioShell(`
    <section class="surface studio-content">

      <div class="studio-heading">
        <div>
          <h2>預覽整本相冊</h2>
          <p>
            從封面開始逐頁翻閱，每個內頁只呈現一張橫式明信片，
            最後到達版權頁與封底。
          </p>
        </div>
      </div>

      <div class="preview-layout">

        <div>
          <div class="book-preview-stage">

            <div
              class="open-book ${
                spreadIndex === 0 || spreadIndex === totalSpreads - 1
                  ? "end-spread"
                  : ""
              } ${pageTurnClass}"
              data-page-turn
            >
              ${spread}
            </div>

            <div class="preview-controls">

              <button
                class="btn btn-sm btn-outline-primary"
                id="previewPrevious"
                ${spreadIndex === 0 ? "disabled" : ""}
                aria-label="上一頁"
              >
                <i class="bi bi-arrow-left"></i>
              </button>

              <span>${spreadIndex + 1} / ${totalSpreads} 頁</span>

              <button
                class="btn btn-sm btn-outline-primary"
                id="previewNext"
                ${spreadIndex >= totalSpreads - 1 ? "disabled" : ""}
                aria-label="下一頁"
              >
                <i class="bi bi-arrow-right"></i>
              </button>

            </div>
          </div>

          <div class="preview-page-strip">
            ${Array.from(
              { length: totalSpreads },
              (_, i) => `
                <button
                  class="btn btn-sm ${
                    i === spreadIndex ? "btn-primary" : "btn-outline-primary"
                  }"
                  data-preview-index="${i}"
                >
                  ${
                    i === 0
                      ? "封面"
                      : i === totalSpreads - 1
                        ? "封底"
                        : i === totalSpreads - 2
                          ? "版權頁"
                          : formatPageLabel(i)
                  }
                </button>
              `,
            ).join("")}
          </div>
        </div>

        <aside class="surface preview-summary">

          <h3>印刷規格與訂單摘要</h3>

          <div class="summary-row">
            <span>相冊名稱</span>
            <strong>${escapeHTML(draft?.title || state.coverTitle)}</strong>
          </div>

          <div class="summary-row">
            <span>印刷尺寸</span>
            <strong>單一規格</strong>
          </div>

          <div class="summary-row">
            <span>裝訂方式</span>
            <strong>固定裝訂</strong>
          </div>

          <div class="summary-row">
            <span>明信片數量</span>
            <strong>${selected.length} / ${MAX_POSTCARDS}</strong>
          </div>

          <div class="summary-row">
            <span>印刷本數</span>

            <div class="qty-control">
              <button
                data-album-qty="-1"
                aria-label="減少印刷本數"
                ${state.albumPrintQty <= 1 ? "disabled" : ""}
              >−</button>

              <span>${state.albumPrintQty}</span>

              <button
                data-album-qty="1"
                aria-label="增加印刷本數"
                ${state.albumPrintQty >= 20 ? "disabled" : ""}
              >+</button>
            </div>
          </div>

          <div class="summary-row">
            <span>相冊價格</span>
            <strong>${money(2800 * state.albumPrintQty)}</strong>
          </div>

          <div class="print-note">
            <i class="bi bi-info-circle me-1"></i>
            價格與印刷規格為原型示意資料，尚未代表實際供應商報價。
          </div>

          <div class="summary-row total">
            <span>小計</span>
            <strong>${money(2800 * state.albumPrintQty)}</strong>
          </div>

        </aside>
      </div>

      <div class="d-flex justify-content-between gap-3 mt-4">

        <button
          class="btn btn-outline-primary"
          data-studio-step="5"
        >
          <i class="bi bi-arrow-left me-1"></i>
          返回封面
        </button>

        <button
          class="btn btn-primary"
          id="goConfirmPrintBottom"
        >
          下一步：確認印刷
          <i class="bi bi-arrow-right ms-1"></i>
        </button>

      </div>

    </section>
  `);
}

function renderPrintConfirm() {
  const selected = getSelectedPostcards();
  const draft = currentDraft();
  const addOns = products.filter((product) => product.type === "add-on");
  const wishlistItems = products.filter(
    (product) =>
      state.wishlist.includes(product.id) && product.type === "general",
  );
  const addOnTotal = state.addOnIds.reduce(
    (sum, id) =>
      sum + (products.find((product) => product.id === id)?.price || 0),
    0,
  );
  const wishlistTotal = state.cart.reduce(
    (sum, item) =>
      sum +
      (products.find((product) => product.id === item.id)?.price || 0) *
        item.qty,
    0,
  );
  const albumTotal =
    2800 * state.albumPrintQty +
    addOnTotal +
    wishlistTotal +
    (state.gift && state.giftWrap ? 300 : 0) +
    (state.gift && state.ribbon ? 100 : 0);
  return studioShell(
    `<section class="surface studio-content print-confirm-page"><div class="studio-heading"><div><span class="eyebrow">FINAL CHECK</span><h2>確認印刷設定</h2><p>送出前再次確認相冊內容、印刷本數與加購商品。所有價格皆為概念原型示意。</p></div></div><div class="print-confirm-grid"><div class="print-confirm-main"><section class="surface p-3 p-md-4 mb-4"><h3 class="h5">相冊摘要</h3><div class="summary-row"><span>相冊名稱</span><strong>${escapeHTML(draft?.title || state.coverTitle)}</strong></div><div class="summary-row"><span>明信片</span><strong>${selected.length} 張</strong></div><div class="summary-row"><span>封面</span><strong>${escapeHTML(state.coverTitle)}</strong></div><div class="summary-row"><span>版權頁作者</span><strong>${escapeHTML(state.authorName || "未填寫")}</strong></div><button class="btn btn-outline-primary btn-sm mt-2" data-studio-step="6">返回預覽整本相冊</button></section><section class="surface p-3 p-md-4 mb-4"><h3 class="h5">印刷本數</h3><p class="small text-secondary">需要送給不同的人？可以一次印製多本。</p><div class="qty-control large"><button data-album-qty="-1" aria-label="減少印刷本數" ${state.albumPrintQty <= 1 ? "disabled" : ""}>−</button><span>${state.albumPrintQty}</span><button data-album-qty="1" aria-label="增加印刷本數" ${state.albumPrintQty >= 20 ? "disabled" : ""}>+</button></div><div class="small text-secondary mt-2">目前原型上限為 20 本。</div></section><section class="surface p-3 p-md-4 mb-4"><h3 class="h5">限定加購</h3><p class="small text-secondary">選擇性加購，不會預先勾選。</p><div class="row g-2">${addOns
      .map(
        (product) => `

  <div class="col-md-6">
    <label class="addon-option ${state.addOnIds.includes(product.id) ? "selected" : ""}">
      <input
        class="form-check-input me-2"
        type="checkbox"
        data-addon-select="${product.id}"
        ${state.addOnIds.includes(product.id) ? "checked" : ""}
      >
      <span class="flex-grow-1">
        <strong>${product.translations?.[state.language]?.name || product.name}</strong>
        <small class="d-block text-secondary">${money(product.price)}</small>
      </span>
    </label>
  </div>
`,
      )
      .join("")}</div></section>${
      wishlistItems.length
        ? `<section class="surface p-3 p-md-4 mb-4">
        <h3 class="h5">願望清單中的小物</h3>

        <p class="small text-secondary">
          可以調整數量，再將喜歡的小物加入本次訂單。
        </p>

        ${wishlistItems
          .map((product) => {
            const cartItem = state.cart.find((item) => item.id === product.id);

            return `
              <div class="wishlist-checkout-item py-3 border-bottom">
                <div class="d-flex justify-content-between gap-3">
                  <div>
                    <strong>${escapeHTML(getProductText(product, "name"))}</strong>
                    <div class="small text-secondary mt-1">
                      ${money(product.price)}
                    </div>
                  </div>

                  <label class="small">
                    數量
                    <input
                      class="form-control form-control-sm wishlist-quantity"
                      type="number"
                      min="1"
                      max="10"
                      value="${cartItem?.qty || 1}"
                      data-wishlist-qty="${product.id}"
                    >
                  </label>
                </div>

                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary mt-2"
                  data-add-wishlist-cart="${product.id}"
                >
                  ${cartItem ? "更新購物車數量" : "加入購物車"}
                </button>
              </div>
            `;
          })
          .join("")}
      </section>`
        : ""
    }</div><aside class="surface p-3 p-md-4 print-confirm-summary"><h3 class="h5">訂單摘要</h3><div class="summary-row"><span>相冊 × ${state.albumPrintQty} 本</span><strong>${money(2800 * state.albumPrintQty)}</strong></div>${state.addOnIds
      .map((id) => {
        const p = products.find((product) => product.id === id);
        return p
          ? `<div class="summary-row"><span>${p.name}</span><strong>${money(p.price)}</strong></div>`
          : "";
      })
      .join("")}${state.cart
      .map((item) => {
        const p = products.find((product) => product.id === item.id);
        return p
          ? `<div class="summary-row"><span>${p.name} × ${item.qty}</span><strong>${money(p.price * item.qty)}</strong></div>`
          : "";
      })
      .join(
        "",
      )}<div class="summary-row total"><span>概念小計</span><strong>${money(albumTotal)}</strong></div><div class="alert alert-warning small mt-3"><i class="bi bi-exclamation-triangle me-1"></i>客製化商品進入製作流程後，原型假設不得取消；退換貨政策仍須依適用法規及正式服務條款確認。</div><button class="btn btn-primary w-100 mt-2" id="continueAlbumCheckout">前往結帳 <i class="bi bi-arrow-right ms-1"></i></button><button class="btn btn-outline-secondary w-100 mt-2" data-studio-step="5">返回設計封面</button></aside></div></section>`,
  );
}

function renderStudio() {
  if (!state.loggedIn) return renderAuth();
  const draft = currentDraft();
  if (!draft && state.step !== 1) {
    state.step = 1;
  }
  let content = "";
  if (state.step === 1) {
    content =
      draft || state.isCreatingDraft ? renderCreate() : renderDraftLanding();
  }
  if (state.step === 2) content = renderSelection();
  if (state.step === 3) content = renderEditor();
  if (state.step === 4) content = renderArrange();
  if (state.step === 5) content = renderCover();
  if (state.step === 6) content = renderPreview();
  if (state.step === 7) content = renderPrintConfirm();
  return content;
}
