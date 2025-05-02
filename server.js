const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // Importar o módulo path
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware para analisar dados JSON
app.use(bodyParser.json());

// Servir arquivos estáticos (seu HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o HTML na raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configuração da API OpenAI (Corrigido para versão mais recente)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota para gerar a resposta do ChatGPT
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: "gpt-3.5-turbo",  // Você pode alterar o modelo para o que preferir
    });

    const botMessage = response.choices[0].message.content.trim();
    res.json({ message: botMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Erro ao se comunicar com a OpenAI.");
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
