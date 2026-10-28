// Product catalog and localized product copy.
const products = [
  {
    id: "sticker",
    name: "裝飾貼紙組",
    price: 660, // 約 NT$ 140
    type: "add-on",
    images: [
      "/images/products/sticker_1.png",
      "/images/products/sticker_2.png",
      "/images/products/sticker_3.png",
    ],
    desc: "皮克敏為你搬來了閃耀著高級光澤的金箔與精美貼紙！輕輕一貼，平凡的包裹與手帳立刻質感大躍升。無論是紀錄日常靈感，還是傳遞滿滿祝福，就讓皮克敏幫你把心意華麗亮眼地貼在最珍惜的角落吧！",
    details: [
      "規格：多款造型貼紙組（含金色標籤與精緻圖樣）",
      "材質：高級金箔、質感霧面燙金紙材",
      "用途：手帳裝飾、禮物包裝、信封封口、日常小物貼飾",
    ],
    translations: {
      en: {
        name: "Decorative Sticker Set",
        desc: "Pikmin team up to bring you premium shiny gold foil and gorgeous decorative stickers! A single touch instantly elevates everyday packages and journals. Whether recording daily ideas or sending warm blessings, let Pikmin place your sweet thoughts in your favorite spot!",
        details: [
          "Specifications: Multi-design sticker set (includes golden tags and fine patterns)",
          "Material: Premium gold foil, matte foil-stamped paper",
          "Use: Journaling, gift wrapping, envelope sealing, and accessory decoration",
        ],
      },
      ja: {
        name: "デコレーションステッカーセット",
        desc: "ピクミンたちが高級感あふれる輝く金箔と素敵なステッカーを運んできました！貼るだけで、いつもの小包や手帳が一気に上品な質感へ。日々のひらめきを記録するときも、温かい思いを届けるときも、ピクミンと一緒に大切な場所に華やかに貼りましょう！",
        details: [
          "仕様：デザインステッカーセット（ゴールドラベル・繊細なパターン入り）",
          "素材：高級金箔、マット箔押しペーパー",
          "用途：手帳のデコレーション、ギフト包装、封かんシール、小物の飾り付け",
        ],
      },
    },
  },
  {
    id: "stationery-set",
    name: "限定文具組",
    price: 1320, // 約 NT$ 280
    type: "general",
    images: [
      "/images/products/stationary_1.png",
      "/images/products/stationary_2.png",
      "/images/products/stationary_3.png",
    ],
    desc: "桌面上冒出了一座皮克敏文具基地！隨時為你的工作與學習補滿滿滿靈感。包含可愛的岩石皮克敏造型筆筒、花葉造型便籤紙、印章膠帶與質感皮質筆記本。讓皮克敏隊員陪伴你書寫、紀錄每一個精彩創意！",
    details: [
      "內容物：造型筆筒、隨身筆記本、葉子便籤、裝飾紙膠帶、造型鉛筆",
      "材質：優質木材、耐用軟膠、精選紙材",
      "用途：學習筆記、辦公紀錄、手帳創作、桌面紓壓裝飾",
    ],
    translations: {
      en: {
        name: "Limited Edition Stationery Set",
        desc: "A creative Pikmin workstation has sprouted on your desk! Packed with inspiration for work and study, including a cute Rock Pikmin pen holder, leaf sticky notes, stamp masking tape, and a textured leather notebook. Let the Pikmin squad accompany your creative writing journey!",
        details: [
          "Contents: Pen holder, portable notebook, leaf sticky notes, decorative masking tape, themed pencil",
          "Material: Premium wood, durable soft resin, select paper",
          "Use: Study notes, office tasks, journaling, and relaxing desk decor",
        ],
      },
      ja: {
        name: "限定文房具セット",
        desc: "デスクの上にピクミンたちの文房具基地が誕生！仕事や学習のインスピレーションをいつでもフルチャージ。キュートな岩ピクミンのペン立て、葉っぱメモ、スタンプ風テープ、上質なレザー調ノートがセットに。ピクミン隊員と一緒にアイデアを記録しましょう！",
        details: [
          "内容：ペン立て、ノート、葉っぱメモ、デコレーションテープ、デザイン鉛筆",
          "素材：上質木材、耐久ソフト樹脂、厳選ペーパー",
          "用途：学習ノート、オフィス記録、手帳づくり、デスクの癒しインテリア",
        ],
      },
    },
  },
  {
    id: "mug-set",
    name: "陶瓷馬克杯組",
    price: 3960, // 約 NT$ 840 (一組三個陶瓷杯)
    type: "general",
    images: [
      "/images/products/mug_1.png",
      "/images/products/mug_2.png",
      "/images/products/mug_3.png",
    ],
    desc: "「隊長，休息時間到了！」這款馬克杯組融入了藍皮克敏、紫皮克敏與岩石皮克敏等豐富意象。杯緣還附有小皮克敏立體公仔陪你喝飲料！無論是早上醒腦的黑咖啡，還是下午茶的奶茶，就讓皮克敏陪你享受溫馨放鬆的時光吧！",
    details: [
      "內容物：皮克敏造型陶瓷馬克杯（附專屬小公仔配件/攪拌棒）",
      "材質：高溫耐熱陶瓷、食品級矽膠/樹脂",
      "容量/規格：約 350ml 日常實用容量，附精美禮盒",
    ],
    translations: {
      en: {
        name: "Ceramic Mug Set",
        desc: "“Captain, coffee break time!” This mug set captures motifs of Blue Pikmin, Purple Pikmin, and Rock Pikmin. Featuring cute 3D Pikmin figures perched on the rim to keep you company. Enjoy your morning coffee or afternoon milk tea with Pikmin by your side!",
        details: [
          "Contents: Pikmin-themed ceramic mugs (includes 3D figure accessories/stirrers)",
          "Material: Heat-resistant ceramic, food-grade silicone/resin",
          "Capacity/Spec: Approx. 350ml everyday capacity; gift box included",
        ],
      },
      ja: {
        name: "陶器マグカップセット",
        desc: "「隊長、ブレイクタイムです！」青ピクミン、紫ピクミン、岩ピクミンのモチーフを詰め込んだマグカップセット。ふちにチョコンと乗った立体フィギュアがドリンクタイムを応援！朝のコーヒーも午後のミルクティーも、ピクミンと一緒に癒しのひとときをお過ごしください。",
        details: [
          "内容：ピクミンデザイン陶器マグカップ（専用ミニフィギュア／マドラー付き）",
          "素材：耐熱陶器、食品用シリコン／樹脂",
          "容量・仕様：約350ml（日常使いサイズ）、専用ギフトボックス入り",
        ],
      },
    },
  },
  {
    id: "brush-set",
    name: "個人護理組",
    price: 1980, // 約 NT$ 420
    type: "general",
    images: [
      "/images/products/toothBrush_1.png",
      "/images/products/toothBrush_2.png",
      "/images/products/toothBrush_3.png",
    ],
    desc: "早起刷牙不再枯燥！紅、黃、藍皮克敏頂著蓬鬆牙膏泡泡登場囉！專為日常清潔設計的精細毛牙刷與透光專屬漱口杯，搭配專用牙膏，讓皮克敏大隊幫你打擊邪惡蛀蟲，每天都帶著滿滿元氣迎向清新的一天！",
    details: [
      "內容物：皮克敏造型軟毛牙刷、繽紛透光漱口杯、專用清涼牙膏",
      "材質：極細柔軟刷毛、安全無毒 BPA-Free 塑料杯體",
      "用途：每日口腔清潔、居家衛浴質感擺飾",
    ],
    translations: {
      en: {
        name: "Personal Care Set",
        desc: "Brushing your teeth in the morning will never be boring again! Red, Yellow, and Blue Pikmin arrive wearing fluffy toothpaste-foam hats! Soft-bristle toothbrushes, translucent rinse cups, and specially formulated toothpaste let the Pikmin squad sweep away plaque for a fresh, energetic day!",
        details: [
          "Contents: Soft-bristle Pikmin toothbrushes, colorful translucent rinse cup, cooling toothpaste",
          "Material: Extra-fine soft bristles, safe non-toxic BPA-free plastic cup",
          "Use: Daily oral care, aesthetic bathroom decoration",
        ],
      },
      ja: {
        name: "パーソナルケアセット",
        desc: "毎朝の歯みがきタイムがもっと楽しく！頭に泡の帽子をのせた赤・黄・青ピクミンが登場。やわらか極細毛の歯ブラシとクリアなうがいコップ、爽快な歯みがき粉のセットで、ピクミンお掃除隊がお口をリフレッシュ！元気に新しい一日をスタートしましょう！",
        details: [
          "内容：ピクミンモチーフやわらか歯ブラシ、カラフル透明うがいコップ、専用クール歯みがき粉",
          "素材：極細毛、安全なBPAフリー樹脂コップ",
          "用途：毎日のオーラルケア、洗面所のおしゃれなインテリア",
        ],
      },
    },
  },
  {
    id: "hair-tie-set",
    name: "花蕾造型髮飾組",
    price: 1540, // 約 NT$ 330
    type: "add-on",
    images: [
      "/images/products/hairTie_1.png",
      "/images/products/hairTie_2.png",
      "/images/products/hairTie_3.png",
    ],
    desc: "吸取了滿滿的陽光，皮克敏的花朵在你的頭髮上綻放啦！包含水鑽寶石花朵髮圈、古典緞帶髮圈與幾何礦石款式。高彈力不拉扯髮絲，無論是綁馬尾、編髮還是配戴在手腕當作飾品點綴，隨時都能展現俏皮又精緻的風格！",
    details: [
      "內容物：經典造型髮圈/髮飾 4 入組（含金屬葉子吊飾與水鑽細節）",
      "材質：高彈力優質髮繩、緞布、水鑽、合金",
      "用途：頭髮造型、手腕配飾點綴",
    ],
    translations: {
      en: {
        name: "Bud & Flower Hair Accessory Set",
        desc: "Absorbing lots of sunshine, Pikmin flowers have bloomed in your hair! Features rhinestone gem flowers, classic ribbon scrunchies, and geometric stone designs. High-elasticity bands won't pull your hair. Perfect for ponytails, braids, or as a chic wrist accessory!",
        details: [
          "Contents: 4-piece hair tie & accessory set (includes metal leaf charms and rhinestone accents)",
          "Material: High-stretch elastic cord, satin fabric, rhinestones, alloy",
          "Use: Hair styling, wrist accessory accent",
        ],
      },
      ja: {
        name: "つぼみモチーフヘアアクセサリーセット",
        desc: "太陽の光をたっぷり浴びて、ピクミンの花があなたの髪に咲きました！ラインストーンの輝くお花、クラシックなサテンシュシュ、幾何学鉱石デザインの豪華セット。髪を傷めない高伸縮性ゴムで、ポニーテールやヘアアレンジ、手首のワンポイントにもぴったり！",
        details: [
          "内容：モチーフヘアゴム・アクセサリー4点セット（金属リーフチャーム・ラインストーン付き）",
          "素材：高伸縮性ヘアゴム、サテン生地、ラインストーン、合金",
          "用途：ヘアアレンジ、手首のワンポイントアクセサリー",
        ],
      },
    },
  },
  {
    id: "leaf-umbrella",
    name: "荷葉造型遮陽/雨傘",
    price: 3520, // 約 NT$ 750
    type: "general",
    images: [
      "/images/products/umbrella_1.png",
      "/images/products/umbrella_2.png",
    ],
    desc: "下雨天不用躲，像皮克敏一樣頂起一片大荷葉吧！以自然荷葉流線為設計靈感，頂端還帶有別致的嫩芽裝飾，傘面印有優雅的蓮花金線圖騰。具備超強防潑水與抗 UV 機能，撐開瞬間彷彿置身於皮克敏的微觀探險世界中！",
    details: [
      "規格：標準長傘設計（仿荷葉切邊與木質手把）",
      "功能：高密度防潑水面料、抗 UV 遮陽塗層、強化防風傘骨",
      "設計特色：荷葉葉脈流線傘面、蓮花金色線條",
    ],
    translations: {
      en: {
        name: "Lotus Leaf Umbrella",
        desc: "No need to fear the rain—open a big lotus leaf just like Blue Pikmin! Inspired by organic lotus leaf curves, topped with a cute sprout accent and featuring elegant gold-line lotus prints. Built with water-repellent and UV-blocking technology, stepping under it feels like entering Pikmin's micro adventure world!",
        details: [
          "Specifications: Standard stick/folding umbrella design (scalloped leaf edges, wooden handle)",
          "Functions: High-density water-repellent fabric, UV-blocking coating, reinforced windproof ribs",
          "Design Features: Lotus leaf-vein shaped canopy, gold printed lotus details",
        ],
      },
      ja: {
        name: "ハスの葉モチーフ日傘・雨傘",
        desc: "雨の日も隠れなくて大丈夫。青ピクミンのように大きなハスの葉を広げましょう！自然なハスの葉の流線デザインに、先端にはかわいらしい芽のアクセント。エレガントなゴールドラインの蓮プリント入り。強力な撥水＆UVカット機能を備え、傘を開けばまるでピクミンのミクロな大冒険の世界へ！",
        details: [
          "仕様：標準サイズ長傘／折りたたみ傘デザイン（ハスの葉スカラップ加工、木製手元）",
          "機能：高密度撥水生地、UVカット遮光コーティング、強化耐風骨組み",
          "デザイン特徴：葉脈イメージの傘面、ゴールドの蓮イラストディテール",
        ],
      },
    },
  },
];
