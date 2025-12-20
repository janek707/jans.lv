const grid = document.getElementById("projectsGrid");
const qEl = document.getElementById("q");
const catEl = document.getElementById("category");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clear");
const resultsEl = document.getElementById("results");

function esc(s="") {
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function normalize(items){
  return (items || []).map(p => ({
    slug: p.slug,
    title: p.title || "",
    excerpt: p.excerpt || "",
    date: p.date || "",
    status: (p.status || "STABLE").toUpperCase(),
    category: p.category || "Uncategorized",
    tags: Array.isArray(p.tags) ? p.tags : [],
    cover: p.cover || "",
    featured: !!p.featured
  }));
}

function sortProjects(items){
  // featured first, then date desc, then title
  return items.slice().sort((a,b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const da = a.date ? Date.parse(a.date) : 0;
    const db = b.date ? Date.parse(b.date) : 0;
    if (db !== da) return db - da;
    return a.title.localeCompare(b.title);
  });
}

function cardHTML(p){
  const tags = (p.tags || []).slice(0, 3);
  const href = `/projects/${p.slug}/`;
  const status = esc(p.status || "STABLE");
  const cover = esc(p.cover || "");

  return `
  <a class="card" href="${href}">
    <div class="cover">
      <img loading="lazy" src="${cover}" alt="${esc(p.title)}">
    </div>
    <div class="body">
      <h3>${esc(p.title)}</h3>
      <p class="excerpt">${esc(p.excerpt)}</p>

      <div class="tags">
        ${tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}
      </div>

      <div class="meta">
        <div class="status">STATUS: <b class="${status}">${status}</b></div>
        <div class="cta">View documentation →</div>
      </div>
    </div>
  </a>`;
}

function setOptions(selectEl, values, allLabel){
  const uniq = [...new Set(values)].sort((a,b) => a.localeCompare(b));
  selectEl.innerHTML = [
    `<option value="">${esc(allLabel)}</option>`,
    ...uniq.map(v => `<option value="${esc(v)}">${esc(v)}</option>`)
  ].join("");
}

function matchText(p, q){
  if (!q) return true;
  const hay = [
    p.title, p.excerpt, p.category, p.status,
    ...(p.tags || [])
  ].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

function applyFilters(all){
  const q = qEl.value.trim();
  const cat = catEl.value;
  const st = statusEl.value;

  const filtered = all.filter(p => {
    if (cat && p.category !== cat) return false;
    if (st && p.status !== st) return false;
    if (!matchText(p, q)) return false;
    return true;
  });

  resultsEl.textContent = `${filtered.length} / ${all.length}`;
  grid.innerHTML = filtered.map(cardHTML).join("");
}

async function main(){
  try{
    const res = await fetch("/data/projects.json", { cache: "no-store" });
    const raw = await res.json();

    const all = sortProjects(normalize(raw));

    setOptions(catEl, all.map(p => p.category), "All categories");
    setOptions(statusEl, all.map(p => p.status), "All statuses");

    // Default: show everything
    applyFilters(all);

    const onChange = () => applyFilters(all);
    qEl.addEventListener("input", onChange);
    catEl.addEventListener("change", onChange);
    statusEl.addEventListener("change", onChange);

    clearBtn.addEventListener("click", () => {
      qEl.value = "";
      catEl.value = "";
      statusEl.value = "";
      applyFilters(all);
      qEl.focus();
    });
  } catch(e){
    grid.innerHTML = `<p class="muted">Failed to load projects.</p>`;
    console.error("Projects index error:", e);
  }
}

main();
