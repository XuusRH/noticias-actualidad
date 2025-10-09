// ===============================
// Script Portal Finanzas con NEWSAPI
// ===============================

// 🔑 Clave de NewsAPI
const API_KEY = "bcda57c6ef4146a48995b71719060260";

// 🌍 Endpoint de noticias
const NEWS_URL = `https://newsapi.org/v2/everything?q=finanzas+OR+bolsa+OR+inversion+OR+criptomonedas&language=es&pageSize=10&apiKey=${API_KEY}`;

// 🚀 Función para cargar noticias
async function loadNews() {
  const container = document.getElementById('news-container');
  container.innerHTML = 'Cargando noticias...';

  try {
    const response = await fetch(NEWS_URL);
    if (!response.ok) throw new Error('Error al obtener noticias');
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = '⚠️ No hay noticias disponibles en este momento.';
      return;
    }

    container.innerHTML = '';
    data.articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'news-card';
      card.innerHTML = `
        <img src="${article.urlToImage || 'assets/placeholder.jpg'}" alt="imagen" class="news-img">
        <h3>${article.title}</h3>
        <p>${article.description || 'Sin descripción disponible.'}</p>
        <a href="${article.url}" target="_blank" class="btn-read">🔗 Leer más</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = '❌ No se pudieron cargar las noticias. Intenta más tarde.';
    console.error(error);
  }
}

// 🚀 Llamar a la función al cargar
document.addEventListener('DOMContentLoaded', loadNews);


