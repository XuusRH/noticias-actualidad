// ==============================
// Script Portal Finanzas con Rotación y Límite
// ==============================

// APIs en orden de preferencia
const apiList = [
  { name: "Currents", base: "https://api.currentsapi.services/v1/latest-news?language=es&category=", key: "7vegIhuwUaAHXj9HyBJd0hHJgsZGcuCxhgvYJw5RDt931Bxd" },
  { name: "GNews", base: "https://gnews.io/api/v4/search?q=", key: "0dada3dba36102c3b1430a9889b5371" },
  { name: "NewsAPI", base: "https://newsapi.org/v2/everything?q=", key: "C6ef4146a48995b71719060260" }
];

let currentAPI = 0;                 // API activa
let lastFetchTime = 0;              // última llamada
const FETCH_INTERVAL = 15 * 60 * 1000; // cada 15 min
let currentCategory = "business";   // categoría por defecto

// =================== Cargar noticias ===================
async function loadNews(category = "business", force = false) {
  currentCategory = category;
  const container = document.getElementById("news-container");
  const now = Date.now();

  // Evita sobrecargar llamadas si no forzamos
  if (!force && now - lastFetchTime < FETCH_INTERVAL) {
    console.log("⏳ Usando datos recientes (caché)");
  }

  container.innerHTML = `<p>⏳ Cargando noticias...</p>`;

  for (let attempt = 0; attempt < apiList.length; attempt++) {
    const api = apiList[currentAPI];
    let url = "";

    // Construir URL según API
    if (api.name === "Currents") {
      url = `${api.base}${category}&apiKey=${api.key}`;
    } else if (api.name === "GNews") {
      url = `${api.base}${category}&lang=es&max=10&apikey=${api.key}`;
    } else if (api.name === "NewsAPI") {
      url = `${api.base}${category}&language=es&pageSize=10&apiKey=${api.key}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API ${api.name} error: ${res.status}`);

      const data = await res.json();
      lastFetchTime = now;

      const articles = data.news || data.articles || [];
      if (articles.length === 0) {
        container.innerHTML = `<p>⚠️ No hay noticias disponibles.</p>`;
        return;
      }

      container.innerHTML = "";
      articles.forEach(article => {
        const card = document.createElement("div");
        card.classList.add("news-card");

        const imageUrl = article.image || article.urlToImage || "https://via.placeholder.com/400x200?text=Sin+Imagen";

        card.innerHTML = `
          <img src="${imageUrl}" alt="imagen">
          <div class="news-content">
            <h3>${article.title}</h3>
            <p>${article.description || article.summary || ''}</p>
            <a class="btn-read" href="${article.url}" target="_blank">🔗 Leer más</a>
          </div>
        `;
        container.appendChild(card);
      });
      return;  // éxito → no probar más APIs
    } catch (err) {
      console.warn(`⚠️ Error con ${api.name}, probando siguiente...`, err);
      currentAPI = (currentAPI + 1) % apiList.length;
    }
  }

  container.innerHTML = `<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>`;
}

// =================== Menú lateral ===================
document.getElementById("menu-btn").addEventListener("click", () => {
  document.getElementById("side-menu").style.left = "0";
});

document.getElementById("close-btn").addEventListener("click", () => {
  document.getElementById("side-menu").style.left = "-260px";
});

// === 🔥 Escuchar clicks de categorías ===
document.querySelectorAll("#side-menu a[data-category]").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedCategory = link.getAttribute("data-category");
    loadNews(selectedCategory, true);       // carga forzada al pinchar
    document.getElementById("side-menu").style.left = "-260px";  // cerrar menú
  });
});

// =================== Inicio ===================
document.addEventListener("DOMContentLoaded", () => {
  loadNews(currentCategory);
  setInterval(() => loadNews(currentCategory, true), FETCH_INTERVAL);
});
