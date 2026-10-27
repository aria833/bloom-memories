document.addEventListener("click", (event) => {
  const moveButton = event.target.closest("[data-move]");
  if (moveButton) {
    const id = Number(moveButton.dataset.id);
    const ids = [...state.selectedIds];
    const index = ids.indexOf(id);
    const target = moveButton.dataset.move === "left" ? index - 1 : index + 1;
    if (target >= 0 && target < ids.length)
      [ids[index], ids[target]] = [ids[target], ids[index]];
    state.selectedIds = ids;
    syncDraft();
    render();
    return;
  }
  if (event.target.closest("#sortByDate")) {
    state.selectedIds.sort((a, b) =>
      getPostcardById(b).date.localeCompare(getPostcardById(a).date),
    );
    syncDraft();
    render();
    return;
  }
  if (event.target.closest("#continueSelection")) {
    if (!state.selectedIds.length) return toast("請先選取至少一張明信片。");
    syncDraft();
    state.editorIndex = 0;
    setStep(3);
    return;
  }
  if (event.target.closest("#createDraftContinue")) {
    const input = document.querySelector("#albumName");
    const title = input?.value.trim() || "我的旅行相冊";
    state.newDraftTitle = title;
    let draft = currentDraft();
    if (!draft) {
      if (
        state.drafts.filter((draft) => draft.status !== "submitted").length >=
        MAX_DRAFTS
      ) {
        toast(
          `每位使用者最多可保留 ${MAX_DRAFTS} 本未完成草稿。請先管理既有草稿。`,
          "草稿數量已達上限",
        );
        state.route = "account";
        state.accountTab = "drafts";
        render();
        return;
      }
      draft = {
        id: `draft-${Date.now()}`,
        title,
        postcardIds: [],
        coverStyle: "botanical",
        coverTitle: title,
        coverSubtitle: "把旅途中的小小發現收藏起來",
        coverImage: "",
        lastStep: 2,
        updatedAt: new Date().toISOString(),
      };
      state.drafts.unshift(draft);
      state.currentDraftId = draft.id;
      state.selectedIds = [];
      state.coverStyle = "botanical";
      state.coverTitle = title;
      state.coverSubtitle = draft.coverSubtitle;
      state.coverImage = "";
      state.authorName = "";
      state.completedDate = new Date().toISOString().slice(0, 10);
      state.printDate = "";
    } else {
      draft.title = title;
      draft.coverTitle = title;
      state.coverTitle = draft.coverTitle;
      state.coverSubtitle = draft.coverSubtitle || state.coverSubtitle;
      state.coverImage = draft.coverImage || "";
    }
    state.isCreatingDraft = false;
    syncDraft();
    setStep(2);
    return;
  }
  if (event.target.closest("#finishEditing")) {
    syncDraft();
    setStep(4);
    return;
  }
  if (event.target.closest("#previousCard")) {
    state.editorIndex = Math.max(0, state.editorIndex - 1);
    render();
    return;
  }
  if (event.target.closest("#nextCard")) {
    state.editorIndex = Math.min(
      getSelectedPostcards().length - 1,
      state.editorIndex + 1,
    );
    render();
    return;
  }
  if (
    event.target.closest("#goConfirmPrint") ||
    event.target.closest("#goConfirmPrintBottom")
  ) {
    setStep(7);
    return;
  }
  if (event.target.closest("#previewPrevious")) {
    state.previewDirection = "backward";
    state.previewIndex = Math.max(0, (state.previewIndex || 0) - 1);
    render();
    return;
  }
  if (event.target.closest("#previewNext")) {
    state.previewDirection = "forward";
    state.previewIndex = Math.min(
      getSelectedPostcards().length + 2,
      (state.previewIndex || 0) + 1,
    );
    render();
    return;
  }
  if (event.target.closest("#newDraft")) {
    state.currentDraftId = null;
    state.selectedIds = [];
    state.newDraftTitle = "我的旅行相冊";
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
  if (event.target.closest("#cartCheckout")) {
    return goToCheckout("general");
  }
  if (
    event.target.closest("#continueAlbumCheckout") ||
    event.target.closest("#continueAlbumCheckoutBottom")
  ) {
    state.checkoutKind = "album";
    return goToCheckout("album");
  }
  if (event.target.closest("#reorderSubmitted")) {
    const order = state.order;
    if (order?.postcardIds?.length) {
      state.drafts = state.drafts.filter((d) => d.status !== "submitted");
      const draft = {
        id: `draft-${Date.now()}`,
        title: `${order.title}（再次印製）`,
        postcardIds: [...order.postcardIds],
        coverTitle: order.coverTitle || order.title,
        coverSubtitle: order.coverSubtitle || "",
        coverStyle: order.coverStyle || "botanical",
        coverImage: order.coverImage || "",
        lastStep: 6,
        updatedAt: new Date().toISOString(),
      };
      state.drafts.unshift(draft);
      state.currentDraftId = draft.id;
      state.selectedIds = [...draft.postcardIds];
      state.coverTitle = draft.coverTitle;
      state.coverStyle = draft.coverStyle;
      state.coverImage = draft.coverImage || "";
      state.step = 6;
      state.route = "studio";
      render();
    } else toast("這筆訂單沒有相冊資料可供再次下單。");
    return;
  }
  if (
    event.target.closest("#checkoutPlaceOrder") ||
    event.target.closest("#placeOrder") ||
    event.target.closest("#placeOrderBottom")
  ) {
    placeOrder();
    return;
  }
  if (event.target.closest("#switchAuth")) {
    state.authMode = state.authMode === "signup" ? "login" : "signup";
    render();
    return;
  }
  if (event.target.closest("#forgotPassword")) {
    toast("這是概念原型，尚未實作密碼重設。");
    return;
  }
  if (event.target.closest("#signOut")) {
    state.loggedIn = false;
    state.route = "home";
    saveLocal();
    render();
    toast("已登出原型帳戶。");
    return;
  }
  if (event.target.closest("#saveProfile")) {
    state.user.name =
      document.querySelector("#profileName").value.trim() || state.user.name;
    saveLocal();
    toast("個人資料已儲存。");
    render();
    return;
  }
  if (event.target.closest("#clearFilters")) {
    state.filter = "all";
    state.locationFilter = "all";
    state.locationContinent = "all";
    state.locationRegion = "all";
    state.methodFilter = "all";
    state.dateFilter = "all";
    render();
    return;
  }
});
