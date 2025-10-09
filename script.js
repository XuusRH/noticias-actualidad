// ================================
// Script Portal Finanzas y Actualidad
// ================================

// 🔑 API Key de NewsAPI (reemplázala por la tuya)
const API_KEY = "TU_API_KEY_DE_NEWSAPI";
const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=es&category=business&pageSize=6&apiKey=${API_KEY}`;

async function cargarNoticias() {
  const container = document.getElementById("news-container");
  container.innerHTML = "<p>Cargando noticias...</p>";

  try {
    const resp = await fetch(NEWS_URL);
    const data = await resp.json();

    if (data.status === "ok") {
      container.innerHTML = "";

      data.articles.forEach(noticia => {
        const card = document.createElement("div");
        card.className = "news-card";

        card.innerHTML = `
          <a href="${noticia.url}" target="_blank">
            <img src="${noticia.urlToImage || 'assets/placeholder.jpg'}" alt="">
            <h3>${noticia.title}</h3>
            <p>${noticia.description || ""}</p>
          </a>
        `;

        container.appendChild(card);
      });
    } else {
      container.innerHTML = "<p>No se pudieron cargar las noticias.</p>";
    }
  } catch (err) {
    container.innerHTML = "<p>Error al cargar noticias.</p>";
    console.error(err);
  }
}

// ✅ Cargar noticias al abrir la página
document.addEventListener("DOMContentLoaded", cargarNoticias);
