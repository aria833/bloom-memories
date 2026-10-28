function createDraft() {
  if (!state.loggedIn) return requireLogin("create");
  if (
    state.drafts.filter((draft) => draft.status !== "submitted").length >=
    MAX_DRAFTS
  ) {
    toast(
      `每位使用者最多可保留 ${MAX_DRAFTS} 本未完成草稿。請先繼續編輯或刪除一本草稿。`,
      "草稿數量已達上限",
    );
    state.route = "account";
    state.accountTab = "drafts";
    return render();
  }
  const id = `draft-${Date.now()}`;
  const title =
    document.querySelector("#newAlbumName")?.value.trim() || t("我的旅行相冊");
  const draft = {
    id,
    title,
    postcardIds: [],
    coverStyle: "botanical",
    coverTitle: title,
    coverSubtitle: t("把旅途中的小小發現收藏起來"),
    lastStep: 2,
    updatedAt: new Date().toISOString(),
  };
  state.drafts.unshift(draft);
  state.currentDraftId = id;
  state.selectedIds = [];
  state.coverStyle = draft.coverStyle;
  state.coverTitle = draft.coverTitle;
  state.coverSubtitle = draft.coverSubtitle || "";
  state.authorName = "";
  state.completedDate = new Date().toISOString().slice(0, 10);
  state.printDate = "";
  state.step = 2;
  state.route = "studio";
  syncDraft();
  render();
}

function getSelectedPostcards() {
  const draft = currentDraft();
  const ids = draft?.postcardIds || state.selectedIds;
  return ids
    .map((id) => postcards.find((card) => card.id === id))
    .filter(Boolean);
}

function getPostcardById(id) {
  return postcards.find((card) => card.id === id);
}

/** Show each postcard's translated sample note until the user edits it. */
function getPostcardNoteText(card) {
  if (!card) return "";

  const language = state?.language || "zh-Hant";
  const originalNote = card.note || "";
  const currentText = card.text ?? originalNote;

  if (language !== "zh-Hant" && currentText === originalNote) {
    return card.translations?.[language]?.note || currentText;
  }

  return currentText;
}

function sceneHTML(card, extraClass = "") {
  const image = card?.image
    ? `<img class="postcard-photo" src="${escapeHTML(card.image.replace(/^\.\.\/\.\.\//, "/"))}" alt="${escapeHTML(getPostcardFieldText(card, "place") || "旅行明信片")}" loading="lazy" onerror="this.hidden=true;this.parentElement.classList.remove('has-photo')">`
    : "";
  return `<div class="postcard-scene ${escapeHTML(card?.scene || "scene-1")} ${card?.image ? "has-photo" : ""} ${extraClass}">${image}</div>`;
}

const decorationOptions = [
  { id: "redP", label: "redPikmin", image: "/images/Red_Pikmin.png" },
  { id: "blueP", label: "bluePikmin", image: "/images/Blue_Pikmin.png" },
  { id: "yellowP", label: "yellowPikmin", image: "/images/Yellow_Pikmin.png" },
  { id: "whiteP", label: "whitePikmin", image: "/images/White_Pikmin.png" },
  { id: "wingedP", label: "wingedPikmin", image: "/images/Winged_Pikmin.png" },
  { id: "purpleP", label: "purplePikmin", image: "/images/Purple_Pikimin.png" },
  { id: "rockP", label: "rockPikmin", image: "/images/Rock_Pikmin.png" },
  { id: "iceP", label: "icePikmin", image: "/images/Ice_Pikmin.png" },
];

function decorationHTML(card, { interactive = true } = {}) {
  return (card.decorations || [])

    .map((item) => {
      const option =
        decorationOptions.find((option) => option.id === item.type) ||
        decorationOptions[0];

      const selected = interactive && state.selectedDecorationId === item.id;
      const size = Math.max(24, Math.min(160, Number(item.size) || 48));
      return `
  <button
    type="button"
    class="postcard-decoration decor-${option.id} ${selected ? "is-selected" : ""}"
    data-move-decoration="${item.id}"
    aria-label="選取或移動${option.label}"
    aria-pressed="${selected}"
    style="left:${item.x}%;top:${item.y}%;width:${size}px;height:${size}px"
  >
    <img
      src="${option.image}"
      alt=""
      class="postcard-decoration__image"
      draggable="false"
    >
    ${selected ? '<span class="decoration-resize-handle" data-resize-decoration aria-label="調整大小"></span><span class="decoration-delete-button" data-delete-decoration="' + item.id + '" role="button" tabindex="0" aria-label="刪除此裝飾"><i class="bi bi-x-lg"></i></span>' : ""}
  </button>
`;
    })

    .join("");
}

function postcardCardHTML(card) {
  const selected = state.selectedIds.includes(card.id);
  const disabled = !selected && state.selectedIds.length >= MAX_POSTCARDS;

  return `<button class="postcard-card ${selected ? "selected" : ""}" data-select-postcard="${card.id}" aria-pressed="${selected}" ${disabled ? "disabled" : ""}>
    <span class="postcard-check"><i class="bi bi-check-lg"></i></span>
    ${sceneHTML(card)}
    <span class="postcard-meta">
      <strong>${escapeHTML(getPostcardFieldText(card, "place"))}</strong>
      <span class="postcard-meta__date">${escapeHTML(card.date)}</span>
      <span class="postcard-meta__method">${escapeHTML(getPostcardFieldText(card, "method"))}</span>
    </span>
  </button>`;
}

function visiblePostcards() {
  return postcards
    .filter((card) => {
      if (state.filter === "favorites" && !card.favorite) return false;
      if (state.locationFilter !== "all" && card.place !== state.locationFilter)
        return false;
      if (
        state.locationContinent !== "all" &&
        (card.continent || "亞洲") !== state.locationContinent
      )
        return false;
      if (
        state.locationRegion !== "all" &&
        (card.region || "東亞") !== state.locationRegion
      )
        return false;
      if (state.methodFilter !== "all" && card.method !== state.methodFilter)
        return false;
      if (state.dateFilter === "2026" && !card.date.startsWith("2026"))
        return false;
      if (state.dateFilter === "2025" && !card.date.startsWith("2025"))
        return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function formatPageLabel(pageNumber) {
  if (getLocale() === "en") return `Page ${pageNumber}`;
  if (getLocale() === "ja") return `${pageNumber}ページ`;
  return `第 ${pageNumber} 頁`;
}

function stepperHTML() {
  const current = Math.max(1, Math.min(STEPS.length, Number(state.step) || 1));
  const percent = Math.round(((current - 1) / (STEPS.length - 1)) * 100);
  return `
    <div class="stepper-summary" aria-live="polite">
      <span class="stepper-summary__label">相冊製作進度</span>
      <strong>${getLocale() === "en" ? `Step ${current} of ${STEPS.length}` : getLocale() === "ja" ? `全${STEPS.length}ステップ中 ${current}ステップ目` : `第 ${current} 步／共 ${STEPS.length} 步`}</strong>
      <span class="stepper-summary__name">${escapeHTML(STEPS[current - 1])}</span>
    </div>
      <div class="stepper-progress-track" role="progressbar" aria-label="相簿製作進度" data-i18n="相簿製作進度" data-i18n-attr="aria-label" aria-valuemin="1" aria-valuemax="${STEPS.length}" aria-valuenow="${current}">
    <span style="width:${Math.max(0, percent)}%"></span>
  </div>
 

  <div class="stepper" aria-label="相簿製作步驟" data-i18n="相簿製作步驟" data-i18n-attr="aria-label">${STEPS.map(
    (label, index) => {
      const number = index + 1;
      const status =
        number === current ? "active" : number < current ? "completed" : "";
      return `<div class="stepper-item ${status}" ${number === current ? 'aria-current="step"' : ""}><div class="stepper-circle">${number < current ? '<i class="bi bi-check-lg"></i>' : number}</div><div class="stepper-label">${label}</div></div>`;
    },
  ).join("")}</div>`;
}

function scrollToCurrentStep() {
  const container = document.querySelector(".progress-wrap");
  const currentStep = container?.querySelector(".stepper-item.active");

  if (!container || !currentStep) return;

  const containerRect = container.getBoundingClientRect();
  const stepRect = currentStep.getBoundingClientRect();

  const targetLeft =
    container.scrollLeft +
    stepRect.left -
    containerRect.left -
    (container.clientWidth - currentStep.clientWidth) / 2;

  container.scrollTo({
    left: Math.max(
      0,
      Math.min(targetLeft, container.scrollWidth - container.clientWidth),
    ),
    behavior: "smooth",
  });
}
