function renderOrder() {
  if (!state.order)
    return `<div class="page-container"><div class="success-layout surface"><div class="success-mark"><i class="bi bi-box-seam"></i></div><h1>還沒有訂單</h1><p>完成相冊製作或購買商品後，這裡就會顯示訂單狀態。</p><button class="btn btn-primary" data-route="studio">開始製作相冊</button></div></div>`;
  const status = state.order.status || "訂單已建立";
  const statuses = ["訂單已建立", "印刷製作中", "已出貨", "已送達"];
  const current = Math.max(0, statuses.indexOf(status));
  return `<div class="page-container"><section class="success-layout surface"><div class="success-mark"><i class="bi bi-check-lg"></i></div><span class="eyebrow">ORDER CONFIRMED</span><h1 class="mt-2">訂單已建立！</h1><p>謝謝你把這段回憶交給我們。這是一筆模擬訂單，沒有實際付款或印刷作業。</p><div class="surface p-3 text-start mt-4"><div class="d-flex justify-content-between gap-3"><span class="small text-secondary">訂單編號</span><strong>${escapeHTML(state.order.id)}</strong></div><div class="d-flex justify-content-between gap-3 mt-3"><span class="small text-secondary">相冊名稱</span><strong>${escapeHTML(state.order.title)}</strong></div><div class="d-flex justify-content-between gap-3 mt-3"><span class="small text-secondary">訂單成立時間</span><strong>${new Date(state.order.createdAt).toLocaleString(state.language === "ja" ? "ja-JP" : state.language === "en" ? "en-US" : "zh-TW")}</strong></div><div class="d-flex justify-content-between gap-3 mt-3"><span class="small text-secondary">印刷本數</span><strong>${state.order.printQty || 0}</strong></div><div class="d-flex justify-content-between gap-3 mt-3"><span class="small text-secondary">訂單小計</span><strong>${money(state.order.total)}</strong></div></div><div class="status-timeline">${statuses.map((item, index) => `<div class="status-row ${index <= current ? "done" : ""}"><div class="status-dot"><i class="bi bi-check-lg"></i></div><div><h3>${item}</h3><p>${["訂單資料已建立。", "等待製作安排。", "出貨資訊將於後續更新。", "送達後完成此次旅程。"][index]}</p></div></div>`).join("")}</div><div class="d-flex gap-2 justify-content-center flex-wrap"><button class="btn btn-outline-primary" data-route="account">查看我的帳戶</button><button class="btn btn-outline-primary" data-route="home">返回首頁</button></div></section></div>`;
}
function renderInfo() {
  if (["faq", "shipping"].includes(state.infoPage)) {
    const panel = state.infoPage === "shipping" ? "shipping" : "faq";
    const faqItems = [
      [
        "相冊最多可以放幾張明信片？",
        `第一版原型每本最多 24 張，實際上限需要依印刷規格驗證。`,
      ],
      [
        "我可以中途離開再回來嗎？",
        "可以。草稿會保存在目前瀏覽器的本機儲存空間；這不是雲端同步。",
      ],
      [
        "已提交的相冊可以修改嗎？",
        "已提交的印刷內容不能直接編輯，但可以瀏覽完成品並再次下單。",
      ],
      [
        "可以一次印很多本嗎？",
        "可以在印刷確認時選擇數量，原型先提供 1–20 本的選擇。",
      ],
      [
        "限定加購商品可以單獨購買嗎？",
        "不可以。限定加購商品只能在製作相冊或相冊結帳流程中加入。",
      ],
      [
        "付款方式有哪些？",
        "此概念流程僅設計信用卡付款；原型不會收取真實款項或保存卡號。",
      ],
      [
        "客製化商品可以退貨或取消嗎？",
        "原型假設客製化商品不接受一般退貨，進入製作流程後不得取消；實際政策仍需依法確認。",
      ],
    ];

    //常見問題
    const faq = `<div class="accordion info-accordion " id="faqAccordion">${faqItems
      .map(
        (item, i) => `
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button ${i ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#faq${i}" aria-expanded="${i === 0}">${item[0]}</button>
    </h2>
    <div id="faq${i}" class="accordion-collapse collapse ${i === 0 ? "show" : ""}" data-bs-parent="#faqAccordion">
      <div class="accordion-body">${item[1]}</div>
    </div>
  </div>`,
      )
      .join("")}</div>`;

    //配送資訊
    const shipping = `<h3 class="h5 mt-4">地區</h3><ul><li>日本國內</li><li>台灣</li><li>其他亞洲地區：需逐一確認是否可配送</li><li>歐洲、北美與其他地區：目前不承諾支援</li></ul><h3 class="h5 mt-4">運費</h3><ul><li>日本國內：¥ 500 起</li><li>台灣：¥ 1,200 起</li><li>其他目的地：尚未估價</li></ul><h3 class="h5 mt-4">製作與配送時間</h3><ul><li>製作：約 7–14 個工作日</li><li>日本國內配送：約 2–5 個工作日</li><li>跨境配送：約 5–14 個工作日，可能因海關或物流延遲</li></ul><h3 class="h5 mt-4">追蹤資訊</h3><p>正式服務預計於出貨後提供追蹤編號；本原型不會連接真實物流系統。</p><h3 class="h5 mt-4">關稅與進口費用</h3><p>跨境訂單可能產生進口稅、關稅或代辦費用，實際負擔方式須依目的地規定確認。</p><h3 class="h5 mt-4">退換貨與取消政策</h3><p>客製化印刷商品原則上不接受因個人喜好而退貨；訂單進入製作流程後不得取消。若商品有瑕疵、印刷錯誤或運送損壞，正式政策需另行制定並遵守適用法律。</p>`;

    return `
  <div class="page-container">
    <section class="page-intro">
      <span class="eyebrow">FAQ & DELIVERY</span>
      <h1 class="mt-2">常見 QA</h1>
      <p>本原型僅用於展示概念。所有地區、費用、時間與政策均為假設示意。</p>
    </section>

    <section class="help-layout py-4">

      <!-- 上方分類頁籤 -->
      <ul
        class="nav nav-tabs help-tabs"
        id="infoTabs"
        role="tablist"
        aria-label="資訊分類"
      >
        <li class="nav-item" role="presentation">
          <button
            class="nav-link ${panel === "faq" ? "active" : ""}"
            id="faq-tab"
            data-bs-toggle="tab"
            data-bs-target="#faq-pane"
            type="button"
            role="tab"
            aria-controls="faq-pane"
            aria-selected="${panel === "faq"}"
          >
            <i class="bi bi-question-circle me-2"></i>
            常見問題
          </button>
        </li>

        <li class="nav-item" role="presentation">
          <button
            class="nav-link ${panel === "shipping" ? "active" : ""}"
            id="shipping-tab"
            data-bs-toggle="tab"
            data-bs-target="#shipping-pane"
            type="button"
            role="tab"
            aria-controls="shipping-pane"
            aria-selected="${panel === "shipping"}"
          >
            <i class="bi bi-truck me-2"></i>
            配送資訊
          </button>
        </li>
      </ul>

      <!-- 下方切換內容 -->
      <div class="tab-content help-tab-content">

        <div
          class="tab-pane fade ${panel === "faq" ? "show active" : ""}"
          id="faq-pane"
          role="tabpanel"
          aria-labelledby="faq-tab"
          tabindex="0"
        >
          <div class="surface p-4 p-md-5 info-content help-panel">
            ${faq}
          </div>
        </div>

        <div
          class="tab-pane fade ${panel === "shipping" ? "show active" : ""}"
          id="shipping-pane"
          role="tabpanel"
          aria-labelledby="shipping-tab"
          tabindex="0"
        >
          <div class="surface p-4 p-md-5 info-content help-panel">
            ${shipping}
          </div>
        </div>

      </div>
    </section>
  </div>
`;
  }
  if (state.infoPage === "privacy")
    return `<div class="page-container"><section class="page-intro"><span class="eyebrow">PRIVACY</span><h1 class="mt-2">隱私權政策</h1><p>本頁為概念原型的示意政策，不構成正式法律文件。</p></section><article class="surface p-4 p-md-5 info-content"><div class="alert alert-warning">本原型僅用於展示概念。請勿輸入真實付款資料或不必要的敏感個人資訊。</div><h2>資料處理方式</h2><p>此原型使用瀏覽器 localStorage 暫存登入狀態、相冊草稿、地址簿、購物車、願望清單及模擬訂單，以展示主要互動流程。</p><h2>資料儲存與刪除</h2><p>資料保留在目前使用的瀏覽器與裝置中。清除網站資料或瀏覽器儲存空間可能會移除這些原型資料。此原型沒有雲端帳戶同步功能。</p><h2>付款與第三方服務</h2><p>不會處理真實付款、收集信用卡號、連接遊戲帳戶或實際物流服務。聯絡表單也不會傳送訊息。</p><h2>正式服務注意事項</h2><p>若未來發展成正式服務，需依實際資料流程補齊資料控制者資訊、處理目的、法律依據、保存期限、第三方服務、跨境傳輸、使用者權利及聯絡方式，並由專業人士審閱。</p></article></div>`;
  if (state.infoPage === "contact")
    return `<div class="page-container"><section class="page-intro"><span class="eyebrow">INFORMATION</span><h1 class="mt-2">聯絡我們</h1><p>這是作品集中的非官方概念原型，表單只用來展示互動，不會真的寄出訊息。</p></section><section class="surface contact-form-wrap"><form id="contactForm" class="row g-3"><div class="col-md-6"><label class="form-label" for="contactName">姓名</label><input class="form-control" id="contactName" required placeholder="你的名字"></div><div class="col-md-6"><label class="form-label" for="contactEmail">電子郵件</label><input class="form-control" id="contactEmail" type="email" required placeholder="name@example.com"></div><div class="col-12"><label class="form-label" for="contactTopic">聯絡主題</label><select class="form-select" id="contactTopic"><option>相冊製作體驗</option><option>商品與加購</option><option>配送資訊</option><option>其他建議</option></select></div><div class="col-12"><label class="form-label" for="contactMessage">訊息內容</label><textarea class="form-control" id="contactMessage" rows="5" required placeholder="寫下你的問題或建議…"></textarea></div><div class="col-12"><button class="btn btn-primary" type="submit">送出表單 <i class="bi bi-arrow-right ms-1"></i></button><p class="small text-secondary mt-3 mb-0">展示用表單，不會傳送或儲存個人資料。</p></div></form></section></div>`;

  // 關於服務
  const content = {
    about: [
      "關於這項服務",
      "這是一個探索遊戲數位明信片如何轉化為實體相冊的獨立概念專案。使用者可以挑選明信片、添加文字與裝飾、調整順序，確認印刷樣式，模擬下單。",
      "本專案僅供個人作品集，並非官方服務，也沒有與 Nintendo 或 Pikmin Bloom 開發團隊合作。",
    ],
  }[state.infoPage] || ["服務資訊", "這是非官方概念專案。"];
  return `<div class="page-container"><section class="page-intro"><span class="eyebrow">INFORMATION</span><h1 class="mt-2">${content[0]}</h1></section><article class="surface p-4 p-md-5 info-content">${content
    .slice(1)
    .map((text) => `<p>${text}</p>`)
    .join("")}</article></div>`;
}

// 首頁
