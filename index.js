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
    const { temperatura, humedad, gas_row, ch4, co, lpg, bateria, fecha_insertion, hora_insertion } = req.body;

    if (!temperatura || !humedad || !gas_row || ch4 === undefined || co === undefined || lpg === undefined || bateria === undefined || !fecha_insertion || !hora_insertion) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const query = `INSERT INTO sensores (temperatura, humedad, gas_row, ch4, co, lpg, bateria, fecha_insertion, hora_insertion) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

    const values = [temperatura, humedad, gas_row, ch4, co, lpg, bateria, fecha_insertion, hora_insertion];

    await pool.query(query, values);
    res.json({ message: "✅ Datos guardados correctamente" });
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
