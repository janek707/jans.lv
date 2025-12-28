const grid = document.getElementById("projectsGrid");

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

async function main(){
  try{
    const res = await fetch("/data/projects.json", { cache: "no-store" });
    const raw = await res.json();

    const all = normalize(raw);
    grid.innerHTML = all.map(cardHTML).join("");
  } catch(e){
    grid.innerHTML = `<p class="muted">Failed to load projects.</p>`;
    console.error("Projects index error:", e);
  }
}

main();
