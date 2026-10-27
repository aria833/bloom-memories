document.addEventListener("click", (event) => {
  const addCart = event.target.closest("[data-add-cart]");
  if (addCart) {
    const id = addCart.dataset.addCart;
    const product = products.find((item) => item.id === id);
    if (!product || product.type === "add-on")
      return toast("此商品僅限製作相冊時加購。");
    const existing = state.cart.find((item) => item.id === id);
    const addQty = Math.max(
      1,
      Math.min(10, Number(addCart.dataset.qtyAdd || 1)),
    );
    if (existing) existing.qty = Math.min(10, existing.qty + addQty);
    else state.cart.push({ id, qty: addQty });
    saveLocal();
    toast(`${getProductText(product, "name")} × ${addQty} ${t("加入購物車")}`, t("加入成功"));
    render();
    updateCartCount(true);
    return;
  }
  const addWishlistCart = event.target.closest("[data-add-wishlist-cart]");

  if (addWishlistCart) {
    const id = addWishlistCart.dataset.addWishlistCart;
    const input = document.querySelector(`[data-wishlist-qty="${id}"]`);

    const qty = Math.max(1, Math.min(10, Number(input?.value) || 1));

    const existing = state.cart.find((item) => item.id === id);

    if (existing) {
      existing.qty = qty;
    } else {
      state.cart.push({ id, qty });
    }

    saveLocal();
    toast("商品已加入購物車。");
    render();
    return;
  }
  const viewOrder = event.target.closest("[data-view-order]");
  if (viewOrder) {
    state.order =
      (state.orders || []).find(
        (order) => order.id === viewOrder.dataset.viewOrder,
      ) || state.order;
    state.route = "order";
    render();
    return;
  }
  const submittedBook = event.target.closest("[data-view-submitted-book]");
  if (submittedBook) {
    const order = (state.orders || []).find(
      (item) => item.id === submittedBook.dataset.viewSubmittedBook,
    );
    if (order) {
      state.activeShowcase = "submitted";
      state.albumShowcaseIndex = 0;
      state.submittedPreviewOrder = order;
      openShowcaseModal();
      updateShowcaseModal();
    }
    return;
  }
  const reorderButton = event.target.closest("[data-reorder-id]");
  if (reorderButton) {
    const order = (state.orders || []).find(
      (item) => item.id === reorderButton.dataset.reorderId,
    );
    if (order?.postcardIds?.length) {
      state.order = order;
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
    }
    return;
  }
  const wishlist = event.target.closest("[data-wishlist]");
  if (wishlist) {
    const id = wishlist.dataset.wishlist;
    if (state.wishlist.includes(id))
      state.wishlist = state.wishlist.filter((item) => item !== id);
    else state.wishlist.push(id);
    saveLocal();
    toast(
      state.wishlist.includes(id)
        ? "已加入商品願望清單。"
        : "已從願望清單移除。",
    );
    render();
    return;
  }
  const qtyButton = event.target.closest("[data-qty]");
  if (qtyButton) {
    const item = state.cart.find(
      (cartItem) => cartItem.id === qtyButton.dataset.id,
    );
    if (item)
      item.qty = Math.max(
        1,
        Math.min(10, item.qty + Number(qtyButton.dataset.qty)),
      );
    saveLocal();
    render();
    return;
  }
  const removeCart = event.target.closest("[data-remove-cart]");
  if (removeCart) {
    state.cart = state.cart.filter(
      (item) => item.id !== removeCart.dataset.removeCart,
    );
    saveLocal();
    render();
    return;
  }
  const editAddress = event.target.closest("[data-edit-address]");
  if (editAddress) {
    state.editingAddressId = editAddress.dataset.editAddress;
    state.accountTab = "addresses";
    render();
    return;
  }
  const deleteAddress = event.target.closest("[data-delete-address]");
  if (deleteAddress) {
    state.addresses = state.addresses.filter(
      (address) => address.id !== deleteAddress.dataset.deleteAddress,
    );
    if (state.editingAddressId === deleteAddress.dataset.deleteAddress)
      state.editingAddressId = null;
    saveLocal();
    toast("地址已刪除。");
    render();
    return;
  }
  if (event.target.closest("#cancelAddressEdit")) {
    state.editingAddressId = null;
    render();
    return;
  }
  const accountTab = event.target.closest("[data-account-tab]");
  if (accountTab) {
    state.accountTab = accountTab.dataset.accountTab;
    render();
    return;
  }
  const resume = event.target.closest("[data-resume-draft]");
  if (resume) {
    state.isCreatingDraft = false;
    state.currentDraftId = resume.dataset.resumeDraft;
    state.selectedIds = [...(currentDraft()?.postcardIds || [])];
    state.coverTitle =
      currentDraft()?.coverTitle || currentDraft()?.title || state.coverTitle;
    state.coverSubtitle = currentDraft()?.coverSubtitle || state.coverSubtitle;
    state.authorName = currentDraft()?.authorName || "";
    state.completedDate = currentDraft()?.completedDate || state.completedDate;
    state.printDate = currentDraft()?.printDate || "";
    state.coverStyle = currentDraft()?.coverStyle || state.coverStyle;
    state.coverImage = currentDraft()?.coverImage || "";
    state.step = currentDraft()?.lastStep || 2;
    state.route = "studio";
    render();
    return;
  }
  const deleteDraft = event.target.closest("[data-delete-draft]");
  if (deleteDraft) {
    state.drafts = state.drafts.filter(
      (draft) => draft.id !== deleteDraft.dataset.deleteDraft,
    );
    if (state.currentDraftId === deleteDraft.dataset.deleteDraft)
      state.currentDraftId = state.drafts[0]?.id || null;
    saveLocal();
    toast("草稿已從此原型中刪除。");
    render();
    return;
  }
});
