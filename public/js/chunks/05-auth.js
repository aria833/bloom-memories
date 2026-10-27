function renderAuth() {
  const isSignup = state.authMode === "signup";
  const intended = state.returnTo || "studio";
  return `
  <div class="page-container">
    <section class="surface auth-layout">
      <div class="brand mb-4">
        <span class="brand-mark">
          <img
            class="brand-logo-image"
            src="/images/bloom-memories-mark.svg"
            alt=""
          />
          </span><span class="brand-name">Bloom Memories<span>Postcard Book</span></span></div><h1 class="mt-2">${isSignup ? "建立你的帳戶" : "歡迎回來"}</h1><p>${isSignup ? "建立帳戶後，就可以保存相冊草稿並繼續製作。" : "登入後就能回到原本的操作，繼續製作你的相冊。"}</p><form id="authForm"><div class="mb-3"><label class="field-label" for="authEmail">電子郵件</label><input class="form-control" id="authEmail" type="email" required placeholder="name@example.com" value="${escapeHTML(state.user.email)}"></div><div class="mb-3"><label class="field-label" for="authPassword">密碼</label><input class="form-control" id="authPassword" type="password" required minlength="4" placeholder="至少 4 個字元"></div>${isSignup ? '<div class="mb-3"><label class="field-label" for="authName">顯示名稱</label><input class="form-control" id="authName" required placeholder="你的名字"></div>' : '<div class="text-end mb-3"><button type="button" class="text-button small" id="forgotPassword">忘記密碼？</button></div>'}<button class="btn btn-primary w-100" type="submit">${isSignup ? "建立帳戶" : "登入"} <i class="bi bi-arrow-right ms-1"></i></button></form><div class="auth-switch">${isSignup ? "已經有帳戶？" : "還沒有帳戶？"} <button class="text-button" id="switchAuth">${isSignup ? "登入" : "註冊"}</button></div><div class="alert alert-light border small mt-4 mb-0"><i class="bi bi-info-circle me-1"></i>這是概念原型，登入狀態僅儲存在此瀏覽器，不會驗證真實帳戶。</div></section></div>`;
}
