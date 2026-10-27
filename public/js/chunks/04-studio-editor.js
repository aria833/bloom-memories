function renderEditor() {
  const selected = getSelectedPostcards();
  if (!selected.length) return renderSelection();

  state.editorIndex = Math.min(state.editorIndex, selected.length - 1);

  const card = selected[state.editorIndex];
  const layout = card.layout || state.currentLayout;
  const isOriginalLayout = layout === "original";

  const decorationPicker = `
    <div class="decoration-section">
      <p class="fw-bold">選擇裝飾</p>

      <div class="decor-picker" aria-label="選擇裝飾">
        ${decorationOptions
          .map(
            (option) => `
              <button
                type="button"
                class="decor-button ${
                  state.selectedDecoration === option.id ? "active" : ""
                }"
                data-decoration="${option.id}"
                aria-label="${t("加入裝飾")} ${t(option.label)}"
                title="${t(option.label)}"
              >
                <img
                  src="${option.image}"
                  alt=""
                  class="decor-button__image"
                >
              </button>
            `,
          )
          .join("")}
      </div>

      <div class="d-flex align-items-center justify-content-between gap-2 mt-2">
        <span class="small text-secondary">
          已放置 ${(card.decorations || []).length} / 8 個
        </span>

        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          data-clear-decorations
        >
          清除全部
        </button>
      </div>

      <div class="small text-secondary mt-2">
        點選素材加入明信片。拖曳裝飾可調整位置，選取後拖曳右下角控制點可調整大小。每頁最多 8 個。
      </div>
    </div>
  `;

  return studioShell(
    `
      <section class="surface studio-content">

        <div class="studio-heading">
          <div>
            <h2>編輯內容</h2>
            <p>保留原始明信片，加入一段文字、日期或少量裝飾，記錄當時的回憶。</p>
          </div>

          <span class="badge text-bg-light border">
            ${state.editorIndex + 1} / ${selected.length}
          </span>
        </div>

        <div class="editor-layout mb-2">

          <!-- 左側：選擇版型 -->
          <aside class="editor-panel layout-panel ">
            <h3>選擇版型</h3>

            <button
              class="layout-option ${layout === "original" ? "active" : ""}"
              data-layout="original"
            >
              <div class="layout-thumb">
                <i class="bi bi-image"></i>
              </div>
              <span>原始明信片</span>
            </button>

            <button
              class="layout-option ${layout === "memory" ? "active" : ""}"
              data-layout="memory"
            >
              <div class="layout-thumb">
                <i class="bi bi-journal-text"></i>
              </div>
              <span>回憶文字</span>
            </button>
          </aside>

          <!-- 中間：明信片預覽 -->
          <div class="editor-preview-column">

            <div class="editor-canvas-wrap">
              <div
                class="editor-canvas postcard-landscape layout-${layout}"
                id="activePostcardCanvas"
              >
                <div class="original-postcard-image postcard-fullbleed-image">
                  ${sceneHTML(card)}
                </div>

                <div class="original-postcard-writing postcard-message-overlay">
                  <div class="postcard-message-location">
                    ${escapeHTML(getPostcardFieldText(card, "place") || "旅行回憶")}
                  </div>

                  <span class="date-label ${card.includeDate ? "" : "d-none"}">
                    ${escapeHTML(card.date || "")}
                  </span>

                  <div class="editor-note">${escapeHTML((getPostcardNoteText(card) || "").trim())}</div>
                </div>

                ${decorationHTML(card)}
              </div>
            </div>

            <div class="editor-bottom">
              <span>預覽示意 · 印刷安全範圍將於後續規格確認</span>

              <div class="d-flex gap-2">
                <button
                  class="btn btn-sm btn-outline-primary"
                  id="previousCard"
                  ${state.editorIndex === 0 ? "disabled" : ""}
                >
                  <i class="bi bi-arrow-left"></i>
                </button>

                <button
                  class="btn btn-sm btn-outline-primary"
                  id="nextCard"
                  ${state.editorIndex >= selected.length - 1 ? "disabled" : ""}
                >
                  <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>

          </div>

          <!-- 右側：個人化內容 -->
          <aside class="editor-panel options-panel">

            <h3>個人化內容</h3>

            ${
              isOriginalLayout
                ? `
                  <div class="alert alert-light border small">
                    原始明信片版型不提供回憶文字。
                  </div>
                `
                : `
                  <div class="personalization-field">
                    <label class="field-label" for="postcardText">
                      回憶文字
                    </label>

                    <textarea
                      class="form-control"
                      rows="4"
                      maxlength="120"
                      id="postcardText"
                      placeholder="寫下一小段回憶…"
                    >${escapeHTML((getPostcardNoteText(card) || "").trim())}</textarea>

                    <div class="small text-secondary mt-1">
                      最多 120 字
                    </div>
                  </div>
                `
            }

            <div class="personalization-field">
              <label class="field-label" for="includeDate">
                日期標籤
              </label>

              ${
                isOriginalLayout
                  ? `
                    <p class="small text-secondary mb-0">
                      原始明信片版型不提供日期標籤設定。
                    </p>
                  `
                  : `
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="includeDate"
                        ${card.includeDate ? "checked" : ""}
                      >

                      <label
                        class="form-check-label small"
                        for="includeDate"
                      >
                        顯示取得日期
                      </label>
                    </div>

                    <div class="small text-secondary mt-2">
                      ${escapeHTML(card.date)}
                    </div>
                  `
              }
            </div>

          </aside>

        </div>

        <!-- 下方：裝飾素材 -->
        ${
          isOriginalLayout
            ? `
              <div class="decoration-section mt-4">
                <p class="fw-bold">選擇裝飾</p>
                <p class="small text-secondary mb-0">
                  原始明信片版型不提供裝飾功能。
                </p>
              </div>
            `
            : decorationPicker
        }

        <!-- 底部操作 -->
        <div class="d-flex justify-content-between gap-3 mt-4">
          <button
            class="btn btn-outline-primary"
            data-studio-step="2"
          >
            <i class="bi bi-arrow-left me-1"></i>
            返回選取
          </button>

          <button class="btn btn-primary" id="finishEditing">
            頁面排序
            <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>

      </section>
    `,
  );
}
