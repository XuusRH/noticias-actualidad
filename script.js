// ===========================
// Script Portal Finanzas
// ===========================

// Endpoint del proxy interno
const NEWS_URL = '/api/news';

// Función para cargar noticias
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

    data.articles.forEach(article => {
      const card = document.createElement('div');
      card.classList.add('news-card');

      card.innerHTML = `
        <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}" alt="imagen">
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

document.addEventListener("DOMContentLoaded", loadNews);
