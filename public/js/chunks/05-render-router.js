function render() {
  siteHeader.classList.toggle("d-none", ["auth"].includes(state.route));
  siteFooter.classList.toggle(
    "d-none",
    ["auth", "studio"].includes(state.route),
  );
  document
    .querySelectorAll("[data-route]")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.route === state.route),
    );
  const routes = {
    home: renderHome,
    studio: renderStudio,
    auth: renderAuth,
    shop: renderShop,
    cart: renderCart,
    account: renderAccount,
    checkout: renderCheckout,
    order: renderOrder,
    about: () => {
      state.infoPage = "about";
      return renderInfo();
    },
    faq: () => renderInfo(),
    shipping: () => renderInfo(),
    contact: () => {
      state.infoPage = "contact";
      return renderInfo();
    },
    privacy: () => {
      state.infoPage = "privacy";
      return renderInfo();
    },
    product: () => renderProductDetail(state.currentProductId),
  };
  main.innerHTML = localizeHTML((routes[state.route] || renderHome)());

  const routeTitles = {
    home: "Bloom Memories｜UNOFFICIAL CONCEPT PROJECT",
    shop: "商店｜Bloom Memories",
    product: "商品詳情｜Bloom Memories",
    cart: "購物車｜Bloom Memories",
    checkout: "確認訂單｜Bloom Memories",
    order: "訂單狀態｜Bloom Memories",
    faq: "常見QA｜Bloom Memories",
    shipping: "配送資訊｜Bloom Memories",
    studio: "製作相冊｜Bloom Memories",
    account: "我的帳戶｜Bloom Memories",
  };
  document.title = t(
    routeTitles[state.route] || "Bloom Memories｜UNOFFICIAL CONCEPT PROJECT",
  );
  document.documentElement.lang =
    state.language === "zh-Hant" ? "zh-Hant" : state.language;

  // Keep search and social-preview metadata aligned with the selected language.
  const pageMetadata =
    {
      "zh-Hant": {
        description:
          "Bloom Memories 是一個非官方概念作品，探索如何將數位明信片整理成可珍藏、可送禮的實體相冊。",
        socialTitle: "Bloom Memories｜把旅途中的明信片收藏成一冊回憶",
        socialDescription:
          "探索將數位明信片轉化為實體相冊的專案作品。此為非官方的概念作品。",
        keywords:
          "Bloom Memories, 明信片相冊, 旅行回憶, 相冊設計, 作品集概念, postcard album, Pikmin Bloom, 皮克敏",
        ogLocale: "zh_TW",
      },
      en: {
        description:
          "Bloom Memories is an unofficial concept exploring how digital postcards can become a keepsake album you can treasure or gift.",
        socialTitle:
          "Bloom Memories | Turn Travel Postcards into a Keepsake Album",
        socialDescription:
          "Explore a portfolio concept that turns digital postcards into a printed album. This is an unofficial concept project.",
        keywords:
          "Bloom Memories, postcard album, travel memories, album design, portfolio concept, Pikmin Bloom",
        ogLocale: "en_US",
      },
      ja: {
        description:
          "Bloom Memoriesは、デジタルポストカードを大切に保存したり贈ったりできる実物のアルバムにする方法を探る、非公式のコンセプト作品です。",
        socialTitle: "Bloom Memories｜旅のポストカードを思い出の一冊に",
        socialDescription:
          "デジタルポストカードを実物のアルバムにするポートフォリオ作品です。非公式のコンセプトプロジェクトです。",
        keywords:
          "Bloom Memories, ポストカードアルバム, 旅行の思い出, アルバムデザイン, ポートフォリオ作品, Pikmin Bloom",
        ogLocale: "ja_JP",
      },
    }[state.language] || {};
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const ogTitleMeta = document.querySelector('meta[property="og:title"]');
  const ogDescriptionMeta = document.querySelector(
    'meta[property="og:description"]',
  );
  const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (descriptionMeta && pageMetadata.description)
    descriptionMeta.content = pageMetadata.description;
  if (ogTitleMeta && pageMetadata.socialTitle)
    ogTitleMeta.content = pageMetadata.socialTitle;
  if (ogDescriptionMeta && pageMetadata.socialDescription)
    ogDescriptionMeta.content = pageMetadata.socialDescription;
  if (ogLocaleMeta && pageMetadata.ogLocale)
    ogLocaleMeta.content = pageMetadata.ogLocale;
  if (keywordsMeta && pageMetadata.keywords)
    keywordsMeta.content = pageMetadata.keywords;

  const structuredData = document.querySelector(
    'script[type="application/ld+json"]',
  );
  if (structuredData) {
    try {
      const schema = JSON.parse(structuredData.textContent);
      schema.description = pageMetadata.description || schema.description;
      schema.inLanguage = state.language;
      structuredData.textContent = JSON.stringify(schema, null, 2);
    } catch (error) {
      console.warn("Unable to update localized structured data.", error);
    }
  }
  const currencySelect = document.querySelector("#languageSelect");
  if (currencySelect) currencySelect.value = state.language;
  const currencySymbol =
    { JPY: "¥", TWD: "NT$", USD: "$" }[state.currency] || "¥";
  const currencyButton = document.querySelector("#currencyButton");
  if (currencyButton)
    currencyButton.innerHTML = `<i class="bi bi-currency-exchange"></i><span>${currencySymbol}</span>`;
  document
    .querySelectorAll("[data-currency]")
    .forEach((button) =>
      button.classList.toggle(
        "active",
        button.dataset.currency === state.currency,
      ),
    );

  applyI18n(document);
  updateCartCount();
}
function goToCheckout(kind) {
  state.checkoutKind = kind;
  if (!state.loggedIn) return requireLogin("checkout");
  state.route = "checkout";
  render();
}
function placeOrder() {
  const name =
    document.querySelector("#shipName")?.value.trim() ||
    document.querySelector("#checkoutName")?.value.trim() ||
    state.user.name;
  const address =
    document.querySelector("#shipAddress")?.value.trim() ||
    document.querySelector("#checkoutAddress")?.value.trim();
  const email =
    document.querySelector("#checkoutEmail")?.value.trim() || state.user.email;

  const phone = document.querySelector("#checkoutPhone")?.value.trim() || "";

  const postalCode =
    document.querySelector("#checkoutPostal")?.value.trim() || "";
  const country =
    document.querySelector("#shipCountry")?.value ||
    document.querySelector("#checkoutCountry")?.value;
  if (!name || !address) {
    toast("請先填寫收件人姓名與完整地址。", "還有資料尚未完成");
    document.querySelector("#shipName, #checkoutName")?.focus();
    return;
  }
  if (country === "Other" || country === "其他地區") {
    toast(
      "這個目的地的配送支援狀態尚未確認，請選擇原型中可模擬的目的地。",
      "配送目的地待確認",
    );
    return;
  }
  const title =
    state.checkoutKind === "album"
      ? currentDraft()?.title || state.coverTitle
      : "一般商品訂單";
  const itemTotal =
    state.checkoutKind === "album"
      ? 2800 * state.albumPrintQty +
        (state.gift && state.giftWrap ? 300 : 0) +
        (state.gift && state.ribbon ? 100 : 0) +
        state.addOnIds.reduce(
          (sum, id) => sum + (products.find((p) => p.id === id)?.price || 0),
          0,
        ) +
        state.cart.reduce(
          (sum, item) =>
            sum +
            (products.find((p) => p.id === item.id)?.price || 0) * item.qty,
          0,
        )
      : state.cart.reduce(
          (sum, item) =>
            sum +
            (products.find((product) => product.id === item.id)?.price || 0) *
              item.qty,
          0,
        );
  const shippingRates = {
    日本: 500,
    台灣: 1200,
    其他地區: 2500,
  };

  const shippingFee = shippingRates[country] ?? 2500;
  const total = itemTotal + shippingFee;
  state.order = {
    id: `PB-${Date.now().toString().slice(-7)}`,
    title,
    total,
    status: "訂單已建立",
    gift: state.gift,
    giftWrap: state.gift && state.giftWrap,
    ribbon: state.gift && state.ribbon,
    giftMessage: state.gift ? state.giftMessage : "",
    recipient: name,
    country,
    createdAt: new Date().toISOString(),
    printQty: state.checkoutKind === "album" ? state.albumPrintQty : 0,
    type: state.checkoutKind,
    postcardIds: [...(currentDraft()?.postcardIds || [])],
    coverTitle: state.coverTitle,
    coverSubtitle: state.coverSubtitle,
    coverStyle: state.coverStyle,
    coverImage: state.coverImage || "",
    authorName: state.authorName,
    completedDate: state.completedDate,
    printDate: state.printDate,
    giftMessage: state.giftMessage,
    addOnIds: [...state.addOnIds],
  };
  state.orders = [state.order, ...(state.orders || [])];
  if (state.checkoutKind === "general" || state.checkoutKind === "album")
    state.cart = [];
  if (state.checkoutKind === "album") {
    const draft = currentDraft();
    if (draft) {
      draft.status = "submitted";
      draft.orderId = state.order.id;
    }
  }
  const normalizedAddress = address.trim();
  const normalizedCountry = country.trim();

  const existingAddress = state.addresses.find(
    (item) =>
      item.address.trim() === normalizedAddress &&
      item.region.trim() === normalizedCountry &&
      item.recipient.trim() === name.trim(),
  );

  if (!existingAddress) {
    state.addresses.push({
      id: `address-${Date.now()}`,
      label: "結帳時新增",
      recipient: name,
      phone,
      region: normalizedCountry,
      address: normalizedAddress,
      postalCode,
      email,
    });
  }
  saveLocal();
  state.route = "order";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
