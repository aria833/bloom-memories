function studioShell(content) {
  const draft = currentDraft();
  return `<section class="studio-shell page-container">
    <div class="container">
    <div class="studio-topbar"><div><h1>Album Studio</h1><div class="small text-secondary mt-1">${escapeHTML(draft?.title || t("相冊製作工作區"))}</div></div><div class="studio-topbar-actions"><span class="save-state" id="saveStatus"><i class="bi bi-check-circle-fill"></i> 已儲存</span><button class="btn btn-sm btn-outline-primary" data-route="account">儲存並離開</button></div></div>
    <div class="progress-wrap">${stepperHTML()}</div></div>
    ${content}
  </section>`;
}
function scrollToCurrentStep() {
  const container = document.querySelector(".progress-wrap");
  const currentStep = container?.querySelector(".stepper-item.active");

  if (!container || !currentStep) return;

  const containerWidth = container.clientWidth;
  const stepLeft = currentStep.offsetLeft;
  const stepWidth = currentStep.offsetWidth;

  const targetLeft = stepLeft - (containerWidth - stepWidth) / 2;

  const maxScroll = container.scrollWidth - containerWidth;

  container.scrollTo({
    left: Math.max(0, Math.min(targetLeft, maxScroll)),
    behavior: "smooth",
  });
}

function renderDraftLanding() {
  const drafts = state.drafts.filter((draft) => draft.status !== "submitted");
  return `<div class="page-container studio-landing"><section class="page-intro"><span class="eyebrow">ALBUM STUDIO</span><h1 class="mt-2">先從一本相冊開始</h1><p>選擇要繼續編輯的草稿，或建立一本新的相冊。</p></section><div class="draft-list">${drafts.map((draft) => `<article class="surface draft-card"><div class="product-image"><i class="bi bi-journal-richtext"></i></div><h3>${escapeHTML(draft.title)}</h3><p>上次修改：${new Date(draft.updatedAt).toLocaleDateString(state.language === "en" ? "en-US" : state.language === "ja" ? "ja-JP" : "zh-TW")} · ${(draft.postcardIds || []).length} 張明信片</p><button class="btn btn-primary w-100" data-resume-draft="${draft.id}">繼續編輯</button></article>`).join("")}</div><section class="surface create-new-draft">
  <div class="create-preview">
    <div class="mini-book">
      <i class="bi bi-plus-lg"></i>
    </div>
  </div>

  <div class="create-new-draft__content pe-3">
    <h2>建立新相冊</h2><p>每個帳戶最多保留 ${MAX_DRAFTS} 本未完成草稿。建立後才會進入明信片選取畫面。</p><label class="field-label" for="newAlbumName">相冊名稱</label><input class="form-control mb-3" id="newAlbumName" maxlength="48" placeholder="${t("例如：山形旅行紀念冊")}" value="${t("我的旅行相冊")}"><button class="btn btn-primary" id="startNewDraft" ${drafts.length >= MAX_DRAFTS ? "disabled" : ""}>建立新相冊 <i class="bi bi-arrow-right ms-1"></i></button></div></section></div>`;
}

function renderCreate() {
  return studioShell(
    `<section class="surface studio-content"><div class="studio-heading"><div><h2>建立你的相冊</h2><p>先為這本相冊取個名字。之後可以隨時修改，現在不需要決定封面或印刷細節。</p></div></div><div class="create-layout"><div><label class="field-label" for="albumName">相冊名稱</label><input class="form-control mb-4" id="albumName" maxlength="48" value="${escapeHTML(currentDraft()?.title || state.newDraftTitle || t("我的旅行相冊"))}" placeholder="${t("例如：春日散步紀錄")}"><div class="alert alert-light border small" role="note"><i class="bi bi-info-circle me-2"></i>第一版採用單一印刷規格，每本最多選取 ${MAX_POSTCARDS} 張明信片。這些規格是目前的原型假設。</div>
    <button class="btn btn-primary" id="createDraftContinue" type="button">建立草稿 <i class="bi bi-arrow-right ms-1"></i>
    </button>
    </div>
    <div class="create-preview"><div class="mini-book"><img
            class="brand-logo-image"
            src="/images/bloom-memories-mark.svg"
            alt=""
          /></i></div></div></div></section>`,
  );
}

function renderSelection() {
  const list = visiblePostcards();
  const count = state.selectedIds.length;
  const continents = [
    ...new Set(
      postcards
        .map((card) => card.continent || "亞洲")
        .filter((continent) => typeof continent === "string"),
    ),
  ];
  const regions = [...new Set(postcards.map((card) => card.region || "東亞"))];
  const locations = [...new Set(postcards.map((card) => card.place))];
  return studioShell(
    `<section class="surface studio-content"><div class="studio-heading"><div><h2>選取明信片</h2><p>從你的收藏中挑選想印成實體相冊的明信片。可以跨篩選條件選取，已選內容會保留。</p></div><span class="badge text-bg-light border">最多 ${MAX_POSTCARDS} </span></div><div class="selection-toolbar"><div class="filter-row"><button class="filter-chip ${state.filter === "all" ? "active" : ""}" data-filter="all">全部明信片</button><button class="filter-chip ${state.filter === "favorites" ? "active" : ""}" data-filter="favorites"><i class="bi bi-star-fill me-1"></i>收藏</button><select class="form-select form-select-sm" id="continentFilter"><option value="all">所有洲</option>${continents.map((loc) => `<option value="${loc}" ${state.locationContinent === loc ? "selected" : ""}>${escapeHTML(getPostcardFieldText({ continent: loc }, "continent"))}</option>`).join("")}</select><select class="form-select form-select-sm" id="regionFilter"><option value="all">所有地區</option>${regions.map((loc) => `<option value="${loc}" ${state.locationRegion === loc ? "selected" : ""}>${escapeHTML(getPostcardFieldText({ region: loc }, "region"))}</option>`).join("")}</select><select class="form-select form-select-sm"  id="locationFilter"><option value="all">所有地點</option>${locations
      .map((loc) => {
        const card = postcards.find((item) => item.place === loc);
        return `<option value="${loc}" ${state.locationFilter === loc ? "selected" : ""}>${escapeHTML(getPostcardFieldText(card, "place"))}</option>`;
      })
      .join(
        "",
      )}</select><select class="form-select form-select-sm"  id="dateFilter"><option value="all">所有日期</option><option value="2026" ${state.dateFilter === "2026" ? "selected" : ""}>2026</option><option value="2025" ${state.dateFilter === "2025" ? "selected" : ""}>2025</option></select><select class="form-select form-select-sm"  id="methodFilter"><option value="all">所有取得方式</option>${[...new Set(postcards.map((card) => card.method))].map((method) => `<option value="${method}" ${state.methodFilter === method ? "selected" : ""}>${escapeHTML(getPostcardFieldText({ method }, "method"))}</option>`).join("")}</select></div><span class="small text-secondary">預設依最新日期排序</span></div><div class="postcard-grid">${list.map(postcardCardHTML).join("")}</div>${list.length ? "" : `<div class="empty-state"><i class="bi bi-search"></i><h3>找不到符合條件的明信片</h3><p>試著清除篩選條件，看看其他收藏。</p><button class="btn btn-outline-primary" id="clearFilters">清除篩選</button></div>`}
    <div class="selection-footer">
  <div class="selection-footer__info">
    <strong>已選取 ${count} / ${MAX_POSTCARDS} </strong>
    <span class="ms-2">
      ${
        count === MAX_POSTCARDS
          ? "已達本冊上限"
          : `還可以選取 ${MAX_POSTCARDS - count} `
      }
    </span>
  </div>
<div class="selection-footer__actions">
  <button
    type="button"
    class="btn btn-outline-primary"
    id="backToCreateDraft"
  >
    <i class="bi bi-arrow-left" aria-hidden="true"></i>
    <span>返回草稿</span>
  </button>

  <button
    type="button"
    class="btn btn-primary text-white"
    id="continueSelection"
    ${count === 0 ? "disabled" : ""}
  >
    <span>編輯內容</span>
    <i class="bi bi-arrow-right" aria-hidden="true"></i>
  </button>
</div>
</div></section>`,
  );
}
