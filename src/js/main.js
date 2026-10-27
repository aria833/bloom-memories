import "bootstrap";
import "../scss/main.scss";
import {
  setLocale,
  setCurrency,
  t,
  localizeHTML,
  applyI18n,
  getCurrency,
  getLocale,
} from "./i18n.js";

Object.assign(window, {
  setLocale,
  setCurrency,
  t,
  localizeHTML,
  applyI18n,
  getCurrency,
  getLocale,
});

const appChunks = [
  "01-data-postcards-01.js",
  "01-data-postcards-02.js",
  "01-data-postcards-03.js",
  "01-data-translations-01.js",
  "01-data-translations-02.js",
  "01-data-translations-03.js",
  "01-data-translations-04.js",
  "postcard-translations.js",
  "01-data.js",
  "01-data-products.js",
  "02-core.js",
  "03-postcards.js",
  "04-studio-views.js",
  "04-studio-editor.js",
  "04-studio-later.js",
  "05-auth.js",
  "05-product-detail.js",
  "05-related-products.js",
  "05-account.js",
  "05-checkout-forms.js",
  "05-checkout.js",
  "05-order-info.js",
  "05-home.js",
  "05-render-router.js",
  "09-shop-cart-views.js",
  "06-click-events.js",
  "06-shop-account-events.js",
  "06-studio-events.js",
  "07-form-events.js",
  "07-decoration-events.js",
  "07-header-events.js",
  "08-showcase.js",
  "08-showcase-postcards.js",
  "08-showcase-pages.js"
];

async function loadApplicationChunks() {
  for (const chunk of appChunks) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `/js/chunks/${chunk}`;
      script.async = false;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error(`Unable to load application chunk: ${chunk}`));
      document.body.append(script);
    });
  }
}

loadApplicationChunks().catch((error) => {
  console.error(error);
  document.querySelector("#mainContent").innerHTML =
    '<p class="app-error">頁面載入失敗，請重新整理後再試一次。</p>';
});
