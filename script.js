// =======================================
// Script Portal Finanzas con NEWSAPI
// =======================================

// ✅ Clave de NewsAPI
const API_KEY = "bcda57c6ef4146a48995b71719060260";

// 🌍 Endpoint para obtener noticias recientes de economía, bolsa, inversión, criptomonedas...
const NEWS_URL = `https://newsapi.org/v2/everything?q=(economia+OR+bolsa+OR+inversion+OR+criptomonedas)&language=es&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;

// =======================================
// Función para cargar noticias en el portal
// =======================================
async function cargarNoticias() {
  const container = document.getElementById("news-container");
  container.innerHTML = "<p>📰 Cargando noticias...</p>";

  try {
    const respuesta = await fetch(NEWS_URL);
    if (!respuesta.ok) throw new Error("Error al consultar la API");

    const datos = await respuesta.json();
    const listaNoticias = datos.articles || [];

    if (listaNoticias.length > 0) {
      container.innerHTML = ""; // Limpia mensaje de carga

      listaNoticias.forEach(noticia => {
        const card = document.createElement("div");
        card.className = "news-card";

        card.innerHTML = `
          <a href="${noticia.url}" target="_blank" class="news-link">
            <img src="${noticia.urlToImage || 'assets/placeholder.jpg'}" alt="Imagen de noticia">
            <h3>${noticia.title}</h3>
            <p>${noticia.description || ""}</p>
            <small>📍 Fuente: ${noticia.source.name} | 🗓 ${new Date(noticia.publishedAt).toLocaleDateString()}</small>
          </a>
        `;

        container.appendChild(card);
      });
    } else {
      container.innerHTML = "<p>⚠️ No hay noticias disponibles en este momento.</p>";
    }
  } catch (error) {
    console.error("❌ Error al cargar noticias:", error);
    container.innerHTML = "<p>🚨 No se pudieron cargar las noticias. Intenta más tarde.</p>";
  }
}

// =======================================
// Ejecutar automáticamente al cargar la web
// =======================================
document.addEventListener("DOMContentLoaded", cargarNoticias);

// ⏳ (Opcional) Refrescar las noticias cada hora automáticamente
setInterval(cargarNoticias, 1000 * 60 * 60); // 1 hora
