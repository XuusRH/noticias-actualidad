/* ============================
   APIs rotativas (tu set)
============================ */
const apiList = [
  { name: "Currents", base: "https://api.currentsapi.services/v1/latest-news?language=es&category=", key: "7vegIhuwUaAHXj9HyBJd0hHJgsZGcuCxhgvYJw5RDt931Bxd" },
  { name: "GNews",   base: "https://gnews.io/api/v4/search?q=",                                     key: "0dada3dba36102c3b1430a9889b5371" },
  { name: "NewsAPI", base: "https://newsapi.org/v2/everything?q=",                                   key: "C6ef4146a48995b71719060260" }
];

let currentAPI = 0;
let currentCategory = "business";
let lastFetchTime = 0;
const FETCH_INTERVAL = 15 * 60 * 1000; // 15 min
let lastHeadlines = [];

/* ============================
   Ticker superior (CoinGecko + titulares)
============================ */
async function loadTicker() {
  try {
    const cg = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd,eur&include_24hr_change=true").then(r => r.json());
    const parts = [];
    const push = (name, d) => {
      if (!d) return;
      const usd = d.usd?.toLocaleString("en-US", {style:"currency",currency:"USD"});
      const chg = (d.usd_24h_change || 0).toFixed(2);
      parts.push(`${name}: ${usd} (${chg}% 24h)`);
    };
    push("BTC", cg.bitcoin);
    push("ETH", cg.ethereum);
    push("SOL", cg.solana);

    // Añade 3 titulares recientes si hay
    if (lastHeadlines.length) {
      parts.push("—");
      parts.push(...lastHeadlines.slice(0,3).map(h => `🗞️ ${h}`));
    }

    document.getElementById("ticker-inner").textContent = parts.join("   •   ");
  } catch (e) {
    document.getElementById("ticker-inner").textContent = "Mercado no disponible temporalmente.";
  }
}

/* ============================
   Noticias (rotación de APIs)
============================ */
async function loadNews(category = "business", force = false) {
  currentCategory = category;
  const container = document.getElementById("news-container");
  const loadingMsg = document.getElementById("loading-msg");
  const now = Date.now();

  loadingMsg.textContent = `⏳ Cargando noticias de "${category}"…`;

  if (!force && now - lastFetchTime < FETCH_INTERVAL) {
    // seguimos, pero evitamos excesos si te preocupa cuota
  }

  for (let i = 0; i < apiList.length; i++) {
    const api = apiList[currentAPI];
    let url = "";
    if (api.name === "Currents") {
      url = `${api.base}${category}&apiKey=${api.key}`;
    } else if (api.name === "GNews") {
      url = `${api.base}${category}&lang=es&max=10&apikey=${api.key}`;
    } else {
      url = `${api.base}${category}&language=es&pageSize=10&apiKey=${api.key}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${api.name} ${res.status}`);
      const data = await res.json();
      lastFetchTime = now;

      const articles = data.news || data.articles || [];
      if (!articles.length) throw new Error("Sin artículos");

      // Pinta
      container.innerHTML = "";
      lastHeadlines = [];
      articles.forEach(a => {
        const title = a.title || "";
        if (title) lastHeadlines.push(title);

        const img = a.image || a.urlToImage || "https://via.placeholder.com/640x360?text=Sin+Imagen";
        const desc = a.description || a.summary || "";
        const urlA = a.url || "#";

        const card = document.createElement("div");
        card.className = "news-card";
        card.innerHTML = `
          <img loading="lazy" src="${img}" alt="imagen de la noticia">
          <div class="news-content">
            <h3>${title}</h3>
            <p>${desc}</p>
            <a class="btn-read" href="${urlA}" rel="noopener" target="_blank">🔗 Leer más</a>
          </div>
        `;
        container.appendChild(card);
      });

      loadingMsg.textContent = `✅ ${articles.length} noticias de "${category}"`;
      loadTicker(); // refresca ticker con nuevos headlines
      return;
    } catch (err) {
      console.warn(`⚠️ Error con ${api.name}, probando siguiente…`, err);
      currentAPI = (currentAPI + 1) % apiList.length;
      // intenta siguiente API
    }
  }

  loadingMsg.textContent = "";
  container.innerHTML = `<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>`;
}

/* ============================
   Menú lateral + CTA
============================ */
document.getElementById("menu-btn").addEventListener("click", () => {
  document.getElementById("side-menu").classList.add("open");
});
document.getElementById("close-btn").addEventListener("click", () => {
  document.getElementById("side-menu").classList.remove("open");
});
document.querySelectorAll("#side-menu a[data-category]").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    const cat = a.getAttribute("data-category");
    loadNews(cat, true);
    document.getElementById("side-menu").classList.remove("open");
    document.getElementById("news").scrollIntoView({behavior:"smooth"});
  });
});

/* ============================
   Dark / Light mode
============================ */
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");
function applyTheme(t){
  if (t === "dark") root.classList.add("dark"); else root.classList.remove("dark");
  toggleBtn.textContent = t === "dark" ? "☀️" : "🌙";
}
const savedTheme = localStorage.getItem("theme") || (matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
applyTheme(savedTheme);
toggleBtn.addEventListener("click", () => {
  const t = root.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", t);
  applyTheme(t);
});

/* ============================
   Newsletter modal (auto a los 12s)
============================ */
const modal = document.getElementById("newsletter-modal");
const closeModal = () => modal.classList.add("hidden");
document.getElementById("modal-close").addEventListener("click", closeModal);
setTimeout(()=>{ modal.classList.remove("hidden"); }, 12000);
document.getElementById("newsletter-form").addEventListener("submit", e => {
  e.preventDefault();
  // aquí pegarás tu endpoint de Mailchimp/Brevo
  alert("¡Gracias! Revisa tu email para confirmar la suscripción.");
  closeModal();
});

/* ============================
   Parallax hero (suave)
============================ */
window.addEventListener("scroll", () => {
  const y = window.scrollY * 0.4;
  document.getElementById("hero").style.backgroundPosition = `center calc(50% + ${y}px)`;
});

/* ============================
   PWA: registro del SW
============================ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}

/* ============================
   Inicio
============================ */
document.addEventListener("DOMContentLoaded", () => {
  loadNews(currentCategory, true);
  loadTicker();
  setInterval(()=> loadNews(currentCategory, true), FETCH_INTERVAL);
  setInterval(loadTicker, 60*1000); // 1 min ticker
});
