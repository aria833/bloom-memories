function renderShop() {
  const list = products.filter(
    (product) =>
      state.shopFilter === "all" || product.type === state.shopFilter,
  );

  return `
    <div class="page-container">
      <section class="page-intro">
        <span class="eyebrow">LITTLE EXTRAS</span>
        <h1 class="mt-2">為回憶添上一點小心意</h1>
        <p>部分商品只能在製作相冊時加購。</p>
      </section>

      <div class="shop-filters">
        <button class="filter-chip ${state.shopFilter === "all" ? "active" : ""}" data-shop-filter="all">全部商品</button>
        <button class="filter-chip ${state.shopFilter === "general" ? "active" : ""}" data-shop-filter="general">一般商品</button>
        <button class="filter-chip ${state.shopFilter === "add-on" ? "active" : ""}" data-shop-filter="add-on">限定加購</button>
      </div>

      <div class="shop-grid">
        ${list
          .map((product) => {
            const coverImage = product.images?.[0];

            return `
              <button
                class="surface shop-product shop-product-button"
                data-product-detail="${product.id}"
              >
                <div class="product-image mb-2">
                  ${
                    coverImage
                      ? `
                        <img
                          src="${escapeHTML(coverImage)}"
                          alt="${escapeHTML(getProductText(product, "name"))}"
                          class="shop-product-image"
                          loading="lazy"
                          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                        >
                        <i
                          class="bi ${product.icon || "bi-image"} shop-product-fallback"
                          style="display: none;"
                          aria-hidden="true"
                        ></i>
                      `
                      : `
                        <i
                          class="bi ${product.icon || "bi-image"}"
                          aria-hidden="true"
                        ></i>
                      `
                  }

                  ${
                    product.type === "add-on"
                      ? '<span class="badge text-bg-success product-badge fs-6">限定加購</span>'
                      : ""
                  }
                </div>

                <h3>${escapeHTML(getProductText(product, "name"))}</h3>
                <p>${escapeHTML(getProductText(product, "desc"))}</p>

                <div class="d-flex align-items-center justify-content-between gap-2">
                  <span class="fw-bold">${money(product.price)}</span>
                  <span class="btn btn-sm btn-outline-primary">查看商品</span>
                </div>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderCart() {
  const lines = state.cart
    .map((item) => ({
      ...products.find((product) => product.id === item.id),
      qty: item.qty,
    }))
    .filter((item) => item.id);
  const subtotal = lines.reduce((sum, item) => sum + item.price * item.qty, 0);

  return `
    <div class="page-container">
      <section class="page-intro">
        <span class="eyebrow">YOUR BAG</span>
        <h1 class="mt-2">購物車</h1>
        <p>一般商品可以單獨購買；限定加購商品請從 Album Studio 加入。</p>
      </section>
      ${
        lines.length
          ? `
        <div class="cart-layout">
          <div class="surface">
            ${lines
              .map(
                (item) => `
              <div class="cart-line">
                <div class="cart-thumb"><i class="bi ${item.icon}"></i></div>
                <div class="cart-line-copy">
                  <h3>${escapeHTML(getProductText(item, "name"))}</h3>
                  <p>${money(item.price)}</p>
                  <div class="cart-line-actions">
                    <div class="qty-control" aria-label="商品數量控制">
                      <button data-qty="-1" data-id="${item.id}" aria-label="減少數量">−</button>
                      <span class="small">${item.qty}</span>
                      <button data-qty="1" data-id="${item.id}" aria-label="增加數量">+</button>
                    </div>
                    <button class="text-button small cart-remove-button" data-remove-cart="${item.id}" type="button">
                      <i class="bi bi-trash me-1"></i>移除
                    </button>
                  </div>
                </div>
                <strong class="line-total small">${money(item.price * item.qty)}</strong>
              </div>
            `,
              )
              .join("")}
          </div>

          <aside class="surface summary-card">
            <h3>訂單摘要</h3>
            <div class="summary-row"><span>商品小計</span><strong>${money(subtotal)}</strong></div>
            <div class="summary-row"><span>配送費</span><strong>結帳時確認</strong></div>
            <div class="summary-row total"><span>小計</span><strong>${money(subtotal)}</strong></div>
            <button class="btn btn-primary w-100 mt-3" id="cartCheckout">前往結帳</button>
            <button class="btn btn-outline-primary w-100 mt-2" data-route="shop">繼續購物</button>
          </aside>
        </div>
      `
          : `
        <div class="surface empty-state">
          <i class="bi bi-bag"></i>
          <h3>購物車還是空的</h3>
          <p>去商店看看旅行書寫用品，或開始製作你的相冊。</p>
          <button class="btn btn-primary" data-route="shop">瀏覽商品</button>
        </div>
      `
      }
    </div>
  `;
}
