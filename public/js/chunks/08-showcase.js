/* ========================================
  showcase.js：範例相簿預覽

  功能：
  1. 顯示三本 Showcase 相冊
  2. 每本相冊依照自己的 postcardIds 取出明信片
  3. 支援封面、24 張明信片、版權頁與封底
  4. 支援已提交相冊預覽
  5. 支援按鈕與鍵盤翻頁
======================================== */

// ========================================
// 開啟相冊
// ========================================

function openShowcaseModal() {
  let modal = document.querySelector("#showcaseModal");

  // 第一次開啟時建立相冊視窗
  if (!modal) {
    modal = document.createElement("div");

    modal.id = "showcaseModal";
    modal.className = "showcase-overlay";

    modal.innerHTML = `
      <div
        class="showcase-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="showcaseModalTitle"
      >
        <button
          class="showcase-close"
          id="closeShowcase"
          aria-label="關閉"
        >
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="showcase-modal-header">
          <span class="eyebrow">ALBUM PREVIEW</span>
          <h2 id="showcaseModalTitle"></h2>
          <p id="showcaseModalDesc"></p>
        </div>

        <div class="showcase-book-stage">
          <div
            class="showcase-open-book"
            id="showcaseBookPages"
          ></div>
        </div>

        <div class="showcase-modal-controls">
          <button
            class="btn btn-outline-primary"
            data-showcase-turn="-1"
            id="showcasePrev"
          >
            <i class="bi bi-arrow-left"></i>
            <span data-i18n="上一頁">上一頁</span>
          </button>

          <span
            id="showcasePageLabel"
            aria-live="polite"
          ></span>

          <button
            class="btn btn-primary"
            data-showcase-turn="1"
            id="showcaseNext"
          >
            <span data-i18n="下一頁">下一頁</span>
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>

        <p class="showcase-disclaimer" data-i18n="成品畫面為概念示意，使用模擬明信片資料。">
          成品畫面為概念示意，使用模擬明信片資料。
        </p>
      </div>
    `;

    document.body.append(modal);

    // 點擊遮罩關閉相冊
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeShowcaseModal();
      }
    });

    // 點擊右上角關閉按鈕
    modal
      .querySelector("#closeShowcase")
      .addEventListener("click", closeShowcaseModal);

    // 上一頁、下一頁
    modal.querySelectorAll("[data-showcase-turn]").forEach((button) => {
      button.addEventListener("click", () => {
        turnShowcasePage(Number(button.dataset.showcaseTurn));
      });
    });
  }

  // 每次開啟都從封面開始
  state.albumShowcaseIndex = 0;
  state.showcaseTurnDirection = "none";

  modal.classList.add("show");
  document.body.classList.add("modal-open");

  updateShowcaseModal();
}

// ========================================
// 關閉相冊
// ========================================

function closeShowcaseModal() {
  const modal = document.querySelector("#showcaseModal");

  modal?.classList.remove("show");
  document.body.classList.remove("modal-open");
}

// ========================================
// 取得目前相冊資料
// ========================================

function getActiveShowcaseAlbum() {
  if (state.activeShowcase === "submitted" && state.submittedPreviewOrder) {
    return state.submittedPreviewOrder;
  }

  return showcaseAlbums[state.activeShowcase] || null;
}

// ========================================
// 取得目前相冊的明信片
// ========================================

function getActiveShowcaseCards() {
  const album = getActiveShowcaseAlbum();

  if (!album) {
    return [];
  }

  // 已提交相冊
  if (state.activeShowcase === "submitted" && state.submittedPreviewOrder) {
    return (album.postcardIds || [])
      .map((id) => postcards.find((postcard) => postcard.id === id))
      .filter(Boolean);
  }

  // 一般 Showcase 相冊
  return getShowcasePostcards(state.activeShowcase);
}

// ========================================
// 取得相冊最後一頁的索引
//
// 索引 0：封面
// 索引 1～N：明信片
// 索引 N + 1：版權頁
// 索引 N + 2：封底
// ========================================

function showcaseMaxIndex() {
  const cards = getActiveShowcaseCards();

  return cards.length + 2;
}

// ========================================
// 翻頁
// ========================================

function turnShowcasePage(direction) {
  const modal = document.querySelector("#showcaseModal");

  if (!modal?.classList.contains("show")) {
    return;
  }

  const maxIndex = showcaseMaxIndex();
  const currentIndex = state.albumShowcaseIndex || 0;
  const nextIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction));

  if (nextIndex === currentIndex) {
    return;
  }

  state.showcaseTurnDirection = direction > 0 ? "forward" : "backward";

  state.albumShowcaseIndex = nextIndex;

  updateShowcaseModal();
}

// ========================================
// 產生明信片 HTML
// ========================================

/**
 * 取得目前語系的相冊文字。
 * 支援 zh-Hant、zh-TW、en、ja 等語系格式。
 */
