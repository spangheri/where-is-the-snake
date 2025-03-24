const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || "where_is_the_snake_db_user",
    host: process.env.DB_HOST || "dpg-cvgpmprtq21c73c0n29g-a.oregon-postgres.render.com",
    database: process.env.DB_NAME || "where_is_the_snake_db",
    password: process.env.DB_PASSWORD || "0sIyM3cecU57w9nPBDX8PecM7bhtBf3U",
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware para permitir requisições de qualquer origem (CORS)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Middleware para processar JSON
app.use(express.json());

// Rota para receber os dados do frontend e salvar no PostgreSQL
app.post("/log", async (req, res) => {
    const { image, responseTime } = req.body;
    const ip = req.ip || req.connecatualizetion.remoteAddress;
    const timestamp = new Date().toISOString();

    try {
        const query = `
            INSERT INTO game_data (ip, image, response_time, timestamp)
            VALUES ($1, $2, $3, $4)
        `;
        await pool.query(query, [ip, image, responseTime, timestamp]);
        res.json({ success: true, message: "Dados armazenados no banco de dados!" });
    } catch (err) {
        console.error("Erro ao salvar no banco:", err);
        res.status(500).json({ success: false, message: "Erro ao salvar no banco." });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
