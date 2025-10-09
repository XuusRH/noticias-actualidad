// ==============================
//  SCRIPT PRINCIPAL
// ==============================

// 🔑 Clave de GNews (pon tu clave gratuita aquí)
const API_KEY = "TU_CLAVE_DE_GNEWS";

// 🌍 Endpoint GNews
const NEWS_URL = `https://gnews.io/api/v4/top-headlines?category=business&lang=es&max=9&apikey=${API_KEY}`;

// ==============================
//  Cargar Noticias
// ==============================
async function loadNews() {
  const container = document.getElementById("news-container");
  container.innerHTML = "Cargando noticias...";

  try {
    const response = await fetch(NEWS_URL);
    if (!response.ok) throw new Error("Error al obtener noticias");

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>⚠️ No se encontraron noticias.</p>";
      return;
    }

    container.innerHTML = data.articles.map(article => `
      <div class="news-card">
        <img src="${article.image || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}" alt="imagen">
        <div class="news-card-content">
          <h3>${article.title}</h3>
          <p>${article.description || "Sin descripción disponible."}</p>
          <a href="${article.url}" target="_blank">🔗 Leer más</a>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error("❌ Error:", error);
    container.innerHTML = "<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>";
  }
}

// ==============================
//  Ejecutar al cargar
// ==============================
document.addEventListener("DOMContentLoaded", loadNews);
