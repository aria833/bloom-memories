function showcaseCoverHTML(album, isBackCover = false) {
  const image = isBackCover
    ? album.backCoverImage || album.backImage || album.coverImage || ""
    : album.coverImage || "";

  const altText = isBackCover ? "相冊封底" : "相冊封面";

  const coverClass = isBackCover ? "back-cover" : "front-cover";

  return `
    <div class="showcase-book-page showcase-closed-cover ${coverClass}">
      ${
        image
          ? `
            <img
              class="showcase-cover-image"
              src="${escapeHTML(image)}"
              alt="${altText}"
            >
          `
          : `
            <div class="showcase-cover-fallback">
              尚未設定${altText}圖片
            </div>
          `
      }
    </div>
  `;
}

// ========================================
// 產生版權頁 HTML
// ========================================

function showcaseCopyrightHTML(album) {
  return `
    <div class="showcase-book-page copyright-page">
      <div class="copyright-page-content">
        <span class="copyright-mark">✿</span>

        <h3>
          ${escapeHTML(album.coverTitle || album.title || "")}
        </h3>

        <p>
          作者：
          ${escapeHTML(album.authorName || "Aria")}
        </p>

        <p>
          ${escapeHTML(album.completedDate || "2026.10.20")}
        </p>

        <small>
          Bloom Memories Concept · © ${new Date().getFullYear()}
        </small>
      </div>
    </div>
  `;
}

// ========================================
// 更新相冊內容
// ========================================

function updateShowcaseModal() {
  const modal = document.querySelector("#showcaseModal");

  if (!modal || !state.activeShowcase) {
    console.warn("Showcase 尚未指定目前展示的相冊。");
    return;
  }

  const album = getActiveShowcaseAlbum();

  if (!album) {
    console.warn("找不到目前展示的相冊。");
    return;
  }

  const cards = getActiveShowcaseCards();
  const book = modal.querySelector("#showcaseBookPages");

  if (!book) {
    console.warn("找不到相冊展示容器 #showcaseBookPages。");
    return;
  }

  // ========================================
  // 計算頁面索引
  // ========================================

  const maxIndex = cards.length + 2;

  const idx = Math.max(
    0,
    Math.min(maxIndex, Number(state.albumShowcaseIndex) || 0),
  );

  state.albumShowcaseIndex = idx;

  const copyrightIndex = cards.length + 1;
  const backCoverIndex = cards.length + 2;
  const totalPages = cards.length + 3;

  // ========================================
  // 更新相冊標題
  // ========================================

  modal.querySelector("#showcaseModalTitle").textContent =
    getLocalizedShowcaseText(album, "title");

  modal.querySelector("#showcaseModalDesc").textContent =
    state.activeShowcase === "submitted"
      ? getLocalizedShowcaseText(
          {
            title: "",
            desc: "這是已提交相冊的完成品預覽示意。",
            translations: {
              en: {
                desc: "Preview of your submitted album.",
              },
              ja: {
                desc: "提出したアルバムの完成イメージです。",
              },
            },
          },
          "desc",
        )
      : getLocalizedShowcaseText(album, "desc");

  // ========================================
  // 產生目前頁面
  // ========================================

  let pageHTML = "";

  // 第 1 頁：封面
  if (idx === 0) {
    pageHTML = showcaseCoverHTML(album);
  }

  // 第 2 頁起：明信片
  else if (idx >= 1 && idx <= cards.length) {
    const card = cards[idx - 1];

    pageHTML = `
      <div class="showcase-book-page showcase-single-page">
        ${showcasePostcardHTML(card, idx - 1)}
      </div>
    `;
  }

  // 版權頁
  else if (idx === copyrightIndex) {
    pageHTML = showcaseCopyrightHTML(album);
  }

  // 最後一頁：封底
  else if (idx === backCoverIndex) {
    pageHTML = showcaseCoverHTML(album, true);
  }

  // 更新畫面
  book.innerHTML = pageHTML;

  // ========================================
  // 更新頁碼
  // ========================================

  const pageLabel = modal.querySelector("#showcasePageLabel");

  if (pageLabel) {
    const currentPage = idx + 1;

    pageLabel.textContent = `${currentPage}/${totalPages}`;
  }

  // ========================================
  // 翻頁動畫
  // ========================================

  const page = book.querySelector(".showcase-book-page");

  if (page) {
    page.classList.remove(
      "page-turn-in",
      "book-page-turn-forward",
      "book-page-turn-backward",
    );

    if (state.showcaseTurnDirection !== "none") {
      void page.offsetWidth;

      page.classList.add(
        state.showcaseTurnDirection === "backward"
          ? "book-page-turn-backward"
          : "book-page-turn-forward",
      );
    }
  }

  // ========================================
  // 更新翻頁按鈕
  // ========================================

  const prevButton = modal.querySelector("#showcasePrev");
  const nextButton = modal.querySelector("#showcaseNext");

  if (prevButton) {
    prevButton.disabled = idx === 0;
  }

  if (nextButton) {
    nextButton.disabled = idx === backCoverIndex;
  }

  // ========================================
  // 重設展示區高度
  // ========================================

  const stage = modal.querySelector(".showcase-book-stage");

  if (stage) {
    stage.style.height = "auto";
  }
}

// ========================================
// 鍵盤操作
// 左右方向鍵翻頁，Escape 關閉
// ========================================

document.addEventListener("keydown", (event) => {
  const modal = document.querySelector("#showcaseModal.show");

  if (!modal) {
    return;
  }

  if (event.key === "Escape") {
    closeShowcaseModal();
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    turnShowcasePage(1);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    turnShowcasePage(-1);
  }
});

// ========================================
// 初始化
// ========================================

validateShowcaseAlbums();

loadLocal();
setLocale(state.language);
setCurrency(state.currency);
render();
