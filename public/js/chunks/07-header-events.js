const mobileMenuButton = document.querySelector("#mobileMenuButton");
const mobileNav = document.querySelector("#mobileNav");
const mobileNavTools = document.querySelector("#mobileNavTools");
const headerActions = document.querySelector(".header-actions");
const languageSelectWrap = document.querySelector(".language-select-wrap");
const currencyDropdown = document.querySelector(".currency-dropdown");
const accountButton = headerActions?.querySelector('[data-route="account"]');
const mobileNavigationQuery = window.matchMedia("(max-width: 760px)");

function placeHeaderPreferences() {
  if (!headerActions || !mobileNavTools || !languageSelectWrap || !currencyDropdown) return;
  if (mobileNavigationQuery.matches) {
    mobileNavTools.append(languageSelectWrap, currencyDropdown);
  } else {
    headerActions.insertBefore(languageSelectWrap, accountButton || null);
    headerActions.insertBefore(currencyDropdown, accountButton || null);
    mobileNav.classList.add("d-none");
  }
}

placeHeaderPreferences();
mobileNavigationQuery.addEventListener("change", placeHeaderPreferences);

mobileMenuButton?.addEventListener("click", () => {
  const isOpening = mobileNav.classList.contains("d-none");
  mobileNav.classList.toggle("d-none", !isOpening);
  mobileMenuButton.setAttribute("aria-expanded", String(isOpening));
  const menuLabelKey = isOpening ? "關閉導覽選單" : "開啟導覽選單";
  mobileMenuButton.dataset.i18n = menuLabelKey;
  mobileMenuButton.setAttribute("aria-label", t(menuLabelKey));
  mobileMenuButton.innerHTML = `<i class="bi ${isOpening ? "bi-x-lg" : "bi-list"}"></i>`;
});
document.addEventListener("click", (event) => {
  const currencyOption = event.target.closest("[data-currency]");
  if (currencyOption) {
    state.currency = currencyOption.dataset.currency;
    setCurrency(state.currency);
    saveLocal();
    render();
    toast(t("currencyChanged"), t("settings"));
  }
});
document.addEventListener("change", (event) => {
  if (event.target.id === "languageSelect") {
    state.language = event.target.value;
    setLocale(state.language);
    saveLocal();
    render();
    toast(t("languageChanged"), t("settings"));
  }
});
document.addEventListener("submit", (event) => {
  if (event.target.id === "contactForm") {
    event.preventDefault();
    toast("這是展示用表單，訊息沒有實際送出。", "已完成示意");
    event.target.reset();
  }
});
