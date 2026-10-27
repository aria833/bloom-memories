/**
 * Translation utilities for Bloom Memories.
 * Every locale lives in its own dictionary. Rendered phrases are wrapped with
 * data-i18n attributes, so translation is driven by markup rather than blind
 * global string replacement.
 */
import zhHant from "./locales/zh-Hant.js";
import en from "./locales/en.js";
import ja from "./locales/ja.js";

const dictionaries = { "zh-Hant": zhHant, en, ja };
const phraseKeys = [
  ...new Set(
    Object.values(dictionaries).flatMap((locale) =>
      Object.keys(locale.phrases || {}),
    ),
  ),
]
  .filter((key) => key.length > 1)
  .sort((a, b) => b.length - a.length);
const phrasePattern = phraseKeys.length
  ? new RegExp(phraseKeys.map(escapeRegExp).join("|"), "g")
  : null;
let activeLocale = "zh-Hant";
let activeCurrency = "JPY";

/** Escape dictionary phrases before compiling them into a matching expression. */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Select a supported language and keep the document's language metadata in sync. */
export function setLocale(locale = "zh-Hant") {
  activeLocale = dictionaries[locale] ? locale : "zh-Hant";
  document.documentElement.lang = activeLocale;
  document.documentElement.dataset.locale = activeLocale;
}

/** Return the active language. */
export function getLocale() {
  return activeLocale;
}

/** Select a supported display currency for mock prices. */
export function setCurrency(currency = "JPY") {
  activeCurrency = ["JPY", "TWD", "USD"].includes(currency) ? currency : "JPY";
}

/** Return the active display currency. */
export function getCurrency() {
  return activeCurrency;
}

/** Resolve a dictionary key, with Traditional Chinese as the fallback. */
export function t(key) {
  const locale = dictionaries[activeLocale];
  return (
    locale?.[key] ??
    locale?.phrases?.[key] ??
    dictionaries["zh-Hant"]?.phrases?.[key] ??
    key
  );
}

/** Translate an element already marked with data-i18n. */
function translateElement(element) {
  const key = element.getAttribute("data-i18n");
  const attribute = element.getAttribute("data-i18n-attr");

  // Attribute-only labels must not replace icons or visible button text.
  if (key && !attribute) element.textContent = t(key);
  if (attribute && key) element.setAttribute(attribute, t(key));
}

/** Apply translations to existing static markup (header, footer, and controls). */
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach(translateElement);
  if (root.matches?.("[data-i18n]")) translateElement(root);
}

/**
 * Add data-i18n spans to recognized phrases inside an HTML template.
 * This preserves surrounding markup and makes the phrase key visible in HTML.
 */
export function localizeHTML(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  if (!phrasePattern) return wrapper.innerHTML;

  // Mark exact dictionary matches in translatable attributes such as placeholder and aria-label.
  const phraseKeySet = new Set(phraseKeys);
  wrapper.querySelectorAll("*").forEach((element) => {
    if (element.hasAttribute("data-i18n")) return;
    for (const attribute of ["placeholder", "title", "aria-label", "alt"]) {
      const value = element.getAttribute(attribute)?.trim();
      if (value && phraseKeySet.has(value)) {
        element.dataset.i18n = value;
        element.dataset.i18nAttr = attribute;
        break;
      }
    }
  });

  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (
        !node.nodeValue?.trim() ||
        node.parentElement?.closest("script, style, textarea")
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      phrasePattern.lastIndex = 0;
      return phrasePattern.test(node.nodeValue)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  // Reset the global expression after each test so the next node starts at index zero.
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    phrasePattern.lastIndex = 0;
    // HTML template indentation is not meaningful in normal text nodes. Normalize it so
    // dictionary phrases still match when a sentence spans formatted template lines.
    // Preserve intentional line breaks inside editable postcard notes and preformatted areas.
    const preserveWhitespace = node.parentElement?.closest(
      "pre, textarea, .editor-note, .postcard-message-overlay, .postcard-note",
    );
    const text = preserveWhitespace
      ? node.nodeValue
      : node.nodeValue
          .replace(/\s+/g, " ")
          .replace(/([，。；：、！？])\s+/g, "$1");

    // Option labels need a direct attribute because span elements are invalid inside <option>.
    if (
      node.parentElement?.tagName === "OPTION" &&
      phraseKeys.includes(text.trim())
    ) {
      node.parentElement.dataset.i18n = text.trim();
      node.parentElement.textContent = t(text.trim());
      return;
    }

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = phrasePattern.exec(text)) !== null) {
      if (match.index > lastIndex)
        fragment.append(
          document.createTextNode(text.slice(lastIndex, match.index)),
        );
      const span = document.createElement("span");
      span.dataset.i18n = match[0];
      span.textContent = t(match[0]);
      fragment.append(span);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length)
      fragment.append(document.createTextNode(text.slice(lastIndex)));
    node.replaceWith(fragment);
  });
  return wrapper.innerHTML;
}
