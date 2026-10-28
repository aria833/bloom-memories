function renderCheckout() {
  if (!state.loggedIn) return renderAuth();

  const album = state.checkoutKind === "album";

  const country =
    document.querySelector("#checkoutCountry")?.value ||
    state.checkoutCountry ||
    "日本";

  const shippingRates = {
    日本: 500,
    台灣: 1200,
    其他地區: 2500,
  };

  const shippingFee = shippingRates[country] ?? 2500;

  const selected = getSelectedPostcards();

  const cartLines = state.cart
    .map((item) => ({
      ...products.find((product) => product.id === item.id),
      qty: item.qty,
    }))
    .filter((item) => item.id);

  const subtotal = album
    ? 2800 * state.albumPrintQty +
      (state.gift && state.giftWrap ? 300 : 0) +
      (state.gift && state.ribbon ? 100 : 0) +
      state.addOnIds.reduce(
        (sum, id) =>
          sum + (products.find((product) => product.id === id)?.price || 0),
        0,
      ) +
      cartLines.reduce((sum, item) => sum + item.price * item.qty, 0)
    : cartLines.reduce((sum, item) => sum + item.price * item.qty, 0);

  const total = subtotal + shippingFee;

  return `
    <div class="page-container">
      <section class="page-intro">
        <button
          class="btn btn-outline-primary mb-3"
          type="button"
          data-route="cart"
        >
          <i class="bi bi-arrow-left me-2"></i>返回購物車
        </button>

        <span class="eyebrow">CHECKOUT</span>
        <h1 class="mt-2">確認訂單</h1>
        <p>
          確認收件資訊與訂單內容。這是互動原型，付款步驟不會收取真實款項。
        </p>
      </section>

      <div class="checkout-layout">
        <div>
          <div class="checkout-step">
            <div class="checkout-step__item">
              <span>1</span>
              <span class="checkout-step__label">配送資訊</span>
            </div>

            <div class="checkout-step__item">
              <span>2</span>
              <span class="checkout-step__label">付款方式</span>
            </div>

            <div class="checkout-step__item">
              <span>3</span>
              <span class="checkout-step__label">確認訂單</span>
            </div>
          </div>

          ${renderCheckoutShippingForm(country)}

          ${renderCheckoutPaymentSection()}
        </div>

        <aside class="surface summary-card">
          <h3>訂單摘要</h3>

          ${
            album
              ? `
                <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="cart-thumb">
                    <i class="bi bi-journal-richtext"></i>
                  </div>

                  <div>
                    <strong class="small">
                      ${escapeHTML(currentDraft()?.title || state.coverTitle)}
                    </strong>

                    <div class="small text-secondary mt-1">
                      ${selected.length} ${t("張明信片 × 本")} ${state.albumPrintQty}
                    </div>
                  </div>
                </div>

                ${state.addOnIds
                  .map((id) => {
                    const product = products.find((item) => item.id === id);

                    return product
                      ? `
                        <div class="summary-row">
                          <span>${escapeHTML(getProductText(product, "name"))}</span>
                          <strong>${money(product.price)}</strong>
                        </div>
                      `
                      : "";
                  })
                  .join("")}

                ${cartLines
                  .map(
                    (item) => `
                      <div class="summary-row">
                        <span>${escapeHTML(getProductText(item, "name"))} × ${item.qty}</span>
                        <strong>${money(item.price * item.qty)}</strong>
                      </div>
                    `,
                  )
                  .join("")}
              `
              : cartLines
                  .map(
                    (item) => `
                      <div class="summary-row">
                        <span>${escapeHTML(getProductText(item, "name"))} × ${item.qty}</span>
                        <strong>${money(item.price * item.qty)}</strong>
                      </div>
                    `,
                  )
                  .join("")
          }

          ${
            album && state.gift && state.giftWrap
              ? `
                <div class="summary-row">
                  <span>蝴蝶結禮物包裝</span>
                  <strong>${money(300)}</strong>
                </div>
              `
              : ""
          }

          ${
            album && state.gift && state.ribbon
              ? `
                <div class="summary-row">
                  <span>紀念緞帶</span>
                  <strong>${money(100)}</strong>
                </div>
              `
              : ""
          }

          <div class="summary-row">
            <span>商品小計</span>
            <strong>${money(subtotal)}</strong>
          </div>

          <div class="summary-row">
            <span>配送費</span>
            <strong>${money(shippingFee)}</strong>
          </div>

          <div class="summary-row total">
            <span>總計</span>
            <strong>${money(total)}</strong>
          </div>

          ${
            album
              ? `
                <div class="gift-checkout-options mt-4 pt-3 border-top">
                  <div class="form-check mb-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="checkoutGift"
                      ${state.gift ? "checked" : ""}
                    >

                    <label
                      class="form-check-label fw-semibold"
                      for="checkoutGift"
                    >
                      這是送給別人的禮物
                    </label>
                  </div>

                  ${
                    state.gift
                      ? `
                        <p class="small text-secondary mb-3">
                          禮物訂單不會在包裹內附上付款金額。
                        </p>

                        <label class="addon-option ${
                          state.giftWrap ? "selected" : ""
                        } mb-2">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="giftWrap"
                            ${state.giftWrap ? "checked" : ""}
                          >

                          <span class="flex-grow-1">
                            <strong class="d-block">
                              蝴蝶結禮物包裝
                            </strong>

                            <small class="text-secondary">
                              以包裝紙與蝴蝶結包裝相冊 · ${money(300)}
                            </small>
                          </span>
                        </label>

                        <label class="addon-option ${
                          state.ribbon ? "selected" : ""
                        } mb-3">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="ribbon"
                            ${state.ribbon ? "checked" : ""}
                          >

                          <span class="flex-grow-1">
                            <strong class="d-block">紀念緞帶</strong>

                            <small class="text-secondary">
                              為禮物加上柔和色調緞帶 · ${money(100)}
                            </small>
                          </span>
                        </label>

                        <div>
                          <label class="field-label" for="giftMessage">
                            小卡訊息（選填）
                          </label>

                          <textarea
                            class="form-control"
                            id="giftMessage"
                            rows="3"
                            maxlength="180"
                            placeholder="寫下一段想送給對方的話…"
                          >${escapeHTML(state.giftMessage)}</textarea>

                          <div class="form-text">
                            最多 180 字，會印在禮物小卡上。
                          </div>
                        </div>
                      `
                      : `
                        <p class="small text-secondary mb-0">
                          勾選後即可加購蝴蝶結包裝、紀念緞帶，
                          並附上一張小卡訊息。
                        </p>
                      `
                  }
                </div>
              `
              : ""
          }

          <button
            class="btn btn-primary w-100 mt-4"
            id="checkoutPlaceOrder"
          >
            確認訂單（模擬信用卡付款）
          </button>

          <p class="small text-secondary mt-2 mb-0">
            送出後會建立一筆本機模擬訂單。
          </p>
        </aside>
      </div>
    </div>
  `;
}
