const express = require("express");
const pool = require("./db");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// 📌 Ruta para recibir datos de sensores
app.post("/api/sensores", async (req, res) => {
  try {
    const { temperatura, humedad, co, ch4, lpg, bateria } = req.body;

    if (!temperatura || !humedad || !co || !ch4 || !lpg || bateria === undefined) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const horaActual = new Date().toLocaleTimeString("es-ES", { hour12: false });

    const query = `INSERT INTO sensores (temperatura, humedad, co, ch4, lpg, date_insertion,bateria, hora_insertion) 
VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)`;

    const values = [temperatura, humedad, co, ch4, lpg, bateria, horaActual];

    const result = await pool.query(query, values);
    res.json({ message: "✅ Datos guardados", data: result.rows[0] });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 📌 Ruta para obtener los datos de sensores
app.get("/api/sensores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sensores ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 📌 Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
