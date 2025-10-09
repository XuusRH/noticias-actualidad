// ===========================
// 📢 Script Portal Finanzas
// con rotación de APIs y refresco de anuncios
// ===========================

// 🔑 APIs configuradas
const apiList = [
  {
    name: "Currents",
    base: "https://api.currentsapi.services/v1/latest-news?language=es&category=",
    key: "7vegIhuwUaAHXj9HyBJd0hHJgsZGcuCxhgvYJw5RDt931Bxd"
  },
  {
    name: "GNews",
    base: "https://gnews.io/api/v4/top-headlines?lang=es&topic=",
    key: "0dada3dba36102c3b1430a9889b5371"
  },
  {
    name: "NewsAPI",
    base: "https://newsapi.org/v2/everything?q=",
    key: "C6efA146a48995b71719060260"
  }
];

let currentAPI = 0;               // índice de API en uso
let currentCategory = "business"; // categoría activa
let lastFetchTime = 0;            // timestamp de última llamada
const FETCH_INTERVAL = 15 * 60 * 1000; // 15 minutos

// ===========================
// 📥 Cargar noticias
// ===========================
async function loadNews(category = "business", force = false) {
  const container = document.getElementById("news-container");

  // limitar frecuencia de llamadas
  const now = Date.now();
  if (!force && now - lastFetchTime < FETCH_INTERVAL) {
    console.log("⏳ Usando caché, no llamamos todavía a la API");
    return;
  }

  container.innerHTML = `<p>⏳ Cargando noticias...</p>`;

  let articles = [];

  // Intentar APIs en orden
  for (let i = 0; i < apiList.length; i++) {
    const api = apiList[currentAPI];
    let url = "";

    if (api.name === "Currents") {
      url = `${api.base}${category}&apiKey=${api.key}`;
    } else if (api.name === "GNews") {
      url = `${api.base}${category}&max=10&apikey=${api.key}`;
    } else if (api.name === "NewsAPI") {
      url = `${api.base}${category}&language=es&pageSize=10&apiKey=${api.key}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const data = await res.json();
      articles = data.news || data.articles || [];

      if (articles.length > 0) {
        console.log(`✅ Noticias cargadas desde ${api.name}`);
        break;
      }
    } catch (err) {
      console.warn(`⚠️ Error con ${api.name}, cambiando de API...`);
      currentAPI = (currentAPI + 1) % apiList.length;
    }
  }

  lastFetchTime = now;
  renderNews(articles);
}

// ===========================
// 📰 Renderizar noticias
// ===========================
function renderNews(articles) {
  const container = document.getElementById("news-container");
  container.innerHTML = "";

  if (!articles || articles.length === 0) {
    container.innerHTML = `<p>⚠️ No hay noticias disponibles ahora.</p>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("div");
    card.classList.add("news-card");

    card.innerHTML = `
      <img src="${article.image || article.urlToImage || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}" alt="imagen">
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description || article.summary || ''}</p>
        <a class="btn-read" href="${article.url}" target="_blank">🔗 Leer más</a>
      </div>
    `;
    container.appendChild(card);
  });

  // 🔥 Refrescar anuncios de AdSense al renderizar nuevas noticias
  if (window.adsbygoogle) {
    (adsbygoogle = window.adsbygoogle || []).push({});
  }
}

// ===========================
// 📂 Cambio de categoría
// ===========================
document.querySelectorAll(".category-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const category = e.target.getAttribute("data-category");
    currentCategory = category;
    loadNews(category, true);
  });
});

// ===========================
// 🚀 Cargar al iniciar + refrescar cada 15 min
// ===========================
document.addEventListener("DOMContentLoaded", () => loadNews());
setInterval(() => loadNews(currentCategory, true), FETCH_INTERVAL);
