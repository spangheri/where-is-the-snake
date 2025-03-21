const express = require("express");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware para permitir requisições de qualquer origem (CORS)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Middleware para processar JSON
app.use(express.json());

// Array para armazenar os dados (simulando um data frame)
let dataFrame = [];

// Função para salvar os dados em um arquivo CSV
function saveToCSV() {
    const fields = ["ip", "image", "responseTime", "timestamp"]; // Campos do CSV
    const opts = { fields };

    try {
        const parser = new Parser(opts);
        const csv = parser.parse(dataFrame);

        // Caminho do arquivo CSV
        const filePath = path.join(__dirname, "data.csv");

        // Salva o arquivo CSV
        fs.writeFileSync(filePath, csv);
        console.log("Dados salvos em data.csv");
    } catch (err) {
        console.error("Erro ao gerar CSV:", err);
    }
}

// Rota para receber os dados do frontend
app.post("/log", (req, res) => {
    const data = req.body;

    // Obtém o IP do jogador
    const ip = req.ip || req.connection.remoteAddress;

    // Adiciona o IP, o timestamp e a data/hora aos dados
    data.ip = ip;
    data.timestamp = new Date().toISOString(); // Data e hora no formato ISO

    // Adiciona os dados ao array (data frame)
    dataFrame.push(data);

    // Salva os dados em um arquivo CSV
    saveToCSV();

    // Resposta para o frontend
    res.json({ success: true, message: "Dados recebidos com sucesso!" });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});