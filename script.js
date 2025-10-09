// ======================================
// Script Portal Finanzas con NEWSAPI
// ======================================

// ✅ Clave de NewsAPI
const API_KEY = "bcda57c6ef4146a48995b71719060260";

// 🌍 Endpoint original
const TARGET_URL = `https://newsapi.org/v2/everything?q=(economia+OR+bolsa+OR+inversion+OR+criptomonedas)&language=es&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;

// 🚀 Usar proxy para evitar CORS
const PROXY_URL = "https://api.allorigins.win/raw?url=";

// ======================================
// Cargar noticias en el portal
// ======================================
async function cargarNoticias() {
  const contenedor = document.getElementById("news-container");
  contenedor.innerHTML = "⏳ Cargando noticias...";

  try {
    const response = await fetch(PROXY_URL + encodeURIComponent(TARGET_URL));
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      contenedor.innerHTML = "⚠️ No hay noticias disponibles en este momento.";
      return;
    }

    // Renderizar las noticias
    contenedor.innerHTML = data.articles.map(noticia => `
      <div class="news-card">
        <img src="${noticia.urlToImage || 'assets/default-news.jpg'}" alt="imagen">
        <h3>${noticia.title}</h3>
        <p>${noticia.description || ''}</p>
        <a href="${noticia.url}" target="_blank">🔗 Leer más</a>
      </div>
    `).join('');

  } catch (error) {
    console.error("Error al cargar noticias:", error);
    contenedor.innerHTML = "❌ No se pudieron cargar las noticias. Intenta más tarde.";
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarNoticias);
