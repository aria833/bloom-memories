function renderRelatedProducts(related) {
  return `
      <!-- 相關商品 -->
      <section class="section-block related-products">

        <div class="section-heading-row">
          <div>
            <span class="eyebrow">YOU MAY ALSO LIKE</span>
            <h2 class="section-title mt-2">
              也許你會喜歡
            </h2>
          </div>
        </div>

        <div class="product-grid">

          ${related
            .map((item) => {
              const itemImages =
                item.images || (item.image ? [item.image] : []);

              const itemImage = itemImages[0] || "";

              return `
                  <article class="surface product-card product-card-button related-product-card">

                    <!-- 點擊商品卡片查看詳情 -->
                    <button
                      type="button"
                      class="related-product-main"
                      data-product-detail="${item.id}"
                      aria-label="${t("查看商品詳情")}：${escapeHTML(getProductText(item, "name"))}"
                    >

                      <div class="product-image">

                        ${
                          itemImage
                            ? `
                              <img
                                class="product-card-image"
                                src="${itemImage}"
                                alt="${escapeHTML(getProductText(item, "name"))}"
                                loading="lazy"
                              >
                            `
                            : `
                              <div class="product-image-placeholder">
                                <i class="bi bi-image"></i>
                              </div>
                            `
                        }

                        ${
                          item.type === "add-on"
                            ? `
                              <span class="badge text-bg-success product-badge fs-6">
                                限定加購
                              </span>
                            `
                            : ""
                        }

                      </div>

                      <h3>${escapeHTML(getProductText(item, "name"))}</h3>

                      <p>${escapeHTML(getProductText(item, "desc"))}</p>

                      <span class="price">
                        ${money(item.price)}
                      </span>

                    </button>

                    <!-- 相關商品操作按鈕 -->
                    ${
                      item.type === "add-on"
                        ? `
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-primary related-add-cart"
                            data-route="studio"
                          >
                            <i class="bi bi-journal-plus me-1"></i>
                            製作相冊時加購
                          </button>
                        `
                        : `
                          <button
                            type="button"
                            class="btn btn-sm btn-primary related-add-cart"
                            data-add-cart="${item.id}"
                            data-qty-add="1"
                          >
                            <i class="bi bi-bag-plus me-1"></i>
                            加入購物車
                          </button>
                        `
                    }

                  </article>
                `;
            })
            .join("")}

        </div>
      </section>

  `;
}
