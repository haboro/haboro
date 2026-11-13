/*
 * Reisen werden unabhängig von den Ortsnotizen gespeichert.
 * 旅行別モード用のデータ。stopIds は places.js の id または下記 TRAVEL_WAYPOINTS の id。
 * 「苫小牧」「池田」「網走」は旅行上の経由地のみで、都市別モードには追加していません。
 * Each trip may receive title, summary, body (string or { de, ja, en }), photos and tags.
 */
window.TRAVEL_WAYPOINTS = [
  { id: "tomakomai", name: "苫小牧", roman: "TOMAKOMAI", lat: 42.6340, lng: 141.6050 },
  { id: "ikeda", name: "池田", roman: "IKEDA", lat: 42.9292, lng: 143.4485 },
  { id: "abashiri", name: "網走", roman: "ABASHIRI", lat: 44.0206, lng: 144.2736 }
];

window.TRAVEL_TRIPS = [
  {
    id: "hokkaido-2019",
    year: 2019,
    title: { de: "Hokkaidō-Reise 2019", ja: "2019年 北海道旅行", en: "Hokkaido Journey 2019" },
    stopIds: ["rumoi", "haboro", "horokanai", "furano", "asahikawa"],
    color: "#bc7052",
    summary: "", // あとで実際の旅行の概要を追加
    body: "",
    photos: [],
    tags: []
  },
  {
    id: "hokkaido-2022",
    year: 2022,
    title: { de: "Hokkaidō-Reise 2022", ja: "2022年 北海道旅行", en: "Hokkaido Journey 2022" },
    stopIds: ["tomakomai", "ikeda", "kushiro", "abashiri", "monbetsu"],
    color: "#487c77",
    summary: "",
    body: "",
    photos: [],
    tags: []
  }
];
