// ===========================
// Script con Sidebar + Filtro
// ===========================

const API_URL = '/api/news';
let currentCategory = 'business';

// Cargar noticias por categoría
async function loadNews(category = 'business') {
  const container = document.getElementById('news-container');
  container.innerHTML = "<p>⏳ Cargando noticias...</p>";

  try {
    const response = await fetch(`${API_URL}?category=${category}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    container.innerHTML = "";

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>⚠️ No hay noticias disponibles en esta categoría.</p>";
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

// Sidebar
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const closeSidebar = document.getElementById('closeSidebar');

menuToggle.addEventListener('click', () => sidebar.classList.add('open'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('open'));

document.querySelectorAll('.sidebar nav a[data-category]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    currentCategory = e.target.dataset.category;
    loadNews(currentCategory);
    sidebar.classList.remove('open');
  });
});

// Cargar al inicio
document.addEventListener("DOMContentLoaded", () => loadNews());
