document.addEventListener("click", (event) => {
  const editorCanvas = event.target.closest("#activePostcardCanvas");
  const clickedDecoration = event.target.closest("[data-move-decoration]");

  if (editorCanvas && !clickedDecoration && state.selectedDecorationId) {
    state.selectedDecorationId = null;
    render();
    return;
  }

  const infoPanel = event.target.closest("[data-info-panel]");
  if (infoPanel) {
    state.infoPage = infoPanel.dataset.infoPanel;
    state.route = "faq";
    render();
    return;
  }
  const showcase = event.target.closest("[data-showcase]");
  if (showcase) {
    state.activeShowcase = showcase.dataset.showcase;
    state.albumShowcaseIndex = 0;
    openShowcaseModal();
    return;
  }
  if (event.target.closest("#closeShowcase")) {
    closeShowcaseModal();
    return;
  }
  const galleryMove = event.target.closest("[data-gallery]");
  if (galleryMove) {
    state.productImageIndex =
      (state.productImageIndex + Number(galleryMove.dataset.gallery) + 3) % 3;
    render();
    return;
  }
  const galleryIndex = event.target.closest("[data-gallery-index-button]");
  if (galleryIndex) {
    state.productImageIndex = Number(galleryIndex.dataset.galleryIndexButton);
    render();
    return;
  }
  const productQty = event.target.closest("[data-product-qty]");
  if (productQty) {
    state.productQty = Math.max(
      1,
      Math.min(10, state.productQty + Number(productQty.dataset.productQty)),
    );
    render();
    return;
  }
  const albumQty = event.target.closest("[data-album-qty]");
  if (albumQty) {
    state.albumPrintQty = Math.max(
      1,
      Math.min(20, state.albumPrintQty + Number(albumQty.dataset.albumQty)),
    );
    render();
    return;
  }

  if (event.target.closest("#startNewDraft")) {
    const nameInput = document.querySelector("#newAlbumName");
    state.newDraftTitle = nameInput?.value.trim() || "我的旅行相冊";
    state.currentDraftId = null;
    state.selectedIds = [];
    state.isCreatingDraft = true;
    state.step = 1;
    state.route = "studio";
    render();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    return;
  }
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    const route = routeButton.dataset.route;
    if (route === "studio") {
      if (!state.loggedIn) return requireLogin("studio");
      const draft = currentDraft();
      if (draft) {
        state.step = draft.lastStep || 2;
        state.selectedIds = [...draft.postcardIds];
      } else state.step = 1;
    }
    if (route === "checkout") return goToCheckout("album");
    if (route === "account" && !state.loggedIn) {
      state.returnTo = "account";
      state.route = "auth";
      return render();
    }
    if (["about", "faq", "shipping", "contact", "privacy"].includes(route))
      state.infoPage = route;
    state.route = route;
    document.querySelector("#mobileNav")?.classList.add("d-none");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    state.filter = filter.dataset.filter;
    render();
    return;
  }
  const shopFilter = event.target.closest("[data-shop-filter]");
  if (shopFilter) {
    state.shopFilter = shopFilter.dataset.shopFilter;
    render();
    return;
  }

  const selectCard = event.target.closest("[data-select-postcard]");
  if (selectCard) {
    const id = Number(selectCard.dataset.selectPostcard);
    if (state.selectedIds.includes(id))
      state.selectedIds = state.selectedIds.filter((item) => item !== id);
    else if (state.selectedIds.length < MAX_POSTCARDS)
      state.selectedIds.push(id);
    else
      return toast(
        `每本相冊最多選取 ${MAX_POSTCARDS} 張明信片。`,
        "已達選取上限",
      );
    state.selectedIds.sort(
      (a, b) =>
        postcards.findIndex((card) => card.id === a) -
        postcards.findIndex((card) => card.id === b),
    );
    syncDraft();
    render();
    return;
  }

  if (event.target.closest("#backToCreateDraft")) {
    state.isCreatingDraft = true;
    state.newDraftTitle =
      currentDraft()?.title || state.newDraftTitle || "我的旅行相冊";
    setStep(1);
    return;
  }
  const stepButton = event.target.closest("[data-studio-step]");

  if (stepButton) {
    if (
      Number(stepButton.dataset.studioStep) === 2 &&
      !state.selectedIds.length
    )
      return toast("請先選取至少一張明信片。");
    setStep(Number(stepButton.dataset.studioStep));
    return;
  }
  const layoutButton = event.target.closest("[data-layout]");
  if (layoutButton) {
    const card = getSelectedPostcards()[state.editorIndex];
    if (card) {
      card.layout = layoutButton.dataset.layout;
      state.currentLayout = card.layout;
      if (card.layout === "original") {
        card.decorations = [];
      }
      saveLocal();
      render();
    }
    return;
  }
  const decorButton = event.target.closest("[data-decoration]");
  if (decorButton) {
    const card = getSelectedPostcards()[state.editorIndex];
    if (!card) return;
    card.decorations ||= [];
    if (card.decorations.length >= 8)
      return toast("每張明信片最多放置 8 個裝飾。", "已達裝飾上限");
    const type = decorButton.dataset.decoration;
    const index = card.decorations.length;
    card.decorations.push({
      id: `decor-${Date.now()}-${index}`,
      type,
      x: [12, 28, 44, 61, 78, 22, 57, 84][index],
      y: [18, 35, 20, 76, 44, 83, 56, 16][index],
      size: 48,
    });
    state.selectedDecoration = type;
    state.selectedDecorationId =
      card.decorations[card.decorations.length - 1].id;
    saveLocal();
    render();
    return;
  }
  if (event.target.closest("[data-clear-decorations]")) {
    const card = getSelectedPostcards()[state.editorIndex];
    if (card) {
      card.decorations = [];
      state.selectedDecorationId = null;
      saveLocal();
      render();
    }
    return;
  }
  const coverButton = event.target.closest("[data-cover-style]");
  if (coverButton) {
    state.coverStyle = coverButton.dataset.coverStyle;
    syncDraft();
    render();
    return;
  }
  const previewButton = event.target.closest("[data-preview-index]");
  if (previewButton) {
    const nextIndex = Number(previewButton.dataset.previewIndex);
    state.previewDirection =
      nextIndex < (state.previewIndex || 0) ? "backward" : "forward";
    state.previewIndex = nextIndex;
    render();
    return;
  }
  const productButton = event.target.closest("[data-product-detail]");
  if (productButton) {
    state.currentProductId = productButton.dataset.productDetail;
    state.productImageIndex = 0;
    state.productQty = 1;
    state.route = "product";
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
});
