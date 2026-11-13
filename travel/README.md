# Travel Atlas — 北海道版 v2 / Hokkaidō v2

GitHub Pages 対応の静的サイトです。HTML・CSS・JavaScriptだけで動作し、ビルドは不要です。

## v2 で追加した機能

- **言語切替**：ページ左上の `DE / 日本語 / EN` から切替。初期表示は必ずドイツ語です（ブラウザ言語とは独立）。サイトのUI、地名表記、空欄の案内、検索欄、旅行名が切り替わります。
- **都市別モード**：北海道の17地点。新しく幌加内を追加しました。
- **旅行別モード**：2019年（留萌・羽幌・幌加内・富良野・旭川）／2022年（苫小牧・池田・釧路・網走・紋別）の2旅行を試験収録。旅行を構成する都市を含む**回転した楕円形の領域**が地図上に表示され、ホバーで概要、クリックで旅行の詳細が開きます。左側の旅行一覧からも開けます。
- 旅行別モードの地図楕円は指定都市をすべて含む**概略範囲**で、実際の交通経路や正確な移動範囲を表すものではありません。
- **苫小牧・池田・網走**は旅行別モードの「訪問地」としてのみ登録しています。都市別一覧には含まれません。
- 言語切替・モード切替・検索・旅行の詳細・URL直接リンク・モバイルレイアウトに対応。

## ファイル構成

```text
index.html              GitHub Pages 用のトップページ
travel_hub_new.html     上記と同内容のHTML（従来のファイル名に合わせたもの）
styles.css               共通スタイル
app.js                   地図／言語／モードの処理
places.js                都市データ、都市ごとの記録
trips.js                 旅行データ、旅行のみの訪問地
photos/                  写真ファイルの保存先
```

**両方のHTMLを同じフォルダに置く必要はありません。** 既存サイトの `travel_hub_new.html` を更新する場合は、同名ファイルに上書きし、`styles.css`、`app.js`、`places.js` を更新、`trips.js` を追加してください。GitHub PagesでサイトのルートURL（`...github.io/.../`）からアクセスしたい場合は `index.html` も配置してください。HTMLのどちらもJS/CSSの**相対パス**を参照するので、HTMLから見て同じフォルダ階層に置いてください。

## 公開

1. HTML、CSS、JS、`photos/` をGitHubリポジトリへアップロード。
2. `Settings → Pages → Deploy from a branch` で `main` の `/ (root)` を指定。
3. `https://ユーザー名.github.io/リポジトリ名/` で `index.html` を、`.../travel_hub_new.html` で名前を付けたページを表示できます。

## ローカル確認

OpenStreetMapの地図タイルは `file://`（HTMLダブルクリック）で拒否されることがあります。フォルダを開いてターミナルから、Pythonがあれば以下を実行してください。

```bash
py -m http.server 8000
```

ブラウザで `http://localhost:8000/` または `http://localhost:8000/travel_hub_new.html` を開きます。

## 都市の記録の追加（places.js）

各都市の `memories: []` に記録を追加します。

```javascript
memories: [
  {
    date: "2019-08", // 例。実際の日付に置き換えてください
    title: {de: "Ein Reisetag", ja: "旅の日の記録", en: "A day of travel"},
    summary: {de: "Kurze Vorschau", ja: "ホバー時の概要", en: "Brief preview"},
    body: {de: "Reisetext", ja: "旅行の本文", en: "Travel journal"},
    photos: [{src: "photos/sample.jpg", alt: {de: "Aussicht", ja: "旅先の景色", en: "Scenery"}}],
    tags: ["鉄道", "北海道"]
  }
]
```

文章は `{de, ja, en}` の3言語形式、または**単純な文字列**でも登録できます。3言語のどれかが未設定の場合は日本語→英語→ドイツ語の順で存在する内容を表示します（自動翻訳は行いません）。都市の登録項目は `id, name, roman, region, lat, lng, memories` です。地域フィルタは道北／道央／道東です。

## 旅行の追加（trips.js）

`window.TRAVEL_TRIPS` に旅行オブジェクトを追加します。`stopIds` の地名IDは `places.js` 内、または `TRAVEL_WAYPOINTS` 内に定義してください。

```javascript
{
  id: "hokkaido-2025", // 既存と重複しないID
  year: 2025,
  title: {de: "Hokkaidō-Reise 2025", ja: "2025年 北海道旅行", en: "Hokkaido Journey 2025"},
  stopIds: ["otaru", "asahikawa", "furano"],
  color: "#718a56", // 任意の6桁16進カラー
  summary: {de: "", ja: "", en: ""},
  body: {de: "", ja: "", en: ""},
  photos: [{src: "photos/example.jpg", alt: "旅行の写真"}],
  tags: []
}
```

- `year` だけでもよく、旅行の日付・本文・写真は後から追加できます。
- 楕円はすべての `stopIds` の地理座標から計算します。訪問地を追加すると楕円の形状が自動更新されます。
- 現在の地図は単一の旅行に対して1つの楕円を描く方式です。飛び地など、広く離れた地点を含めると楕円も広くなります。
- 同じ地点を複数旅行で使っても問題ありません。

## URL直接リンク

都市は `#wakkanai`、旅行は `#trip-hokkaido-2019` で直接詳細を開けます。アクセス時に必要なモードへ自動切替します。

## 技術と地図利用

Leaflet 1.9.4、OpenStreetMap公式タイルを利用します。地図データの著作権表示は地図下部に表示します。Leaflet・フォント・地図は外部インターネット接続が必要です。OpenStreetMapのタイル利用規約に従ってください。
