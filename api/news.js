// ============================
// API News Proxy para Vercel
// ============================

export default async function handler(req, res) {
  const API_KEY = "C6efA146a48995b71719060260"; // 
  const category = req.query.category || "business";

  const url = `https://newsapi.org/v2/everything?q=${category}&language=es&pageSize=10&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error al conectar con NewsAPI" });
  }
}
