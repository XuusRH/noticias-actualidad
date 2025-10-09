// ===========================
// Script Portal Finanzas
// ===========================

// 🔑 Tu clave
const API_KEY = "0dada3dba36102c3b1430a9889b5371";

// 🌐 URL usando `search` (compatible con el plan gratuito)
const NEWS_URL = `https://gnews.io/api/v4/search?q=finanzas+OR+economia+OR+bolsa+OR+criptomonedas&lang=es&max=10&apikey=${API_KEY}`;

// ===========================
// Cargar noticias
// ===========================
async function loadNews() {
  const container = document.getElementById('news-container');
  container.innerHTML = "<p>⏳ Cargando noticias...</p>";

  try {
    const response = await fetch(NEWS_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    container.innerHTML = "";

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>⚠️ No hay noticias disponibles.</p>";
      return;
    }

    // Crear tarjetas para cada noticia
    data.articles.forEach(article => {
      const card = document.createElement("div");
      card.classList.add("news-card");

      card.innerHTML = `
        <img src="${article.image || 'https://via.placeholder.com/600x300?text=Sin+Imagen'}" alt="imagen">
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.description || ''}</p>
          <a class="btn-read" href="${article.url}" target="_blank">🔗 Leer más</a>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Error al obtener noticias:", error);
    container.innerHTML = `<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>`;
  }
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", loadNews);
