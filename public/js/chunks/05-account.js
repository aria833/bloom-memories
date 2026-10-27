function renderAccount() {
  if (!state.loggedIn) return renderAuth();
  const tabs = [
    { id: "drafts", label: "草稿相冊", icon: "bi-journal" },
    { id: "submitted", label: "已提交相冊", icon: "bi-box-seam" },
    { id: "orders", label: "訂單紀錄", icon: "bi-receipt" },
    { id: "wishlist", label: "商品願望清單", icon: "bi-heart" },
    { id: "profile", label: "個人資料", icon: "bi-person" },
    { id: "addresses", label: "地址簿", icon: "bi-geo-alt" },
  ];
  let content = "";
  const activeDrafts = state.drafts.filter(
    (draft) => draft.status !== "submitted",
  );
  if (state.accountTab === "drafts")
    content = activeDrafts.length
      ? `<div class="draft-list">${activeDrafts.map((draft) => `<article class="surface draft-card"><div class="product-image"><i class="bi bi-journal-richtext"></i></div><h3>${escapeHTML(draft.title)}</h3><p>上次修改：${new Date(draft.updatedAt).toLocaleDateString(state.language === "en" ? "en-US" : state.language === "ja" ? "ja-JP" : "zh-TW")} · ${draft.postcardIds.length} 張明信片</p><div class="d-flex gap-2"><button class="btn btn-sm btn-primary" data-resume-draft="${draft.id}">繼續編輯</button><button class="btn btn-sm btn-outline-primary" data-delete-draft="${draft.id}">刪除</button></div></article>`).join("")}</div><button class="btn btn-outline-primary mt-3" id="newDraft" ${activeDrafts.length >= MAX_DRAFTS ? "disabled" : ""}>建立新相冊 ${activeDrafts.length >= MAX_DRAFTS ? `（${state.language === "en" ? `limit reached: ${MAX_DRAFTS}` : state.language === "ja" ? `上限 ${MAX_DRAFTS}件に達しました` : `已達 ${MAX_DRAFTS} 本上限`}）` : ""}</button>`
      : `<div class="empty-state"><i class="bi bi-journal-plus"></i><h3>還沒有相冊草稿</h3><p>從選取明信片開始，把遊戲中的收藏變成實體回憶。</p><button class="btn btn-primary" id="newDraft">建立第一本相冊</button></div>`;
  if (state.accountTab === "submitted" || state.accountTab === "orders") {
    const allOrders = state.orders || (state.order ? [state.order] : []);
    const orders =
      state.accountTab === "submitted"
        ? allOrders.filter((order) => order.type === "album")
        : allOrders;
    content = orders.length
      ? `<div class="order-history-list">${orders.map((order) => `<article class="surface p-3 mb-3"><div class="d-flex justify-content-between gap-3 flex-wrap"><div><strong>訂單 ${escapeHTML(order.id)}</strong><p class="small text-secondary mt-1 mb-1">${escapeHTML(order.title)}</p><small class="text-secondary">成立時間：${new Date(order.createdAt).toLocaleString()}</small></div><span class="badge text-bg-light border">${escapeHTML(order.status)}</span></div><div class="d-flex gap-2 flex-wrap mt-3"><button class="btn btn-sm btn-primary" data-view-order="${order.id}">查看訂單狀態</button>${order.type === "album" ? `<button class="btn btn-sm btn-outline-primary" data-view-submitted-book="${order.id}">瀏覽完成品</button><button class="btn btn-sm btn-outline-primary" data-reorder-id="${order.id}">再次下單</button>` : ""}</div></article>`).join("")}</div>`
      : `<div class="empty-state"><i class="bi bi-box-seam"></i><h3>目前沒有已提交的訂單</h3><p>完成相冊並確認印刷後，訂單會顯示在這裡。</p><button class="btn btn-primary" data-route="studio">開始製作</button></div>`;
  }
  if (state.accountTab === "wishlist") {
    const items = products.filter((product) =>
      state.wishlist.includes(product.id),
    );
    content = items.length
      ? `<div class="product-grid">${items
          .map(
            (
              product,
            ) => `<article class="surface product-card"><div class="product-image">
  <img
    class="product-card-image"
    src="${product.images?.[0] || ""}"
    alt="${escapeHTML(getProductText(product, "name"))}"
    loading="lazy"
  >
</div><h3>${escapeHTML(getProductText(product, "name"))}</h3><p>${money(product.price)}</p><button class="btn btn-sm btn-outline-primary" data-product-detail="${product.id}">查看商品</button></article>`,
          )
          .join("")}</div>`
      : `<div class="empty-state"><i class="bi bi-heart"></i><h3>願望清單還是空的</h3><p>可以把喜歡的一般商品先收藏起來。</p><button class="btn btn-primary" data-route="shop">瀏覽商品</button></div>`;
  }
  if (state.accountTab === "profile")
    content = `<h2>個人資料</h2><label class="field-label">顯示名稱</label><input class="form-control mb-3" id="profileName" value="${escapeHTML(state.user.name)}"><label class="field-label">電子郵件</label><input class="form-control mb-3" value="${escapeHTML(state.user.email)}" disabled><button class="btn btn-primary" id="saveProfile">儲存資料</button>`;
  if (state.accountTab === "addresses") {
    const editing = state.addresses.find(
      (address) => address.id === state.editingAddressId,
    );
    content = `<form id="addressForm" class="surface p-3 mb-4"><h3 class="h5 mb-3">${editing ? "修改地址" : "新增地址"}</h3><div class="row g-3"><div class="col-md-6"><label class="form-label" for="addressLabel">地址名稱</label><input class="form-control" id="addressLabel" required value="${escapeHTML(editing?.label || "")}" placeholder="例如：住家"></div><div class="col-md-6"><label class="form-label" for="addressRecipient">收件人</label><input class="form-control" id="addressRecipient" required value="${escapeHTML(editing?.recipient || state.user.name)}"></div><div class="col-md-6"><label class="form-label" for="addressPhone">聯絡電話</label><input class="form-control" id="addressPhone" value="${escapeHTML(editing?.phone || "")}" placeholder="國碼＋電話"></div><div class="col-md-6"><label class="form-label" for="addressRegion">國家／地區</label><input class="form-control" id="addressRegion" required value="${escapeHTML(editing?.region || "")}" placeholder="例如：台灣"></div><div class="col-12"><label class="form-label" for="addressFull">完整地址</label><textarea class="form-control" id="addressFull" rows="2" required>${escapeHTML(editing?.address || "")}</textarea></div><div class="col-12 d-flex gap-2"><button class="btn btn-primary" type="submit">${editing ? "儲存修改" : "新增地址"}</button>${editing ? '<button class="btn btn-outline-secondary" type="button" id="cancelAddressEdit">取消</button>' : ""}</div></div></form>${
      state.addresses.length
        ? state.addresses
            .map(
              (
                address,
              ) => `<article class="surface p-3 mb-3 address-entry"><div class="d-flex justify-content-between gap-3 flex-wrap"><div><strong>${escapeHTML(address.label)}</strong><div class="small text-secondary mt-1">${escapeHTML(address.recipient)}${address.phone ? " · " + escapeHTML(address.phone) : ""}</div><p class="mb-0 mt-2">${escapeHTML(address.region)}
${address.postalCode ? ` ${escapeHTML(address.postalCode)}` : ""}
 · ${escapeHTML(address.address)}</p></div><div class="d-flex gap-2 flex-shrink-0 align-self-start"><button
  class="btn btn-sm btn-outline-primary address-action-btn"
  data-edit-address="${address.id}"
>
  修改
</button>
<button
  class="btn btn-sm btn-outline-danger address-action-btn"
  data-delete-address="${address.id}"
>
  刪除
</button></div></div></article>`,
            )
            .join("")
        : '<div class="empty-state"><i class="bi bi-geo-alt"></i><h3>尚未儲存地址</h3><p>新增常用地址，結帳時就能快速管理收件資訊。</p></div>'
    }`;
  }
  return `<div class="page-container"><section class="page-intro"><span class="eyebrow">YOUR SPACE</span><h1 class="mt-2">我的帳戶</h1><p>管理草稿相冊、已提交的訂單與商品願望清單。</p></section><div class="account-layout"><aside class="surface account-menu">${tabs.map((tab) => `<button class="${state.accountTab === tab.id ? "active" : ""}" data-account-tab="${tab.id}"><i class="bi ${tab.icon}"></i>${tab.label}</button>`).join("")}<button id="signOut"><i class="bi bi-box-arrow-right"></i>登出</button></aside><section class="surface account-main"><h2>${tabs.find((tab) => tab.id === state.accountTab)?.label || "我的帳戶"}</h2>${content}</section></div></div>`;
}
