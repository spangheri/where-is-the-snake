const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || "where_is_the_snake_db_user",
    host: process.env.DB_HOST || "dpg-cvgpmprtq21c73c0n29g-a.oregon-postgres.render.com",
    database: process.env.DB_NAME || "where_is_the_snake_db",
    password: process.env.DB_PASSWORD || "0sIyM3cecU57w9nPBDX8PecM7bhtBf3U",
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false } // Necessário para conexão segura no Render
});

// Middleware
app.use(cors());
app.use(express.json());

// Criar a tabela se não existir
async function createTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS game_data (
            id SERIAL PRIMARY KEY,
            ip VARCHAR(50),
            image VARCHAR(255),
            response_time FLOAT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    try {
        await pool.query(query);
        console.log("Tabela verificada/criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar a tabela:", error);
    }
}
createTable();

// Rota para receber múltiplos dados do frontend
app.post("/log", async (req, res) => {
    try {
        const { images } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const timestamp = new Date();

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ success: false, message: "Formato inválido. Esperado um array de imagens." });
        }

        console.log("Recebendo imagens:", images); // Debug

        const queries = images.map(({ image, responseTime }) =>
            pool.query(
                "INSERT INTO game_data (ip, image, response_time, timestamp) VALUES ($1, $2, $3, $4) RETURNING *",
                [ip, image, responseTime, timestamp]
            )
        );

        const results = await Promise.all(queries);
        res.json({ success: true, data: results.map(result => result.rows[0]) });

    } catch (error) {
        console.error("Erro ao inserir dados:", error);
        res.status(500).json({ success: false, message: "Erro ao salvar os dados" });
    }
});
// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
