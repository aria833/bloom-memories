
async function readCompressedCoverImage(file) {
  const bitmap = await createImageBitmap(file);
  const maxSide = 1400;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.82);
}

document.addEventListener("input", (event) => {
  if (event.target.id === "postcardText") {
    const card = getSelectedPostcards()[state.editorIndex];
    if (card) {
      card.text = event.target.value;
      const note = document.querySelector(".editor-note");
      if (note) note.textContent = event.target.value;
      saveLocal();
    }
  }
  if (event.target.id === "coverTitle") {
    state.coverTitle = event.target.value;
    const preview = document.querySelector("#coverPreviewTitle");
    if (preview) preview.textContent = state.coverTitle;
    const draft = currentDraft();
    if (draft) draft.coverTitle = state.coverTitle;
    saveLocal();
  }
  if (event.target.id === "coverSubtitle") {
    state.coverSubtitle = event.target.value;
    const preview = document.querySelector("#coverPreviewSubtitle");
    if (preview) preview.textContent = state.coverSubtitle;
    const draft = currentDraft();
    if (draft) draft.coverSubtitle = state.coverSubtitle;
    saveLocal();
  }
  if (event.target.id === "authorName") {
    state.authorName = event.target.value;
    const draft = currentDraft();
    if (draft) draft.authorName = state.authorName;
    saveLocal();
  }
  if (event.target.id === "completedDate") {
    state.completedDate = event.target.value;
    const draft = currentDraft();
    if (draft) draft.completedDate = state.completedDate;
    saveLocal();
  }
  if (event.target.id === "printDate") {
    state.printDate = event.target.value;
    const draft = currentDraft();
    if (draft) draft.printDate = state.printDate;
    saveLocal();
  }
  if (event.target.id === "giftMessage") {
    state.giftMessage = event.target.value;
    saveLocal();
  }
});
document.addEventListener("change", async (event) => {
  if (event.target.id === "coverImageUpload") {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast(t("請選擇圖片檔案。"));
      return;
    }

    try {
      state.coverImage = await readCompressedCoverImage(file);
      syncDraft();
      render();
    } catch (error) {
      console.error("封面圖片讀取失敗：", error);
      toast(t("圖片讀取失敗，請換一張圖片再試。"));
    }
    return;
  }

  if (event.target.id === "locationFilter") {
    state.locationFilter = event.target.value;
    render();
  }
  if (event.target.id === "continentFilter") {
    state.locationContinent = event.target.value;
    state.locationRegion = "all";
    state.locationFilter = "all";
    render();
  }
  if (event.target.id === "regionFilter") {
    state.locationRegion = event.target.value;
    state.locationFilter = "all";
    render();
  }
  if (event.target.id === "methodFilter") {
    state.methodFilter = event.target.value;
    render();
  }
  if (event.target.id === "dateFilter") {
    state.dateFilter = event.target.value;
    render();
  }
  if (event.target.id === "includeDate") {
    const card = getSelectedPostcards()[state.editorIndex];
    if (card) {
      card.includeDate = event.target.checked;
      saveLocal();
      render();
    }
  }
  if (event.target.name === "gift") {
    state.gift = event.target.value === "gift";
    render();
  }
  if (event.target.id === "giftWrap") {
    state.giftWrap = event.target.checked;
    render();
  }
  if (event.target.id === "ribbon") {
    state.ribbon = event.target.checked;
    render();
  }
  if (event.target.id === "checkoutGift") {
    state.gift = event.target.checked;
    saveLocal();
    render();
  }
  if (event.target.matches("[data-addon-select]")) {
    const id = event.target.dataset.addonSelect;
    state.addOnIds = event.target.checked
      ? [...new Set([...state.addOnIds, id])]
      : state.addOnIds.filter((item) => item !== id);
    saveLocal();
    render();
  }
});
document.addEventListener("submit", (event) => {
  if (event.target.id === "addressForm") {
    event.preventDefault();
    const record = {
      id: state.editingAddressId || `address-${Date.now()}`,
      label: document.querySelector("#addressLabel").value.trim(),
      recipient: document.querySelector("#addressRecipient").value.trim(),
      phone: document.querySelector("#addressPhone").value.trim(),
      region: document.querySelector("#addressRegion").value.trim(),
      address: document.querySelector("#addressFull").value.trim(),
    };
    if (state.editingAddressId)
      state.addresses = state.addresses.map((address) =>
        address.id === state.editingAddressId ? record : address,
      );
    else state.addresses.push(record);
    state.editingAddressId = null;
    saveLocal();
    toast("地址簿已更新。");
    render();
    return;
  }
  if (event.target.id === "authForm") {
    event.preventDefault();
    const email = document.querySelector("#authEmail").value.trim();
    const password = document.querySelector("#authPassword").value;
    if (!email || password.length < 4)
      return toast("請輸入有效的電子郵件與至少 4 個字元的密碼。");
    state.user.email = email;
    if (state.authMode === "signup")
      state.user.name =
        document.querySelector("#authName").value.trim() || email.split("@")[0];
    state.loggedIn = true;
    saveLocal();
    const destination = state.returnTo || "account";
    if (destination === "create" || destination === "studio") {
      state.route = "studio";
      if (currentDraft()) {
        state.step = currentDraft().lastStep || 2;
        state.selectedIds = [...currentDraft().postcardIds];
      } else state.step = 1;
    } else if (destination === "checkout") {
      state.route = "checkout";
    } else if (destination === "cart") {
      state.route = "cart";
    } else if (destination === "account") {
      state.route = "account";
    } else {
      state.route = destination;
    }
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (event.target.id === "checkoutForm") {
    event.preventDefault();
    toast("配送資料已完成，請在右側確認訂單後模擬付款。");
  }
  if (event.target.id === "checkoutCountry") {
    state.checkoutCountry = event.target.value;

    saveLocal();

    render();
  }
});

