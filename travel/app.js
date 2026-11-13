(() => {
  "use strict";

  const places = Array.isArray(window.TRAVEL_PLACES) ? window.TRAVEL_PLACES : [];
  const elements = {
    map: document.getElementById("map"),
    mapPanel: document.getElementById("map-panel"),
    list: document.getElementById("place-list"),
    search: document.getElementById("place-search"),
    filters: [...document.querySelectorAll(".filter-chip")],
    count: document.getElementById("visible-count"),
    mapCount: document.getElementById("map-count"),
    total: document.getElementById("total-count"),
    detail: document.getElementById("detail-panel"),
    detailContent: document.getElementById("detail-content"),
    detailIndex: document.getElementById("detail-index"),
    detailClose: document.getElementById("detail-close"),
    viewHokkaido: document.getElementById("view-hokkaido"),
    viewJapan: document.getElementById("view-japan"),
  };

  let region = "all";
  let search = "";
  let selectedId = null;
  let activeView = "hokkaido";
  const markers = new Map();
  const listButtons = new Map();
  const placeById = new Map(places.map(p => [p.id, p]));
  const hokkaidoBounds = L.latLngBounds([41.20, 139.75], [45.85, 145.85]);

  const map = L.map(elements.map, {
    zoomControl: false,
    scrollWheelZoom: false,
    minZoom: 4,
    maxZoom: 13,
    preferCanvas: true
  });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
  }).addTo(map);
  L.control.zoom({ position: "bottomright", zoomInTitle: "拡大", zoomOutTitle: "縮小" }).addTo(map);

  // Hokkaido with a little breathing room around the coast.
  function fitHokkaido(animate = true) {
    map.fitBounds(hokkaidoBounds, { padding: [30, 34], animate, maxZoom: 7 });
  }
  fitHokkaido(false);
  function updateMapLabels() {
    elements.map.classList.toggle("compact-labels", map.getZoom() <= 5);
  }
  map.on("zoomend", updateMapLabels);
  updateMapLabels();

  function textNode(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = String(value ?? "");
    return node;
  }

  function formatDate(value) {
    if (!value) return "日付未設定";
    const match = String(value).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
    if (match) return `${Number(match[1])}年${Number(match[2])}月${match[3] ? `${Number(match[3])}日` : ""}`;
    return String(value);
  }

  function sortedMemories(place) {
    return Array.isArray(place.memories)
      ? [...place.memories].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      : [];
  }

  function getLatestMemory(place) {
    return sortedMemories(place)[0] || null;
  }

  function excerpt(place) {
    const memory = getLatestMemory(place);
    return memory ? memory.summary || memory.title || "旅の記録を見る" : "記録はこれから追加されます";
  }

  function makeMarker(place) {
    const safeName = String(place.name).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[c]);
    const markerHtml = `<span class="pin-halo"></span><span class="pin-center"></span><span class="pin-name">${safeName}</span>`;
    const icon = L.divIcon({ html: markerHtml, className: "travel-pin", iconSize: [16, 16], iconAnchor: [8, 8], tooltipAnchor: [0, -10] });
    const marker = L.marker([place.lat, place.lng], { icon, title: `${place.name}の記録を見る`, keyboard: true, riseOnHover: true });
    marker.bindTooltip(() => {
      const wrap = document.createElement("div");
      wrap.className = "travel-tooltip-body";
      wrap.append(textNode("span", "tooltip-kicker", `${place.region} / ${place.roman}`));
      wrap.append(textNode("strong", "tooltip-title", place.name));
      wrap.append(textNode("span", "tooltip-description", excerpt(place)));
      return wrap;
    }, { direction: "top", offset: [0, -14], opacity: 1, className: "travel-tooltip" });
    marker.on("click", () => selectPlace(place.id, true));
    marker.addTo(map);
    markers.set(place.id, marker);
  }

  places.forEach(makeMarker);

  function matches(place) {
    const regionMatch = region === "all" || place.region === region;
    const needle = search.trim().toLocaleLowerCase();
    if (!needle) return regionMatch;
    const content = [place.name, place.roman, place.region, ...(place.memories || []).flatMap(m => [m.title, m.summary, m.body])].join(" ").toLocaleLowerCase();
    return regionMatch && content.includes(needle);
  }

  function renderList() {
    elements.list.replaceChildren();
    listButtons.clear();
    const filtered = places.filter(matches);
    elements.count.textContent = filtered.length;
    elements.mapCount.textContent = filtered.length;
    for (const place of filtered) {
      const index = String(places.indexOf(place) + 1).padStart(2, "0");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "place-item" + (place.id === selectedId ? " is-selected" : "");
      button.setAttribute("aria-label", `${place.name}の旅の記録を見る`);
      button.setAttribute("aria-current", place.id === selectedId ? "true" : "false");
      button.append(textNode("span", "place-index", index));
      const names = textNode("span", "place-names", "");
      names.append(textNode("strong", "place-name-ja", place.name));
      names.append(textNode("small", "place-name-en", place.roman));
      button.append(names);
      button.append(textNode("span", "place-region", place.region));
      button.append(textNode("span", "place-chevron", "↗"));
      button.addEventListener("click", () => selectPlace(place.id, true));
      button.addEventListener("mouseenter", () => markers.get(place.id)?.openTooltip());
      button.addEventListener("mouseleave", () => markers.get(place.id)?.closeTooltip());
      button.addEventListener("focus", () => markers.get(place.id)?.openTooltip());
      button.addEventListener("blur", () => markers.get(place.id)?.closeTooltip());
      elements.list.append(button);
      listButtons.set(place.id, button);
    }
    if (!filtered.length) {
      const empty = textNode("div", "no-results", "条件に一致する場所がありません。");
      empty.append(textNode("p", "", "地名や地域を変えて探してみてください。"));
      elements.list.append(empty);
    }
    for (const place of places) {
      const marker = markers.get(place.id);
      if (matches(place)) { if (!map.hasLayer(marker)) marker.addTo(map); }
      else if (map.hasLayer(marker)) map.removeLayer(marker);
    }
    refreshMarkerSelection();
  }

  function refreshMarkerSelection() {
    for (const place of places) {
      const element = markers.get(place.id)?.getElement();
      if (element) element.classList.toggle("pin-selected", place.id === selectedId);
      const button = listButtons.get(place.id);
      if (button) {
        button.classList.toggle("is-selected", place.id === selectedId);
        button.setAttribute("aria-current", place.id === selectedId ? "true" : "false");
      }
    }
  }

  function appendPicture(container, source, alt = "旅先の写真") {
    if (!source) return;
    const picture = document.createElement("figure");
    picture.className = "memory-picture";
    const image = document.createElement("img");
    image.src = source;
    image.alt = alt;
    image.loading = "lazy";
    image.addEventListener("error", () => { picture.remove(); });
    picture.append(image);
    container.append(picture);
  }

  function appendMemory(container, memory, i) {
    const article = document.createElement("article");
    article.className = "memory-article";
    const meta = textNode("div", "memory-meta", `NOTE ${String(i + 1).padStart(2, "0")}   ·   ${formatDate(memory.date)}`);
    article.append(meta);
    article.append(textNode("h3", "memory-title", memory.title || "旅の記録"));
    if (memory.summary) article.append(textNode("p", "memory-summary", memory.summary));
    if (memory.body) article.append(textNode("p", "memory-body", memory.body));
    if (Array.isArray(memory.photos)) {
      const photoGrid = document.createElement("div");
      photoGrid.className = "memory-photo-grid";
      memory.photos.forEach(p => {
        if (typeof p === "string") appendPicture(photoGrid, p);
        else if (p && typeof p === "object") appendPicture(photoGrid, p.src, p.alt || "旅先の写真");
      });
      if (photoGrid.children.length) article.append(photoGrid);
      // Photos with invalid paths are removed when their image fails to load.
    }
    if (Array.isArray(memory.tags) && memory.tags.length) {
      const tags = document.createElement("div");
      tags.className = "memory-tags";
      memory.tags.forEach(t => tags.append(textNode("span", "memory-tag", `# ${t}`)));
      article.append(tags);
    }
    container.append(article);
  }

  function renderDetails(place) {
    const index = places.indexOf(place) + 1;
    elements.detailIndex.textContent = ` / ${String(index).padStart(2, "0")}`;
    const root = document.createElement("div");
    root.className = "detail-inner";
    root.append(textNode("div", "detail-map-line", `${place.region}  ·  ${place.roman}`));
    root.append(textNode("h2", "detail-place-name", place.name));
    root.append(textNode("div", "detail-coordinates", `${place.lat.toFixed(4)}° N  /  ${place.lng.toFixed(4)}° E`));
    const separator = textNode("div", "detail-separator", "");
    root.append(separator);
    const memories = sortedMemories(place);
    if (memories.length) {
      root.append(textNode("div", "memory-count", `${memories.length} ${memories.length === 1 ? "MEMORY" : "MEMORIES"}`));
      memories.forEach((memory, i) => appendMemory(root, memory, i));
    } else {
      const empty = document.createElement("div");
      empty.className = "detail-empty";
      const icon = textNode("div", "empty-sun", "✳");
      icon.setAttribute("aria-hidden", "true");
      empty.append(icon);
      empty.append(textNode("h3", "", "この土地の記憶を、ここに。"));
      empty.append(textNode("p", "", "旅の日付や出来事、写真を追加すると、ここに思い出が表示されます。"));
      const hint = document.createElement("div");
      hint.className = "edit-hint";
      hint.append(textNode("span", "edit-hint-dot", ""));
      hint.append(textNode("span", "", "places.js から記録を追加できます"));
      empty.append(hint);
      root.append(empty);
    }
    elements.detailContent.replaceChildren(root);
    elements.detailContent.scrollTop = 0;
  }

  function selectPlace(id, recenter = false) {
    const place = placeById.get(id);
    if (!place) return;
    // When opened via a deep-link while filtered out, restore the full list.
    if (!matches(place)) {
      region = "all"; search = "";
      elements.search.value = "";
      elements.filters.forEach(btn => {
        const active = btn.dataset.region === "all";
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
    }
    selectedId = id;
    renderList();
    renderDetails(place);
    elements.detail.classList.add("is-open");
    elements.detail.setAttribute("aria-hidden", "false");
    elements.mapPanel.classList.add("has-detail");
    const marker = markers.get(id);
    marker?.closeTooltip();
    if (recenter) {
      if (map.getZoom() < 6 || activeView === "japan") map.flyTo([place.lat, place.lng], 7, { duration: 0.7 });
      else map.panTo([place.lat, place.lng], { animate: true, duration: 0.45 });
    }
    history.replaceState(null, "", `#${id}`);
    refreshMarkerSelection();
  }

  function closeDetails() {
    selectedId = null;
    elements.detail.classList.remove("is-open");
    elements.detail.setAttribute("aria-hidden", "true");
    elements.mapPanel.classList.remove("has-detail");
    refreshMarkerSelection();
    if (location.hash && placeById.has(decodeURIComponent(location.hash.slice(1)))) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function setRegion(next) {
    region = next;
    elements.filters.forEach(btn => {
      const active = btn.dataset.region === region;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    if (selectedId && !matches(placeById.get(selectedId))) closeDetails();
    renderList();
  }

  function changeView(next) {
    activeView = next;
    const hokkaido = next === "hokkaido";
    elements.viewHokkaido.classList.toggle("is-active", hokkaido);
    elements.viewJapan.classList.toggle("is-active", !hokkaido);
    elements.viewHokkaido.setAttribute("aria-pressed", String(hokkaido));
    elements.viewJapan.setAttribute("aria-pressed", String(!hokkaido));
    if (hokkaido) fitHokkaido();
    else map.flyTo([37.1, 137.5], 5, { duration: 0.8 });
  }

  elements.filters.forEach(btn => btn.addEventListener("click", () => setRegion(btn.dataset.region)));
  elements.search.addEventListener("input", () => {
    search = elements.search.value;
    if (selectedId && !matches(placeById.get(selectedId))) closeDetails();
    renderList();
  });
  elements.viewHokkaido.addEventListener("click", () => changeView("hokkaido"));
  elements.viewJapan.addEventListener("click", () => changeView("japan"));
  elements.detailClose.addEventListener("click", closeDetails);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && selectedId) closeDetails();
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      e.preventDefault(); elements.search.focus();
    }
  });
  window.addEventListener("hashchange", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (placeById.has(id)) selectPlace(id, false);
    else if (selectedId) closeDetails();
  });
  window.addEventListener("resize", () => map.invalidateSize());

  elements.total.innerHTML = `${places.length}<span>places</span>`;
  document.getElementById("copyright-year").textContent = new Date().getFullYear();
  renderList();
  const initialId = decodeURIComponent(location.hash.slice(1));
  if (placeById.has(initialId)) selectPlace(initialId, false);
})();
