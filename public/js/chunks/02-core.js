/** Return a product field in the currently selected language. */
function getProductText(product, key) {
  if (!product) return "";
  const language = state.language || "zh-Hant";
  const translations = product.translations || {};
  const localized =
    translations[language] ||
    translations[language.replace("-", "_")] ||
    translations[language.split("-")[0]] ||
    {};
  return localized[key] ?? product[key] ?? "";
}

function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}

function money(value) {
  const currency = getCurrency();
  const rates = { JPY: 1, TWD: 0.215, USD: 0.0067 };
  const amount = Number(value) * rates[currency];

  const locale =
    getLocale() === "ja" ? "ja-JP" : getLocale() === "en" ? "en-US" : "zh-TW";

  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);

  const currencySymbols = {
    JPY: "¥",
    TWD: "NT$",
    USD: "$",
  };

  const symbol = currencySymbols[currency] ?? "¥";

  return `${symbol}${formattedAmount}`;
}

function currentDraft() {
  return (
    state.drafts.find(
      (draft) =>
        draft.id === state.currentDraftId && draft.status !== "submitted",
    ) || null
  );
}

function toast(message, title = "提醒") {
  const container = document.querySelector("#toastContainer");
  const element = document.createElement("div");
  element.className = "toast show surface border-0 feedback-toast";
  element.setAttribute("role", "status");
  // Translate both fixed and interpolated messages through the same phrase matcher.
  const translatedTitle = localizeHTML(escapeHTML(title));
  const translatedMessage = localizeHTML(escapeHTML(message));
  const closeLabel = getLocale() === "en" ? "Close" : getLocale() === "ja" ? "閉じる" : "關閉";
  element.innerHTML = `<div class="d-flex"><div class="toast-body"><strong class="d-block mb-1">${translatedTitle}</strong>${translatedMessage}</div><button type="button" class="btn-close me-3 m-auto" aria-label="${closeLabel}"></button></div>`;
  container.append(element);
  element
    .querySelector(".btn-close")
    .addEventListener("click", () => element.remove());
  window.setTimeout(() => element.remove(), 4000);
}

function setRoute(route) {
  if (
    ["studio", "account", "cart", "checkout"].includes(route) &&
    !state.loggedIn
  ) {
    state.returnTo = route;
    state.route = "auth";
  } else {
    state.route = route;
  }
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setStep(step) {
  state.step = Math.max(1, Math.min(7, step));
  if (state.step === 6) state.previewDirection = "none";
  const draft = currentDraft();
  if (draft) draft.lastStep = state.step;
  saveLocal();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function saveLocal() {
  try {
    const snapshot = {
      drafts: state.drafts,
      postcardEdits: postcards.map((card) => ({
        id: card.id,
        text: card.text,
        includeDate: card.includeDate,
        layout: card.layout,
        decorations: card.decorations || [],
      })),
      cart: state.cart,
      wishlist: state.wishlist,
      loggedIn: state.loggedIn,
      user: state.user,
      order: state.order,
      orders: state.orders || [],
      language: state.language,
      currency: state.currency,
      gift: state.gift,
      giftWrap: state.giftWrap,
      ribbon: state.ribbon,
      giftMessage: state.giftMessage,
      albumPrintQty: state.albumPrintQty,
      authorName: state.authorName,
      coverImage: state.coverImage || "",
      completedDate: state.completedDate,
      printDate: state.printDate,
      addOnIds: state.addOnIds,
      addresses: state.addresses,
    };
    localStorage.setItem("postcardBookConcept", JSON.stringify(snapshot));
  } catch (error) {
    console.warn("Local prototype save unavailable:", error);
  }
  updateSaveLabel();
}

function loadLocal() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("postcardBookConcept") || "null",
    );
    if (saved) {
      state.drafts = saved.drafts || [];
      (saved.postcardEdits || []).forEach((edit) => {
        const card = postcards.find((item) => item.id === edit.id);
        if (card) Object.assign(card, edit);
      });
      state.cart = saved.cart || [];
      state.wishlist = saved.wishlist || [];
      state.loggedIn = Boolean(saved.loggedIn);
      state.user = saved.user || state.user;
      state.order = saved.order || null;
      state.orders = saved.orders || (saved.order ? [saved.order] : []);
      state.language = saved.language || state.language;
      state.currency = saved.currency || state.currency;
      state.gift = Boolean(saved.gift);
      state.giftWrap = Boolean(saved.giftWrap);
      state.ribbon = Boolean(saved.ribbon);
      state.giftMessage = saved.giftMessage || "";
      state.albumPrintQty = saved.albumPrintQty || 1;
      state.authorName = saved.authorName || "";
      state.coverImage = saved.coverImage || "";
      state.completedDate = saved.completedDate || state.completedDate;
      state.printDate = saved.printDate || "";
      state.addOnIds = saved.addOnIds || [];
      state.addresses = saved.addresses || [];
      if (state.accountTab === "payments") state.accountTab = "profile";
      state.currentDraftId =
        state.drafts.find((draft) => draft.status !== "submitted")?.id ?? null;
      if (state.currentDraftId)
        state.selectedIds = [...(currentDraft()?.postcardIds || [])];
    }
  } catch (error) {
    console.warn("Could not restore local prototype state:", error);
  }
}

function updateSaveLabel() {
  const label = document.querySelector("#saveStatus");
  if (label) label.innerHTML = '<i class="bi bi-check-circle-fill"></i> 已儲存';
  updateCartCount();
}

function updateCartCount(animate = false) {
  const count = document.querySelector("#cartCount");
  if (count) {
    const total = state.cart.reduce((sum, item) => sum + item.qty, 0);
    count.textContent = total;
    if (animate) {
      count.classList.remove("cart-pop");
      void count.offsetWidth;
      count.classList.add("cart-pop");
    }
  }
}

function syncDraft() {
  const draft = currentDraft();
  if (!draft) return;
  draft.postcardIds = [...state.selectedIds];
  draft.coverStyle = state.coverStyle;
  draft.coverTitle = state.coverTitle;
  draft.coverSubtitle = state.coverSubtitle;
  draft.coverImage = state.coverImage || "";
  draft.authorName = state.authorName;
  draft.completedDate = state.completedDate;
  draft.printDate = state.printDate;
  draft.lastStep = state.step;
  draft.updatedAt = new Date().toISOString();
  saveLocal();
}

function requireLogin(destination) {
  state.returnTo = destination;
  state.route = "auth";
  render();
}
