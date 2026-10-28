function renderProductDetail(id) {
  const product = products.find((item) => item.id === id) || products[0];

  // 切換商品時，重設圖片索引與商品數量
  if (state.currentProductId !== product.id) {
    state.productImageIndex = 0;
    state.productQty = 1;
  }

  state.currentProductId = product.id;

  const isAddon = product.type === "add-on";
  const images = product.images || (product.image ? [product.image] : []);
  const imageCount = images.length;

  // 確保圖片索引不超出範圍
  if (state.productImageIndex >= imageCount || state.productImageIndex < 0) {
    state.productImageIndex = 0;
  }

  const currentImage = images[state.productImageIndex] || "";
  const related = products.filter((item) => item.id !== product.id).slice(0, 4);

  const wished = state.wishlist.includes(product.id);

  return `
    <div class="page-container">

      <!-- 返回商店 -->
      <div class="page-intro">
        <button class="text-button" data-route="shop">
          <i class="bi bi-arrow-left me-1"></i>
          返回商店
        </button>
      </div>

      <!-- 商品詳情 -->
      <section class="detail-layout">

        <!-- 商品圖片區 -->
        <div>
          <div
            class="detail-image product-gallery"
            data-gallery-index="${state.productImageIndex}"
          >

            <!-- 主圖與左右切換 -->
            <button
              type="button"
              class="gallery-arrow gallery-prev"
              data-gallery="-1"
              aria-label="上一張照片"
              ${imageCount <= 1 ? "disabled" : ""}
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <div class="product-image gallery-art">

              ${
                currentImage
                  ? `
                    <img
                      class="product-gallery-image"
                      src="${currentImage}"
                      alt="${escapeHTML(getProductText(product, "name"))}－第 ${
                        state.productImageIndex + 1
                      } 張商品照片"
                    >
                  `
                  : `
                    <div class="product-image-placeholder">
                      <i class="bi bi-image"></i>
                      <span>尚未提供商品圖片</span>
                    </div>
                  `
              }

              ${
                isAddon
                  ? `
                    <span class="badge text-bg-success product-badge fs-6">
                      限定加購
                    </span>
                  `
                  : ""
              }

            </div>

            <button
              type="button"
              class="gallery-arrow gallery-next"
              data-gallery="1"
              aria-label="下一張照片"
              ${imageCount <= 1 ? "disabled" : ""}
            >
              <i class="bi bi-chevron-right"></i>
            </button>

            <!-- 圓點切換 -->
            ${
              imageCount > 1
                ? `
                  <div class="gallery-dots">
                    ${images
                      .map(
                        (image, i) => `
                          <button
                            type="button"
                            class="${i === state.productImageIndex ? "active" : ""}"
                            data-gallery-index-button="${i}"
                            aria-label="第 ${i + 1} 張照片"
                            aria-pressed="${i === state.productImageIndex}"
                          ></button>
                        `,
                      )
                      .join("")}
                  </div>
                `
                : ""
            }

          </div>

          <!-- 商品縮圖 -->
          ${
            imageCount > 1
              ? `
                <div class="gallery-thumbnails">
                  ${images
                    .map(
                      (image, i) => `
                        <button
                          type="button"
                          class="${
                            i === state.productImageIndex ? "active" : ""
                          }"
                          data-gallery-index-button="${i}"
                          aria-label="查看第 ${i + 1} 張商品照片"
                          aria-pressed="${i === state.productImageIndex}"
                        >
                          <img
                            class="gallery-thumb-image"
                            src="${image}"
                            alt=""
                            loading="lazy"
                          >
                        </button>
                      `,
                    )
                    .join("")}
                </div>
              `
              : ""
          }

        </div>

        <!-- 商品文字與購買區 -->
        <div class="detail-copy">

          <span class="eyebrow">
            ${isAddon ? "ALBUM ADD-ON" : "SHOP ITEM"}
          </span>

          <h1 class="mt-2">
            ${escapeHTML(getProductText(product, "name"))}
          </h1>

          <p class="body-copy">
            ${escapeHTML(getProductText(product, "desc"))}
          </p>

          <div class="detail-price">
            ${money(product.price)}
          </div>

          ${
            isAddon
              ? `
                <div class="alert alert-light border small">
                  此商品僅限製作相冊時加購，無法獨立結帳。
                </div>

                <button
                  type="button"
                  class="btn btn-primary"
                  data-route="studio"
                >
                  前往製作相冊
                </button>
              `
              : `
                <div class="detail-buy-row">

                  <!-- 商品數量 -->
                  <div class="qty-control large">

                    <button
                      type="button"
                      data-product-qty="-1"
                      aria-label="減少數量"
                      ${state.productQty <= 1 ? "disabled" : ""}
                    >
                      −
                    </button>

                    <span>${state.productQty}</span>

                    <button
                      type="button"
                      data-product-qty="1"
                      aria-label="增加數量"
                      ${state.productQty >= 10 ? "disabled" : ""}
                    >
                      +
                    </button>

                  </div>

                  <!-- 加入購物車 -->
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-add-cart="${product.id}"
                    data-qty-add="${state.productQty}"
                  >
                    <i class="bi bi-bag-plus me-1"></i>
                    加入購物車
                  </button>

                  <!-- 願望清單 -->
                  <button
                    type="button"
                    class="btn ${
                      wished ? "btn-wish-active" : "btn-outline-primary"
                    }"
                    data-wishlist="${product.id}"
                  >
                    <i class="bi ${
                      wished ? "bi-heart-fill" : "bi-heart"
                    } me-1"></i>

                    ${wished ? "已加入願望清單" : "加入願望清單"}
                  </button>

                </div>
              `
          }

          <!-- 商品資訊 -->
          <div class="mt-4 pt-3 border-top">
            <h2 class="h6 fw-bold">商品資訊</h2>

            <div class="product-details-list small text-secondary pb-2 border-bottom">
              ${(Array.isArray(getProductText(product, "details"))
                ? getProductText(product, "details")
                : [getProductText(product, "details")]
              )
                .filter(Boolean)
                .map((detail) => `<p>${escapeHTML(detail)}</p>`)
                .join("")}
            </div>

            <p class="small text-secondary pt-2">
              本頁商品資料為作品集原型示意，非正式販售資訊。
            </p>
          </div>

        </div>
      </section>

      ${renderRelatedProducts(related)}
    </div>
  `;
}
