// ===========================
// API para cargar noticias con CurrentsAPI
// ===========================

export default async function handler(req, res) {
  const API_KEY = "7vegIhuwUaAHXj9HyBJd0hHJgsZGcuCxhgvYJw5RDt931Bxd"; // Tu clave CurrentsAPI
  const category = req.query.category || "business"; // Categoría por defecto

  const url = `https://api.currentsapi.services/v1/latest-news?category=${category}&language=es&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // ✅ Respuesta correcta
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al conectar con CurrentsAPI:", error);
    return res.status(500).json({ error: "Error al conectar con CurrentsAPI" });
  }
}
