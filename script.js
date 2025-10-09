// ===========================
// Script de Portal Finanzas
// ===========================

// 🔑 Tu clave
const API_KEY = "0dada3dba36102c3b1430a9889b5371";

// 🌐 URL para obtener noticias
const NEWS_URL = `https://gnews.io/api/v4/top-headlines?topic=business&lang=es&country=es&max=10&apikey=${API_KEY}`;

// Función para cargar noticias
async function loadNews() {
  const container = document.getElementById('news-container');
  container.innerHTML = "<p>⏳ Cargando noticias...</p>";

  try {
    const response = await fetch(NEWS_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    container.innerHTML = "";

    // Si no hay artículos
    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>⚠️ No hay noticias disponibles.</p>";
      return;
    }

    // Mostrar artículos
    data.articles.forEach(article => {
      const card = document.createElement('div');
      card.classList.add('news-card');

      card.innerHTML = `
        <img src="${article.image || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}" alt="imagen">
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.description || ''}</p>
          <a class="btn-read" href="${article.url}" target="_blank">🔗 Leer más</a>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Error al obtener noticias", error);
    container.innerHTML = `<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>`;
  }
}

// Cargar al iniciar
document.addEventListener("DOMContentLoaded", loadNews);
