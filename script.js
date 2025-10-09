// ======================================
// 🚀 Script de Portal Finanzas con Rotación y Limitador
// ======================================

// 🔑 APIs en orden de preferencia
const apiList = [
  { name: "Currents", base: "https://api.currentsapi.services/v1/latest-news?language=es&category=", key: "7vegIhuwUaAHXj9HyBJd0hHJgsZGcuCxhgvYJw5RDt931Bxd" },
  { name: "GNews", base: "https://gnews.io/api/v4/top-headlines?lang=es&topic=", key: "0dada3dba36102c3b1430a9889b5371" },
  { name: "NewsAPI", base: "https://newsapi.org/v2/everything?q=", key: "C6ef4146a48995b71719060260" }
];

let currentAPI = 0;           // API activa
let currentCategory = "business"; // categoría por defecto
let lastFetchTime = 0;        // última llamada
const FETCH_INTERVAL = 15 * 60 * 1000; // 15 min en ms

// ======================================
// 📰 Cargar noticias con caché y límite
// ======================================
async function loadNews(category = "business", force = false) {
  currentCategory = category;
  const container = document.getElementById("news-container");

  // 🕒 Control de frecuencia
  const now = Date.now();
  if (!force && now - lastFetchTime < FETCH_INTERVAL) {
    console.log("⏳ Usando datos en caché, evitando exceso de llamadas.");
    return;
  }

  container.innerHTML = `<p>⏳ Cargando noticias...</p>`;

  const api = apiList[currentAPI];
  let url = "";

  // 🔗 Construir URL según la API activa
  if (api.name === "Currents") {
    url = `${api.base}${category}&apiKey=${api.key}`;
  } else if (api.name === "GNews") {
    url = `${api.base}${category}&max=10&apikey=${api.key}`;
  } else if (api.name === "NewsAPI") {
    url = `${api.base}${category}&language=es&pageSize=10&apiKey=${api.key}`;
  }

  try {
    const res = await fetch(url);
    if (res.status === 429 || res.status === 401) {
      console.warn(`🚫 Límite alcanzado en ${api.name}, cambiando de API...`);
      currentAPI = (currentAPI + 1) % apiList.length;
      return loadNews(category, true); // forzar siguiente API
    }

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();
    lastFetchTime = now; // actualizar última llamada
    container.innerHTML = "";

    const articles = data.news || data.articles || [];
    if (articles.length === 0) {
      container.innerHTML = `<p>⚠️ No hay noticias disponibles.</p>`;
      return;
    }

    // 📰 Crear tarjetas
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

  } catch (error) {
    console.error("❌ Error al cargar noticias:", error);
    container.innerHTML = `<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>`;
  }
}

// ======================================
// ⚡ Cargar al inicio + refrescar cada 15min
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  loadNews();
  setInterval(() => loadNews(currentCategory), FETCH_INTERVAL);
});
