// ===========================
// Script del Portal Finanzas con CurrentsAPI
// ===========================

// Cargar noticias dinámicamente
async function loadNews(category = "business") {
  const container = document.getElementById("news-container");
  container.innerHTML = "<p>⏳ Cargando noticias...</p>";

  try {
    const response = await fetch(`/api/news?category=${category}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    container.innerHTML = "";

    if (!data.news || data.news.length === 0) {
      container.innerHTML = "<p>⚠️ No hay noticias disponibles en este momento.</p>";
      return;
    }

    // Mostrar las noticias
    data.news.forEach(article => {
      const card = document.createElement("div");
      card.classList.add("news-card");

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
    console.error("❌ Error al obtener noticias:", error);
    container.innerHTML = "<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>";
  }
}

// Cargar noticias al iniciar
document.addEventListener("DOMContentLoaded", () => loadNews());
