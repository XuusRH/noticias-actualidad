// Proxy para NewsAPI
export default async function handler(req, res) {
  const API_KEY = "TU_API_KEY_DE_NEWSAPI"; // 👈 Pega aquí tu clave de NewsAPI

  const url = `https://newsapi.org/v2/everything?q=economia+OR+bolsa+OR+inversion+OR+criptomonedas&language=es&pageSize=10&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al conectar con NewsAPI" });
  }
}
