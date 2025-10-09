// =============================
// Script Portal Finanzas con NewsAPI
// =============================

// 🔑 Clave de NewsAPI
const API_KEY = "bcda57c6ef4146a48995b71719060260";

// 🌍 Endpoint de noticias
const NEWS_URL = `https://newsapi.org/v2/everything?q=(economia+OR+bolsa+OR+inversion+OR+criptomonedas)&language=es&pageSize=8&apiKey=${API_KEY}`;

// =============================
// Cargar noticias
// =============================
async function loadNews() {
  const container = document.getElementById("news-container");
  container.innerHTML = "<p>Cargando noticias...</p>";

  try {
    const res = await fetch(NEWS_URL);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>⚠️ No se encontraron noticias.</p>";
      return;
    }

    // Construir tarjetas
    container.innerHTML = data.articles.map(article => {
      const imgUrl = article.urlToImage || "https://via.placeholder.com/600x400?text=Sin+Imagen";
      return `
        <div class="news-card">
          <img src="${imgUrl}" alt="imagen">
          <div class="news-card-content">
            <h3>${article.title || "Sin título"}</h3>
            <p>${article.description || "Sin descripción disponible..."}</p>
            <a href="${article.url}" target="_blank">🔗 Leer más</a>
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error al cargar noticias:", error);
    container.innerHTML = "<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>";
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", loadNews);
