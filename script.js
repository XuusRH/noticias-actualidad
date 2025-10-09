// 🔑 Clave CurrentsAPI
const API_KEY = "7vegIhuwUaAHXj9HyBJd0hHJgsZGcuCxhgvYJw5RDt931Bxd";
let currentCategory = "business";

// ===== Cargar Noticias =====
async function loadCategory(category) {
  currentCategory = category;
  loadNews();
}

async function loadNews() {
  const container = document.getElementById('news-container');
  container.innerHTML = "<p>⏳ Cargando noticias...</p>";

  try {
    const url = `https://api.currentsapi.services/v1/latest-news?category=${currentCategory}&language=es&apiKey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();
    container.innerHTML = "";

    if (!data.news || data.news.length === 0) {
      container.innerHTML = "<p>⚠️ No hay noticias disponibles.</p>";
      return;
    }

    data.news.forEach(article => {
      const card = document.createElement('div');
      card.classList.add('news-card');
      card.innerHTML = `
        <img src="${article.image || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}" alt="imagen">
        <h3>${article.title}</h3>
        <p>${article.description || ''}</p>
        <a class="btn-read" href="${article.url}" target="_blank">🔗 Leer más</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Error al cargar noticias:", err);
    container.innerHTML = `<p>⚠️ No se pudieron cargar las noticias. Intenta más tarde.</p>`;
  }
}

// ===== Ticker en vivo (ejemplo con cripto) =====
async function loadTicker() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
    const prices = await res.json();
    document.getElementById("ticker-content").textContent =
      `BTC: $${prices.bitcoin.usd} | ETH: $${prices.ethereum.usd} | Datos actualizados en vivo`;
  } catch {
    document.getElementById("ticker-content").textContent = "No se pudo cargar el ticker";
  }
}

// ===== Sidebar =====
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

// ===== Dark Mode =====
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// ===== Inicializar =====
document.addEventListener("DOMContentLoaded", () => {
  loadNews();
  loadTicker();
  setInterval(loadTicker, 30000);
});
