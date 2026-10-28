function renderHome() {
  return `
  <!-- Hero區塊 -->
  <section class="hero-section">
    <div class="page-container hero-grid">
      <div class="hero-copy">
          <span class="eyebrow">A LITTLE BOOK OF YOUR JOURNEY</span>
          <h1 class="display-title mt-3 lh-sm">把旅途中的小小發現<br>收藏成一冊回憶</h1>
          <p class="body-copy">挑選 Pikmin Bloom 中的明信片、紀錄當時的心情，製作成可以翻閱、保存，也能送給朋友的實體相冊。</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" data-route="studio">開始製作 <i class="bi bi-arrow-right ms-1"></i>
            </button>
            <button class="btn btn-outline-primary" data-route="shop">瀏覽商品</button>
          </div>
          <div class="hero-note"><i class="bi bi-info-circle me-1"></i>獨立非官方概念作品，使用模擬資料展示體驗。
          </div>
        </div>
        <div class="hero-art">
          <div class="hero-orbit"></div>
          <div class="album-stack">
          <div class="album-back"></div>
          <div class="album-front">
            <div class="album-cover-art">
              <img src="/images/album_2.png" alt="" class="cover-photo">
            </div>
          </div>
        </div>
        <div class="floating-postcard"><div class="postcard-scene has-photo"><img class="postcard-photo" src="/images/sample-yamagata/yamagata_1.PNG" alt="山形旅行明信片照片"><span class="sample-photo-sticker" aria-hidden="true">✿</span></div><div class="floating-postcard-caption">Yamagata · 2025.12</div>
          </div>
        </div>
    </div>
  </section>
          
  <!-- 步驟 -->
  <section class="section-block">
    <div class="page-container">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">HOW IT WORKS</span>
          <h2 class="section-title mt-2">三個步驟，把回憶留在手邊</h2>
        </div>
        <p class="body-copy mb-0">不需要自己設計每一個版面，簡單編輯就能完成專屬相冊。</p>
      </div>
      <div class="steps-grid">
        <article class="surface step-card">
          <div class="step-number">01</div>
          <h3>挑選明信片</h3>
          <p>從收藏中挑出最想留住的片段。</p>
        </article>
        <article class="surface step-card">
          <div class="step-number">02</div>
          <h3>編輯專屬內容</h3>
          <p>加上一句回憶、日期或小小裝飾。</p>
        </article>
        <article class="surface step-card">
          <div class="step-number">03</div>
          <h3>確認並印製</h3>
          <p>預覽整本相冊，選擇自用或贈禮，再確認訂單。</p>
        </article>
      </div>
    </div>
  </section>
          
  <!-- 範例 -->        
  <section class="section-block">
    <div class="page-container">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">ALBUM SHOWCASE</span>
          <h2 class="section-title mt-2">每一本，都有自己的旅程</h2>
        </div>
        <button class="btn btn-outline-primary" data-route="studio">製作我的相冊 <i class="bi bi-arrow-right ms-1"></i></button>
      </div>
      <div class="showcase-grid">
        <button class="surface showcase-card showcase-button" data-showcase="self">
          <div class="showcase-image">
            <div class="showcase-cover-photo"><img src="/images/album_1.png" alt="旅行相冊範例照片"><span class="showcase-photo-sticker">✿</span></div>
          </div>
          <span class="eyebrow">FOR MYSELF</span>
          <h3>致勇敢的自己</h3>
          <p>收藏異國生活裡、獨自前行的日常與成長。</p>
          <span class="showcase-cta">翻閱範例 <i class="bi bi-arrow-up-right"></i></span>
        </button>
        <button class="surface showcase-card showcase-button" data-showcase="travel">
          <div class="showcase-image">
            <div class="showcase-cover-photo"><img src="/images/album_2.png" alt="山形旅行相冊範例照片"><span class="showcase-photo-sticker">✦</span></div>
          </div>
          <span class="eyebrow">FOR US</span>
          <h3>我們的第一次海外旅行</h3>
          <p>以山形為起點，紀錄一起走過的風景與共同體驗。</p>
          <span class="showcase-cta">翻閱範例 <i class="bi bi-arrow-up-right"></i></span>
        </button>
        <button class="surface showcase-card showcase-button" data-showcase="family">
          <div class="showcase-image">
            <div class="showcase-cover-photo"><img src="/images/album_3.png" alt="成長日記相冊範例照片"><span class="showcase-photo-sticker">♡</span></div>
          </div>
          <span class="eyebrow">FOR FAMILY</span>
          <h3>成長日記</h3>
          <p>把和家人的溫馨日常裝訂起來。</p>
          <span class="showcase-cta">翻閱範例 <i class="bi bi-arrow-up-right"></i></span>
        </button>
      </div>
    </div>
  </section>
            
  <!-- 送禮 -->        
  <section class="section-block">
    <div class="page-container">
      <div class="gift-panel">
        <div class="gift-illustration">
          <img src="/images/album_gift.png" alt="禮物範例" class="cover-photo">
        </div>
        <div>
        <span class="eyebrow">A GIFT OF MEMORIES</span>
        <h2 class="section-title mt-2">把一起走過的回憶，送給重要的人</h2>
        <p class="body-copy mt-3">加上禮物包裝與一段彼此都懂的話語，讓這本相冊成為一份帶著共同回憶的禮物。</p>
        <button class="btn btn-primary mt-2" data-route="studio">開始製作 <i class="bi bi-arrow-right ms-1"></i></button>
        </div>
      </div>
    </div>
  </section>
          
  <!-- 選購其他商品 -->        
  <section class="section-block">
    <div class="page-container">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">LITTLE EXTRAS</span>
          <h2 class="section-title mt-2">為回憶準備的小物</h2>
        </div>
        <button class="btn btn-outline-primary" data-route="shop">前往商店 <i class="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    <div class="product-grid keepsake-products">
  ${products
    .filter((product) => product.type === "general")
    .slice(0, 3)
    .map(
      (product) => `
        <button
          class="surface product-card product-card-button"
          data-product-detail="${product.id}"
        >
          <div class="product-image">
            <img
              class="product-card-image"
              src="${product.images?.[0] || ""}"
              alt="${escapeHTML(getProductText(product, "name"))}"
              loading="lazy"
            >
          </div>

          <h3>${escapeHTML(getProductText(product, "name"))}</h3>
          <p>${escapeHTML(getProductText(product, "desc"))}</p>
          <span class="price">${money(product.price)}</span>
        </button>
      `,
    )
    .join("")}
</div>
    </div>
  </section>`;
}
