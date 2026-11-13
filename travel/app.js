(() => {
  "use strict";

  const places = Array.isArray(window.TRAVEL_PLACES) ? window.TRAVEL_PLACES : [];
  const trips = Array.isArray(window.TRAVEL_TRIPS) ? window.TRAVEL_TRIPS : [];
  const waypoints = Array.isArray(window.TRAVEL_WAYPOINTS) ? window.TRAVEL_WAYPOINTS : [];
  const allStops = new Map([...places, ...waypoints].map(p => [p.id, p]));
  const placeById = new Map(places.map(p => [p.id, p]));
  const tripById = new Map(trips.map(t => [t.id, t]));

  const translations = {
    de: {
      pageTitle: "Reiseerinnerungen | Travel Atlas",
      description: "Ein persönlicher Reiseatlas: Erinnerungen an Orte und Reisen auf einer interaktiven Karte.",
      brand: "Reiseerinnerungen", navMap: "Karte entdecken", navEntries: "Erinnerungen",
      hero1: "Orte, die bleiben.", hero2: "Momente, die reisen.",
      intro1: "Jede Markierung erzählt von einem besuchten Ort.", intro2: "Entdecke Erinnerungen nach Orten oder ganzen Reisen.",
      heroCounter: "ORTE ZUM WIEDERENTDECKEN", heroBottom: "Der Reiseatlas beginnt in Hokkaidō.",
      sectionTitle: "Reiseatlas", viewBy: "ANSICHT", modePlaces: "Orte", modeTrips: "Reisen",
      instructionPlaces: "Punkte berühren für Vorschau, anklicken für Erinnerungen.",
      instructionTrips: "Ellipsen berühren für Vorschau, anklicken für die ganze Reise.",
      placesTitle: "Besuchte Orte", tripsTitle: "Meine Reisen", placeholderPlaces: "Ort suchen", placeholderTrips: "Jahr oder Station suchen",
      filterAll: "Alle", filterNorth: "Norden", filterCentral: "Zentrum", filterEast: "Osten",
      tripsIntro: "Eine Ellipse steht für eine Reise. Wähle das Jahr oder die Fläche auf der Karte.",
      viewHokkaido: "Hokkaidō", viewJapan: "Ganz Japan", legendPlaces: "Besuchte Orte", legendTrips: "Reisegebiete",
      unitPlaces: "ORTE", unitTrips: "REISEN", counterUnitPlaces: "Orte", counterUnitTrips: "Reisen",
      allCountPlaces: n => `${n} Orte in Hokkaidō erfasst`, allCountTrips: n => `${n} Reisen erfasst`,
      regionNorth: "Nord-Hokkaidō", regionCentral: "Zentral-Hokkaidō", regionEast: "Ost-Hokkaidō",
      noResults: "Keine passenden Einträge gefunden.", noResultsHint: "Bitte Suchbegriff oder Filter ändern.",
      emptyExcerpt: "Reiseerinnerungen folgen noch", openRecord: "Reiseerinnerung ansehen",
      emptyPlaceTitle: "Dieser Ort wartet auf seine Geschichte.", emptyPlaceBody: "Datum, Erlebnisse und Fotos können später hier ergänzt werden.",
      emptyTripTitle: "Diese Reise wartet auf ihre Geschichte.", emptyTripBody: "Füge später Erlebnisse, Bilder und persönliche Notizen hinzu.",
      placeEditHint: "Einträge in places.js ergänzen", tripEditHint: "Einträge in trips.js ergänzen",
      dateUnset: "Datum offen", note: "NOTIZ", notes: "ERINNERUNGEN", memory: "ERINNERUNG",
      memoryTitle: "Reiseerinnerung", photoAlt: "Foto von der Reise", trip: "REISE", stopList: "Registrierte Stationen",
      tripYear: "REISEJAHR", previewTrip: n => `${n} Stationen · Erinnerungen folgen`, selectPlace: name => `Erinnerungen zu ${name} ansehen`,
      selectTrip: name => `Reise ${name} ansehen`, mapAria: "Interaktive Karte der besuchten Orte und Reisen in Hokkaidō",
      close: "Schließen", brandAria: "Zur Übersicht", navAria: "Seitennavigation", modeAria: "Anzeigemodus",
      regionAria: "Region filtern", viewAria: "Kartenausschnitt", searchAria: "Ort oder Reise suchen",
      panelOverlinePlaces: "DESTINATIONS", panelOverlineTrips: "JOURNEYS",
      detailPlace: "ORTSNOTIZEN", detailTrip: "REISENOTIZEN", closing1: "Die Reise endet nicht mit der Heimkehr.",
      closing2: "Bilder, Worte und kleine Erinnerungen – hier finden sie ihren Platz.",
      footer: "Für die Orte, die in Erinnerung bleiben."
    },
    ja: {
      pageTitle: "旅の記憶｜Travel Atlas", description: "訪れた土地と思い出を、地図から辿る個人旅行記。",
      brand: "旅の記憶", navMap: "地図から探す", navEntries: "旅の記録",
      hero1: "あの日の景色に、", hero2: "また会いに行く。",
      intro1: "地図に残した、小さな旅の足あと。", intro2: "都市ごとでも、旅一回ごとでも、思い出を振り返れます。",
      heroCounter: "PLACES TO REMEMBER", heroBottom: "北海道から、旅の記録をはじめよう。",
      sectionTitle: "探索マップ", viewBy: "表示モード", modePlaces: "都市ごと", modeTrips: "旅行ごと",
      instructionPlaces: "点に触れてプレビュー / クリックで旅の記録を開く",
      instructionTrips: "楕円に触れてプレビュー / クリックで旅行全体の記録を開く",
      placesTitle: "訪れた場所", tripsTitle: "これまでの旅行", placeholderPlaces: "地名を探す", placeholderTrips: "年・訪問地で探す",
      filterAll: "すべて", filterNorth: "道北", filterCentral: "道央", filterEast: "道東",
      tripsIntro: "楕円が一回の旅行を表します。年を選ぶか、地図上の楕円をクリックしてください。",
      viewHokkaido: "北海道", viewJapan: "日本全体", legendPlaces: "訪れた場所", legendTrips: "旅行した地域",
      unitPlaces: "地点", unitTrips: "旅行", counterUnitPlaces: "地点", counterUnitTrips: "旅行",
      allCountPlaces: n => `北海道の${n}地点を収録`, allCountTrips: n => `${n}回の旅行を収録`,
      regionNorth: "道北", regionCentral: "道央", regionEast: "道東",
      noResults: "条件に一致する記録がありません。", noResultsHint: "検索語や条件を変えてみてください。",
      emptyExcerpt: "記録はこれから追加されます", openRecord: "旅の記録を見る",
      emptyPlaceTitle: "この土地の記憶を、ここに。", emptyPlaceBody: "旅の日付や出来事、写真を追加すると、ここに思い出が表示されます。",
      emptyTripTitle: "この旅行の記憶を、ここに。", emptyTripBody: "旅の日付や出来事、写真などをあとから追加できます。",
      placeEditHint: "places.js から記録を追加できます", tripEditHint: "trips.js から旅行記を追加できます",
      dateUnset: "日付未設定", note: "記録", notes: "件の記録", memory: "件の記録",
      memoryTitle: "旅の記録", photoAlt: "旅先の写真", trip: "旅行", stopList: "登録された訪問地",
      tripYear: "旅行年", previewTrip: n => `${n}地点 · 旅行記は追加予定`, selectPlace: name => `${name}の旅の記録を見る`,
      selectTrip: name => `${name}の旅行記を見る`, mapAria: "北海道の訪問地点と旅行を表示する地図",
      close: "記録を閉じる", brandAria: "旅の記憶 トップへ", navAria: "ページ内ナビゲーション", modeAria: "表示モード",
      regionAria: "地域で絞り込む", viewAria: "地図の範囲を切り替え", searchAria: "地名や旅行を検索",
      panelOverlinePlaces: "DESTINATIONS", panelOverlineTrips: "JOURNEYS",
      detailPlace: "訪問記録", detailTrip: "旅行記録", closing1: "旅は、帰ってきてからも続いている。",
      closing2: "写真も、言葉も、何気ない記憶も。この地図に少しずつ。",
      footer: "大切な場所を、いつまでも。"
    },
    en: {
      pageTitle: "Travel Memories | Travel Atlas", description: "A personal travel atlas of places, journeys, and memories.",
      brand: "Travel Memories", navMap: "Explore the map", navEntries: "Travel archive",
      hero1: "Places stay with us.", hero2: "Memories travel on.",
      intro1: "Every marker represents somewhere I've been.", intro2: "Revisit the memories by place or by journey.",
      heroCounter: "PLACES TO REMEMBER", heroBottom: "The travel atlas begins in Hokkaido.",
      sectionTitle: "The travel atlas", viewBy: "EXPLORE BY", modePlaces: "Places", modeTrips: "Trips",
      instructionPlaces: "Hover over a pin to preview; click to open its memories.",
      instructionTrips: "Hover over an ellipse to preview; click to explore the whole trip.",
      placesTitle: "Visited places", tripsTitle: "Past journeys", placeholderPlaces: "Find a place", placeholderTrips: "Search year or stop",
      filterAll: "All", filterNorth: "North", filterCentral: "Central", filterEast: "East",
      tripsIntro: "Each ellipse represents one trip. Choose a year or select an area on the map.",
      viewHokkaido: "Hokkaido", viewJapan: "All Japan", legendPlaces: "Visited places", legendTrips: "Trip areas",
      unitPlaces: "PLACES", unitTrips: "TRIPS", counterUnitPlaces: "places", counterUnitTrips: "trips",
      allCountPlaces: n => `${n} places in Hokkaido`, allCountTrips: n => `${n} trips recorded`,
      regionNorth: "Northern Hokkaido", regionCentral: "Central Hokkaido", regionEast: "Eastern Hokkaido",
      noResults: "No matching entries found.", noResultsHint: "Try another search or filter.",
      emptyExcerpt: "Memories will be added soon", openRecord: "View the travel notes",
      emptyPlaceTitle: "A place waiting for its story.", emptyPlaceBody: "Dates, stories and photographs can be added here later.",
      emptyTripTitle: "A journey waiting for its story.", emptyTripBody: "Add the stories, images and notes from this trip later.",
      placeEditHint: "Add notes in places.js", tripEditHint: "Add notes in trips.js",
      dateUnset: "Date not set", note: "NOTE", notes: "MEMORIES", memory: "MEMORY",
      memoryTitle: "Travel notes", photoAlt: "Travel photograph", trip: "TRIP", stopList: "Recorded stops",
      tripYear: "YEAR OF TRAVEL", previewTrip: n => `${n} stops · Memories to be added`, selectPlace: name => `View travel notes for ${name}`,
      selectTrip: name => `View notes from ${name}`, mapAria: "Interactive map of places and trips in Hokkaido",
      close: "Close details", brandAria: "Back to the travel atlas", navAria: "Page navigation", modeAria: "View mode",
      regionAria: "Filter by region", viewAria: "Map extent", searchAria: "Search places and trips",
      panelOverlinePlaces: "DESTINATIONS", panelOverlineTrips: "JOURNEYS",
      detailPlace: "PLACE NOTES", detailTrip: "TRIP NOTES", closing1: "A journey continues long after we return.",
      closing2: "Photographs, words, fleeting moments—collected here.",
      footer: "Made to remember the places that matter."
    }
  };

  let language = "de"; // Explicit default, independent of the browser's language.
  let mode = "places";
  let region = "all";
  let search = "";
  let selectedId = null;
  let activeView = "hokkaido";
  const $ = id => document.getElementById(id);
  const elements = {
    map: $("map"), mapPanel: $("map-panel"), list: $("place-list"), search: $("place-search"),
    filters: [...document.querySelectorAll(".filter-chip")], languages: [...document.querySelectorAll(".lang-btn")],
    count: $("visible-count"), mapCount: $("map-count"), total: $("total-count"),
    detail: $("detail-panel"), detailContent: $("detail-content"), detailIndex: $("detail-index"),
    detailKind: $("detail-kind"), detailClose: $("detail-close"),
    viewHokkaido: $("view-hokkaido"), viewJapan: $("view-japan"),
    modePlaces: $("mode-places"), modeTrips: $("mode-trips"), regionFilters: $("region-filters"), tripIntro: $("trip-intro"),
    panelTitle: $("panel-title"), panelOverline: $("panel-overline"), panelSummary: $("panel-summary"),
    legendName: $("legend-name"), legendSymbol: $("legend-symbol"), legendUnit: $("legend-unit"),
    instruction: $("map-instruction")
  };
  const t = key => translations[language][key] ?? translations.de[key] ?? key;
  function localized(value) {
    if (value == null) return "";
    if (typeof value !== "object" || Array.isArray(value)) return String(value);
    return String(value[language] || value.ja || value.en || value.de || "");
  }
  function displayName(place) {
    if (language === "ja") return place.name;
    if (language === "de" && place.id === "lake-akan") return "Akan-See";
    return String(place.roman).toLocaleLowerCase().replace(/(^|[\s-])([^\s-])/g, (_, pre, first) => pre + first.toLocaleUpperCase());
  }
  function regionName(value) {
    return t({ "道北": "regionNorth", "道央": "regionCentral", "道東": "regionEast" }[value] || "regionCentral");
  }
  function textNode(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = String(value ?? "");
    return node;
  }
  function formatDate(value) {
    if (!value) return t("dateUnset");
    const match = String(value).match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
    if (!match) return String(value);
    const [_, y, month, day] = match;
    if (language === "ja") return `${Number(y)}年${month ? `${Number(month)}月` : ""}${day ? `${Number(day)}日` : ""}`;
    if (language === "de") return day ? `${Number(day)}.${Number(month)}.${y}` : month ? `${Number(month).toString().padStart(2, "0")}.${y}` : y;
    return day ? `${y}-${month}-${day}` : month ? `${y}-${month}` : y;
  }
  const sortedMemories = place => Array.isArray(place.memories)
    ? [...place.memories].sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))) : [];
  const getLatestMemory = place => sortedMemories(place)[0] || null;
  const excerpt = place => {
    const note = getLatestMemory(place);
    return note ? localized(note.summary) || localized(note.title) || t("openRecord") : t("emptyExcerpt");
  };
  const escapeHTML = value => String(value).replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[s]);

  const hokkaidoBounds = L.latLngBounds([41.20, 139.75], [45.85, 145.85]);
  const map = L.map(elements.map, { zoomControl: false, scrollWheelZoom: false, minZoom: 4, maxZoom: 13, preferCanvas: true });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'
  }).addTo(map);
  const zoomControl = L.control.zoom({ position: "bottomright" }).addTo(map);
  map.createPane("tripAreas").style.zIndex = "420";
  const markers = new Map();
  const tripLayers = new Map();
  const listButtons = new Map();

  function fitHokkaido(animate = true) {
    map.fitBounds(hokkaidoBounds, { padding: [30, 34], animate, maxZoom: 7 });
  }
  fitHokkaido(false);
  function updateMapLabels() { elements.map.classList.toggle("compact-labels", map.getZoom() <= 5); }
  map.on("zoomend", updateMapLabels);
  updateMapLabels();

  function placeTooltip(place) {
    const wrap = textNode("div", "travel-tooltip-body", "");
    wrap.append(textNode("span", "tooltip-kicker", `${regionName(place.region)} / ${place.roman}`));
    wrap.append(textNode("strong", "tooltip-title", displayName(place)));
    wrap.append(textNode("span", "tooltip-description", excerpt(place)));
    return wrap;
  }
  function makeMarker(place) {
    const markerHtml = `<span class="pin-halo"></span><span class="pin-center"></span><span class="pin-name">${escapeHTML(displayName(place))}</span>`;
    const icon = L.divIcon({ html: markerHtml, className: "travel-pin", iconSize: [16, 16], iconAnchor: [8, 8], tooltipAnchor: [0, -10] });
    const marker = L.marker([place.lat, place.lng], { icon, title: t("selectPlace")(displayName(place)), keyboard: true, riseOnHover: true });
    marker.bindTooltip(() => placeTooltip(place), { direction: "top", offset: [0, -14], opacity: 1, className: "travel-tooltip" });
    marker.on("click", () => selectPlace(place.id, true));
    markers.set(place.id, marker);
  }
  places.forEach(makeMarker);

  // A rotated ellipse is constructed in EPSG:3857 projected metres. Its margin is
  // calculated from every listed stop, so all registered stops lie inside it.
  // These ellipses are approximate visual envelopes, not exact travelled routes.
  function ellipseFor(stops) {
    const projected = stops.map(p => L.CRS.EPSG3857.project(L.latLng(p.lat, p.lng)));
    const meanX = projected.reduce((n, p) => n + p.x, 0) / projected.length;
    const meanY = projected.reduce((n, p) => n + p.y, 0) / projected.length;
    let xx = 0, yy = 0, xy = 0;
    projected.forEach(p => { const dx = p.x - meanX, dy = p.y - meanY; xx += dx * dx; yy += dy * dy; xy += dx * dy; });
    const angle = 0.5 * Math.atan2(2 * xy, xx - yy);
    const c = Math.cos(angle), s = Math.sin(angle);
    const rotated = projected.map(p => ({ x: (p.x - meanX) * c + (p.y - meanY) * s, y: -(p.x - meanX) * s + (p.y - meanY) * c }));
    const xMin = Math.min(...rotated.map(p => p.x)), xMax = Math.max(...rotated.map(p => p.x));
    const yMin = Math.min(...rotated.map(p => p.y)), yMax = Math.max(...rotated.map(p => p.y));
    const cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2;
    let a = Math.max(45000, (xMax - xMin) / 2 + 32000);
    let b = Math.max(36000, (yMax - yMin) / 2 + 26000);
    const maxDistance = Math.max(...rotated.map(p => Math.hypot((p.x - cx) / a, (p.y - cy) / b)));
    const enlargement = Math.max(1, maxDistance / 0.91);
    a *= enlargement; b *= enlargement;
    const center = L.CRS.EPSG3857.unproject(L.point(meanX + cx * c - cy * s, meanY + cx * s + cy * c));
    const boundary = Array.from({ length: 144 }, (_, i) => {
      const theta = 2 * Math.PI * i / 144;
      const ux = cx + a * Math.cos(theta), uy = cy + b * Math.sin(theta);
      return L.CRS.EPSG3857.unproject(L.point(meanX + ux * c - uy * s, meanY + ux * s + uy * c));
    });
    return { center, boundary };
  }
  function tripStops(trip) {
    return (trip.stopIds || []).map(id => allStops.get(id)).filter(Boolean);
  }
  function tripTitle(trip) { return localized(trip.title) || String(trip.year); }
  function tripTooltip(trip) {
    const stops = tripStops(trip);
    const wrap = textNode("div", "travel-tooltip-body", "");
    wrap.append(textNode("span", "tooltip-kicker", `${t("trip")} / ${trip.year}`));
    wrap.append(textNode("strong", "tooltip-title", tripTitle(trip)));
    wrap.append(textNode("span", "tooltip-description", localized(trip.summary) || t("previewTrip")(stops.length)));
    wrap.append(textNode("span", "tooltip-stops", stops.map(displayName).join(" · ")));
    return wrap;
  }
  function makeTripLayer(trip) {
    const stops = tripStops(trip);
    if (!stops.length) return;
    const ellipse = ellipseFor(stops);
    const shape = L.polygon(ellipse.boundary, {
      pane: "tripAreas", color: trip.color || "#bb7154", weight: 3, opacity: 0.91,
      fillColor: trip.color || "#bb7154", fillOpacity: 0.17, className: "trip-ellipse", interactive: true
    });
    const badge = L.marker(ellipse.center, {
      icon: L.divIcon({
        className: "trip-year-pin", iconSize: [120, 33], iconAnchor: [60, 16],
        html: `<span class="trip-year-badge" style="--trip-color:${/^#[0-9a-f]{6}$/i.test(trip.color) ? trip.color : "#bb7154"}">${escapeHTML(trip.year)}</span>`
      }),
      title: t("selectTrip")(tripTitle(trip)), keyboard: true, riseOnHover: true
    });
    const open = () => selectTrip(trip.id, true);
    const tooltipOptions = { className: "travel-tooltip trip-tooltip", opacity: 1, direction: "top", offset: [0, -8] };
    shape.bindTooltip(() => tripTooltip(trip), tooltipOptions);
    badge.bindTooltip(() => tripTooltip(trip), { ...tooltipOptions, offset: [0, -17] });
    shape.on("mouseover", () => { shape.setStyle({ weight: 5, fillOpacity: 0.25 }); });
    shape.on("mouseout", () => refreshSelection());
    shape.on("click", open);
    badge.on("click", open);
    tripLayers.set(trip.id, { shape, badge, bounds: shape.getBounds(), center: ellipse.center });
  }
  trips.forEach(makeTripLayer);

  function matchesPlace(place) {
    const regionMatch = region === "all" || place.region === region;
    const needle = search.trim().toLocaleLowerCase();
    if (!needle) return regionMatch;
    const content = [place.name, place.roman, displayName(place), place.region, regionName(place.region),
      ...sortedMemories(place).flatMap(m => [localized(m.title), localized(m.summary), localized(m.body)])].join(" ").toLocaleLowerCase();
    return regionMatch && content.includes(needle);
  }
  function matchesTrip(trip) {
    const needle = search.trim().toLocaleLowerCase();
    if (!needle) return true;
    const stops = tripStops(trip);
    const content = [trip.id, trip.year, ...Object.values(trip.title || {}), tripTitle(trip),
      localized(trip.summary), localized(trip.body),
      ...stops.flatMap(p => [p.name, p.roman, displayName(p)])].join(" ").toLocaleLowerCase();
    return content.includes(needle);
  }
  function updateLayers() {
    for (const place of places) {
      const marker = markers.get(place.id);
      const shouldShow = mode === "places" && matchesPlace(place);
      if (shouldShow && !map.hasLayer(marker)) marker.addTo(map);
      if (!shouldShow && map.hasLayer(marker)) map.removeLayer(marker);
    }
    for (const trip of trips) {
      const layer = tripLayers.get(trip.id);
      if (!layer) continue;
      const shouldShow = mode === "trips" && matchesTrip(trip);
      for (const obj of [layer.shape, layer.badge]) {
        if (shouldShow && !map.hasLayer(obj)) obj.addTo(map);
        if (!shouldShow && map.hasLayer(obj)) map.removeLayer(obj);
      }
    }
  }
  function renderList() {
    elements.list.replaceChildren();
    listButtons.clear();
    const entries = mode === "places" ? places.filter(matchesPlace) : trips.filter(matchesTrip);
    elements.count.textContent = entries.length;
    elements.mapCount.textContent = entries.length;
    entries.forEach((entry, i) => {
      const isPlace = mode === "places";
      const index = isPlace ? places.indexOf(entry) + 1 : trips.indexOf(entry) + 1;
      const name = isPlace ? displayName(entry) : tripTitle(entry);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "place-item" + (entry.id === selectedId ? " is-selected" : "") + (isPlace ? "" : " trip-item");
      button.setAttribute("aria-label", isPlace ? t("selectPlace")(name) : t("selectTrip")(name));
      button.setAttribute("aria-current", entry.id === selectedId ? "true" : "false");
      button.append(textNode("span", "place-index", String(index).padStart(2, "0")));
      const names = textNode("span", "place-names", "");
      names.append(textNode("strong", "place-name-ja", name));
      names.append(textNode("small", "place-name-en", isPlace
        ? (language === "ja" ? entry.roman : entry.name)
        : tripStops(entry).map(displayName).join(" · ")));
      button.append(names);
      button.append(textNode("span", "place-region", isPlace ? regionName(entry.region) : String(entry.year)));
      button.append(textNode("span", "place-chevron", "↗"));
      button.addEventListener("click", () => isPlace ? selectPlace(entry.id, true) : selectTrip(entry.id, true));
      function toggleTooltip(on) {
        const layer = isPlace ? markers.get(entry.id) : tripLayers.get(entry.id)?.shape;
        if (layer && map.hasLayer(layer)) { if (on) layer.openTooltip(); else layer.closeTooltip(); }
      }
      button.addEventListener("mouseenter", () => toggleTooltip(true));
      button.addEventListener("mouseleave", () => toggleTooltip(false));
      button.addEventListener("focus", () => toggleTooltip(true));
      button.addEventListener("blur", () => toggleTooltip(false));
      elements.list.append(button);
      listButtons.set(entry.id, button);
    });
    if (!entries.length) {
      const empty = textNode("div", "no-results", t("noResults"));
      empty.append(textNode("p", "", t("noResultsHint")));
      elements.list.append(empty);
    }
    updateLayers();
    refreshSelection();
  }
  function refreshSelection() {
    for (const place of places) {
      const el = markers.get(place.id)?.getElement();
      if (el) el.classList.toggle("pin-selected", selectedId === place.id && mode === "places");
    }
    for (const trip of trips) {
      const layer = tripLayers.get(trip.id);
      if (!layer) continue;
      const selected = selectedId === trip.id && mode === "trips";
      layer.shape.setStyle({ weight: selected ? 5 : 3, fillOpacity: selected ? 0.28 : 0.17, opacity: selected ? 1 : 0.91 });
      layer.badge.getElement()?.classList.toggle("is-selected", selected);
    }
    for (const [id, button] of listButtons) {
      const selected = id === selectedId;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-current", selected ? "true" : "false");
    }
  }
  function appendPicture(container, source, alt) {
    if (!source) return;
    const figure = textNode("figure", "memory-picture", "");
    const img = document.createElement("img");
    img.src = source; img.alt = alt || t("photoAlt"); img.loading = "lazy";
    img.addEventListener("error", () => figure.remove());
    figure.append(img); container.append(figure);
  }
  function appendPhotos(container, photos) {
    if (!Array.isArray(photos) || !photos.length) return;
    const grid = textNode("div", "memory-photo-grid", "");
    for (const p of photos) {
      if (typeof p === "string") appendPicture(grid, p);
      else if (p && typeof p === "object") appendPicture(grid, p.src, localized(p.alt));
    }
    if (grid.children.length) container.append(grid);
  }
  function appendTags(container, tags) {
    if (!Array.isArray(tags) || !tags.length) return;
    const row = textNode("div", "memory-tags", "");
    tags.forEach(tag => row.append(textNode("span", "memory-tag", `# ${localized(tag)}`)));
    container.append(row);
  }
  function appendMemory(container, memory, i) {
    const article = textNode("article", "memory-article", "");
    article.append(textNode("div", "memory-meta", `${t("note")} ${String(i + 1).padStart(2, "0")}  ·  ${formatDate(memory.date)}`));
    article.append(textNode("h3", "memory-title", localized(memory.title) || t("memoryTitle")));
    if (localized(memory.summary)) article.append(textNode("p", "memory-summary", localized(memory.summary)));
    if (localized(memory.body)) article.append(textNode("p", "memory-body", localized(memory.body)));
    appendPhotos(article, memory.photos);
    appendTags(article, memory.tags);
    container.append(article);
  }
  function emptyNotice(root, kind) {
    const empty = textNode("div", "detail-empty", "");
    const glyph = textNode("div", "empty-sun", "✳"); glyph.setAttribute("aria-hidden", "true");
    empty.append(glyph);
    empty.append(textNode("h3", "", t(kind === "places" ? "emptyPlaceTitle" : "emptyTripTitle")));
    empty.append(textNode("p", "", t(kind === "places" ? "emptyPlaceBody" : "emptyTripBody")));
    const hint = textNode("div", "edit-hint", "");
    hint.append(textNode("span", "edit-hint-dot", ""));
    hint.append(textNode("span", "", t(kind === "places" ? "placeEditHint" : "tripEditHint")));
    empty.append(hint); root.append(empty);
  }
  function renderPlaceDetails(place) {
    elements.detailIndex.textContent = ` / ${String(places.indexOf(place) + 1).padStart(2, "0")}`;
    const root = textNode("div", "detail-inner", "");
    root.append(textNode("div", "detail-map-line", `${regionName(place.region)}  ·  ${place.roman}`));
    root.append(textNode("h2", "detail-place-name", displayName(place)));
    if (language !== "ja") root.append(textNode("p", "detail-subtitle", place.name));
    root.append(textNode("div", "detail-coordinates", `${place.lat.toFixed(4)}° N / ${place.lng.toFixed(4)}° E`));
    root.append(textNode("div", "detail-separator", ""));
    const memories = sortedMemories(place);
    if (memories.length) {
      root.append(textNode("div", "memory-count", `${memories.length} ${t(memories.length === 1 ? "memory" : "notes")}`));
      memories.forEach((memory, i) => appendMemory(root, memory, i));
    } else emptyNotice(root, "places");
    elements.detailContent.replaceChildren(root);
    elements.detailContent.scrollTop = 0;
  }
  function renderTripDetails(trip) {
    elements.detailIndex.textContent = ` / ${trip.year}`;
    const root = textNode("div", "detail-inner", "");
    root.append(textNode("div", "detail-map-line", `${t("trip")}  ·  ${trip.year}  ·  HOKKAIDŌ`));
    root.append(textNode("h2", "detail-place-name detail-trip-name", tripTitle(trip)));
    root.append(textNode("div", "detail-coordinates", `${t("tripYear")}: ${trip.year}`));
    root.append(textNode("div", "detail-separator", ""));
    root.append(textNode("h3", "trip-stops-heading", t("stopList")));
    const stops = textNode("ol", "trip-stops-list", "");
    tripStops(trip).forEach((stop, i) => {
      const row = textNode("li", "trip-stop", "");
      row.append(textNode("span", "trip-stop-num", String(i + 1).padStart(2, "0")));
      row.append(textNode("span", "trip-stop-name", displayName(stop)));
      if (language !== "ja") row.append(textNode("small", "trip-stop-ja", stop.name));
      stops.append(row);
    });
    root.append(stops);
    const hasContent = !!(localized(trip.summary) || localized(trip.body) || (trip.photos || []).length || (trip.tags || []).length);
    if (hasContent) {
      const article = textNode("article", "memory-article", "");
      if (localized(trip.summary)) article.append(textNode("p", "memory-summary", localized(trip.summary)));
      if (localized(trip.body)) article.append(textNode("p", "memory-body", localized(trip.body)));
      appendPhotos(article, trip.photos);
      appendTags(article, trip.tags);
      root.append(article);
    } else emptyNotice(root, "trips");
    elements.detailContent.replaceChildren(root);
    elements.detailContent.scrollTop = 0;
  }
  function showDetails() {
    elements.detailKind.textContent = t(mode === "places" ? "detailPlace" : "detailTrip");
    elements.detail.classList.add("is-open");
    elements.detail.setAttribute("aria-hidden", "false");
    elements.mapPanel.classList.add("has-detail");
    refreshSelection();
  }
  function selectPlace(id, recenter = false) {
    const place = placeById.get(id);
    if (!place) return;
    if (mode !== "places") setMode("places");
    if (!matchesPlace(place)) {
      region = "all"; search = ""; elements.search.value = "";
      syncFilterButtons();
    }
    selectedId = id; renderList(); renderPlaceDetails(place); showDetails();
    markers.get(id)?.closeTooltip();
    if (recenter) {
      if (map.getZoom() < 6 || activeView === "japan") map.flyTo([place.lat, place.lng], 7, { duration: 0.7 });
      else map.panTo([place.lat, place.lng], { animate: true, duration: 0.45 });
    }
    history.replaceState(null, "", `#${encodeURIComponent(id)}`);
  }
  function selectTrip(id, recenter = false) {
    const trip = tripById.get(id);
    if (!trip) return;
    if (mode !== "trips") setMode("trips");
    if (!matchesTrip(trip)) { search = ""; elements.search.value = ""; }
    selectedId = id; renderList(); renderTripDetails(trip); showDetails();
    tripLayers.get(id)?.shape.closeTooltip();
    if (recenter) {
      const layer = tripLayers.get(id);
      if (layer) {
        if (map.getZoom() <= 5 || activeView === "japan") map.fitBounds(layer.bounds, { padding: [64, 45], maxZoom: 7, animate: true });
        else map.panTo(layer.center, { animate: true, duration: .45 });
      }
    }
    history.replaceState(null, "", `#trip-${encodeURIComponent(id)}`);
  }
  function clearOwnHash() {
    if (placeById.has(decodeURIComponent(location.hash.slice(1))) ||
        (location.hash.startsWith("#trip-") && tripById.has(decodeURIComponent(location.hash.slice(6))))) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }
  function closeDetails(clearHash = true) {
    selectedId = null;
    elements.detail.classList.remove("is-open");
    elements.detail.setAttribute("aria-hidden", "true");
    elements.mapPanel.classList.remove("has-detail");
    if (clearHash) clearOwnHash();
    refreshSelection();
  }
  function syncFilterButtons() {
    elements.filters.forEach(btn => {
      const active = btn.dataset.region === region;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }
  function updateModeUI() {
    const isPlace = mode === "places";
    elements.modePlaces.classList.toggle("is-active", isPlace);
    elements.modeTrips.classList.toggle("is-active", !isPlace);
    elements.modePlaces.setAttribute("aria-pressed", String(isPlace));
    elements.modeTrips.setAttribute("aria-pressed", String(!isPlace));
    elements.regionFilters.hidden = !isPlace;
    elements.tripIntro.hidden = isPlace;
    elements.panelTitle.textContent = t(isPlace ? "placesTitle" : "tripsTitle");
    elements.panelOverline.textContent = t(isPlace ? "panelOverlinePlaces" : "panelOverlineTrips");
    elements.panelSummary.textContent = t(isPlace ? "allCountPlaces" : "allCountTrips")(isPlace ? places.length : trips.length);
    elements.legendName.textContent = t(isPlace ? "legendPlaces" : "legendTrips");
    elements.legendUnit.textContent = t(isPlace ? "unitPlaces" : "unitTrips");
    elements.legendSymbol.classList.toggle("legend-ellipse", !isPlace);
    elements.instruction.querySelector("[data-i18n]").textContent = t(isPlace ? "instructionPlaces" : "instructionTrips");
    elements.search.placeholder = t(isPlace ? "placeholderPlaces" : "placeholderTrips");
    elements.total.replaceChildren(document.createTextNode(String(isPlace ? places.length : trips.length)),
      textNode("span", "", t(isPlace ? "counterUnitPlaces" : "counterUnitTrips")));
  }
  function setMode(next) {
    if (mode === next) return;
    closeDetails();
    mode = next;
    region = "all"; search = ""; elements.search.value = "";
    syncFilterButtons();
    updateModeUI(); renderList();
  }
  function setRegion(next) {
    region = next;
    syncFilterButtons();
    if (selectedId && mode === "places" && !matchesPlace(placeById.get(selectedId))) closeDetails();
    renderList();
  }
  function changeView(next) {
    activeView = next;
    const isHokkaido = next === "hokkaido";
    elements.viewHokkaido.classList.toggle("is-active", isHokkaido);
    elements.viewJapan.classList.toggle("is-active", !isHokkaido);
    elements.viewHokkaido.setAttribute("aria-pressed", String(isHokkaido));
    elements.viewJapan.setAttribute("aria-pressed", String(!isHokkaido));
    if (isHokkaido) fitHokkaido(); else map.flyTo([37.1, 137.5], 5, { duration: .8 });
  }
  function updateLanguage(next) {
    if (!translations[next]) return;
    language = next;
    document.documentElement.lang = next;
    document.documentElement.dataset.lang = next;
    document.title = t("pageTitle");
    document.querySelector('meta[name="description"]').content = t("description");
    document.querySelectorAll("[data-i18n]").forEach(el => {
      if (el.id === "legend-name" || el.id === "panel-title") return; // Mode-specific strings updated below.
      if (el.closest("#map-instruction")) return;
      el.textContent = t(el.dataset.i18n);
    });
    elements.languages.forEach(btn => {
      const active = btn.dataset.lang === next;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    $("brand-link").setAttribute("aria-label", t("brandAria"));
    $("top-nav").setAttribute("aria-label", t("navAria"));
    document.querySelector(".mode-switch").setAttribute("aria-label", t("modeAria"));
    elements.regionFilters.setAttribute("aria-label", t("regionAria"));
    document.querySelector(".map-view-switch").setAttribute("aria-label", t("viewAria"));
    elements.search.setAttribute("aria-label", t("searchAria"));
    elements.map.setAttribute("aria-label", t("mapAria"));
    elements.detailClose.setAttribute("aria-label", t("close"));
    zoomControl._zoomInButton?.setAttribute("title", next === "ja" ? "拡大" : next === "en" ? "Zoom in" : "Vergrößern");
    zoomControl._zoomOutButton?.setAttribute("title", next === "ja" ? "縮小" : next === "en" ? "Zoom out" : "Verkleinern");
    for (const place of places) {
      const marker = markers.get(place.id);
      marker.setIcon(L.divIcon({
        html: `<span class="pin-halo"></span><span class="pin-center"></span><span class="pin-name">${escapeHTML(displayName(place))}</span>`,
        className: "travel-pin", iconSize: [16, 16], iconAnchor: [8, 8], tooltipAnchor: [0, -10]
      }));
      marker.options.title = t("selectPlace")(displayName(place));
    }
    for (const trip of trips) {
      const layer = tripLayers.get(trip.id);
      if (layer) layer.badge.options.title = t("selectTrip")(tripTitle(trip));
    }
    updateModeUI(); renderList();
    if (selectedId) {
      if (mode === "places") renderPlaceDetails(placeById.get(selectedId));
      else renderTripDetails(tripById.get(selectedId));
      elements.detailKind.textContent = t(mode === "places" ? "detailPlace" : "detailTrip");
    }
  }

  elements.languages.forEach(btn => btn.addEventListener("click", () => updateLanguage(btn.dataset.lang)));
  elements.modePlaces.addEventListener("click", () => setMode("places"));
  elements.modeTrips.addEventListener("click", () => setMode("trips"));
  elements.filters.forEach(btn => btn.addEventListener("click", () => setRegion(btn.dataset.region)));
  elements.search.addEventListener("input", () => {
    search = elements.search.value;
    if (selectedId) {
      const stillVisible = mode === "places" ? matchesPlace(placeById.get(selectedId)) : matchesTrip(tripById.get(selectedId));
      if (!stillVisible) closeDetails();
    }
    renderList();
  });
  elements.viewHokkaido.addEventListener("click", () => changeView("hokkaido"));
  elements.viewJapan.addEventListener("click", () => changeView("japan"));
  elements.detailClose.addEventListener("click", () => closeDetails());
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && selectedId) closeDetails();
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      e.preventDefault(); elements.search.focus();
    }
  });
  function openFromHash() {
    const fragment = decodeURIComponent(location.hash.slice(1));
    if (fragment.startsWith("trip-") && tripById.has(fragment.slice(5))) selectTrip(fragment.slice(5), false);
    else if (placeById.has(fragment)) selectPlace(fragment, false);
    else if (selectedId) closeDetails(false);
  }
  window.addEventListener("hashchange", openFromHash);
  window.addEventListener("resize", () => map.invalidateSize());
  $("copyright-year").textContent = new Date().getFullYear();
  updateLanguage("de");
  openFromHash();
})();
