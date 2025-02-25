const client = require("./db");

client.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error ejecutando la consulta:", err);
  } else {
    console.log("🕒 Hora actual en la BD:", res.rows[0].now);
  }
  client.end(); // Cierra la conexión
});
