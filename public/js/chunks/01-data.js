const MAX_POSTCARDS = 24;
const MAX_DRAFTS = 3;
const STEPS = [
  "建立草稿",
  "選取明信片",
  "編輯內容",
  "頁面排序",
  "設計封面",
  "預覽",
  "確認印刷",
];

// 明信片資料
const postcards = [...postcardBatch1, ...postcardBatch2, ...postcardBatch3].map(
  (item) => ({
    ...item,
    favorite: [1, 4, 7, 10].includes(item.id),
    acquired: true,
    decoration: "",
    text: item.note,
    includeDate: true,
    layout: "memory",
  }),
);

// ========================================
// Showcase 明信片多語系字典
// 只翻譯展示文字，不更動原始圖片與資料
// ========================================

const postcardTranslations = {
  ...postcardTranslationBatch1,
  ...postcardTranslationBatch2,
  ...postcardTranslationBatch3,
  ...postcardTranslationBatch4,
};

// ========================================
// 將翻譯套用至明信片
// 不覆蓋原始文字、圖片或其他資料
// ========================================

postcards.forEach((postcard) => {
  postcard.translations = postcardTranslations[postcard.id] || {};
});



/** Return a postcard field in the active UI language without changing stored data. */
function getPostcardFieldText(card, field) {
  const locale = state?.language || "zh-Hant";
  if (!card) return "";

  if (locale !== "zh-Hant") {
    const translated = card.translations?.[locale]?.[field];
    if (translated) return translated;
    const fieldTranslation = postcardFieldLabels[field]?.[card[field]]?.[locale];
    if (fieldTranslation) return fieldTranslation;
  }

  return card[field] || "";
}

// Showcase 相冊資料
const showcaseAlbums = {
  self: {
    title: "致勇敢的自己",
    desc: "異國生活裡的第一次、獨自前行的日常與成長。",
    coverImage: "/images/album_1.png",
    backImage: "/images/album_1.png",
    coverTitle: "致勇敢的自己",
    coverSubtitle: "謝謝那個沒有放棄的自己。",
    translations: {
      en: {
        title: "To My Brave Self",
        desc: "First experiences abroad, everyday moments of independence, and personal growth.",
        coverTitle: "To My Brave Self",
        coverSubtitle: "Thank you to the version of me who never gave up.",
      },
      ja: {
        title: "勇気を出した自分へ",
        desc: "異国での初めての経験、自分の足で歩む日々、そして成長の記録。",
        coverTitle: "勇気を出した自分へ",
        coverSubtitle: "あきらめなかった自分に、ありがとう。",
      },
    },

    postcardIds: [
      26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
      44, 45, 46,
    ],
  },

  travel: {
    title: "我們的第一次海外旅行",
    desc: "以山形為起點，收藏兩個人一起走過的風景。",
    coverImage: "/images/album_2.png",
    backImage: "/images/album_2.png",
    coverTitle: "我們的第一次海外旅行",
    coverSubtitle: "下次還想和你一起出發。",
    translations: {
      en: {
        title: "Our First Trip Abroad",
        desc: "Collecting the places we explored together, beginning in Yamagata.",
        coverTitle: "Our First Trip Abroad",
        coverSubtitle: "I want to set off with you again.",
      },
      ja: {
        title: "ふたりの初めての海外旅行",
        desc: "山形を出発点に、ふたりで歩いた風景を集めて。",
        coverTitle: "ふたりの初めての海外旅行",
        coverSubtitle: "次もまた、あなたと一緒に出かけたい。",
      },
    },

    postcardIds: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ],
  },

  family: {
    title: "成長日記",
    desc: "把和家人的溫馨日常裝訂起來。",
    coverImage: "/images/album_3.png",
    backImage: "/images/album_3.png",
    coverTitle: "金色回憶球的成長日記",
    coverSubtitle: "每一天都值得好好收藏。",
    translations: {
      en: {
        title: "Growing Up, Day by Day",
        desc: "Binding together the warm everyday moments shared with family.",
        coverTitle: "Golden Memories: A Growing-Up Journal",
        coverSubtitle: "Every day is worth keeping close.",
      },
      ja: {
        title: "成長日記",
        desc: "家族と過ごしたあたたかな日常を、一冊に綴って。",
        coverTitle: "金色の思い出玉の成長日記",
        coverSubtitle: "一日一日を、大切な思い出に。",
      },
    },

    postcardIds: [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
  },
};

// ========================================
// 檢查 Showcase 相冊資料
// 每本相冊最多 24 張，允許少於 24 張
// ========================================

function validateShowcaseAlbums() {
  // 取得所有有效的明信片 ID。
  const availableIds = new Set(postcards.map((postcard) => postcard.id));

  Object.entries(showcaseAlbums).forEach(([albumId, album]) => {
    const ids = album.postcardIds;

    // 檢查是否有明信片清單。
    if (!Array.isArray(ids)) {
      console.error(`相冊「${album.title}」缺少 postcardIds 陣列。`);
      return;
    }

    // 檢查明信片數量：最多 24 張，允許少於 24 張。
    if (ids.length > MAX_POSTCARDS) {
      console.warn(
        `相冊「${album.title}」最多只能有 ${MAX_POSTCARDS} 張明信片，目前有 ${ids.length} 張。`,
      );
    }

    // 檢查是否有不存在的明信片 ID。
    const missingIds = ids.filter((id) => !availableIds.has(id));

    if (missingIds.length > 0) {
      console.warn(`相冊「${album.title}」有不存在的明信片 ID：`, [
        ...new Set(missingIds),
      ]);
    }

    // 檢查是否有重複的明信片 ID。
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
      console.warn(`相冊「${album.title}」有重複的明信片 ID：`, [
        ...new Set(duplicateIds),
      ]);
    }

    // 檢查明信片 ID 是否為有效的正整數。
    const invalidIds = ids.filter((id) => !Number.isInteger(id) || id <= 0);

    if (invalidIds.length > 0) {
      console.warn(`相冊「${album.title}」包含無效的明信片 ID：`, invalidIds);
    }

    // 不檢查固定排列順序，允許每本相冊自由選擇與排列明信片。
    console.info(`相冊「${album.title}」資料檢查完成。`, {
      albumId,
      postcardCount: ids.length,
      maxPostcards: MAX_POSTCARDS,
    });
  });
}

// ========================================
// 依照指定 ID 取得相冊明信片
// ========================================

function getShowcasePostcards(albumId) {
  const album = showcaseAlbums[albumId];

  if (!album || !Array.isArray(album.postcardIds)) {
    console.warn(`找不到 Showcase 相冊或明信片清單：${albumId}`);
    return [];
  }

  // 依照 postcardIds 的順序取得明信片
  return album.postcardIds.map((id) => {
    const postcard = postcards.find((item) => item.id === id);

    if (!postcard) {
      console.warn(`相冊「${album.title}」找不到 ID 為 ${id} 的明信片。`);
    }

    return postcard;
  });
}

const state = {
  route: "home",
  step: 1,
  loggedIn: false,
  user: { name: "概念使用者", email: "" },
  drafts: [],
  currentDraftId: null,
  isCreatingDraft: false,
  newDraftTitle: "我的旅行相冊",
  selectedIds: [],
  filter: "all",
  locationFilter: "all",
  methodFilter: "all",
  dateFilter: "all",
  editorIndex: 0,
  currentLayout: "memory",
  coverStyle: "botanical",
  coverTitle: "我的旅行相冊",
  coverSubtitle: "把旅途中的小小發現收藏起來",
  coverImage: "",
  authorName: "",
  completedDate: new Date().toISOString().slice(0, 10),
  printDate: "",
  gift: false,
  giftWrap: false,
  ribbon: false,
  giftMessage: "",
  cart: [],
  wishlist: [],
  checkoutKind: "album",
  checkoutStep: 1,
  shippingFee: 0,
  order: null,
  shopFilter: "all",
  accountTab: "drafts",
  infoPage: "about",
  language: "zh-Hant",
  currency: "JPY",
  productImageIndex: 0,
  productQty: 1,
  albumShowcaseIndex: 0,
  activeShowcase: null,
  albumPrintQty: 1,
  addOnIds: [],
  addresses: [],
  editingAddressId: null,
  selectedDecoration: null,
  selectedDecorationId: null,
  locationContinent: "all",
  locationRegion: "all",
  locationPlace: "all",
};

const main = document.querySelector("#mainContent");
const siteHeader = document.querySelector("#siteHeader");
const siteFooter = document.querySelector("#siteFooter");
