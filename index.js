import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// Inicializa a IA com a chave do Render
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());

// Serve a página web
app.use(express.static(path.join(__dirname, 'public')));

// Rota do Chat corrigida
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Mensagem vazia' });
        }

        // Chamada correta para o modelo Gemini atual
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: "Você é o LOBINHO, um assistente virtual inteligente, amigável e prestativo. Responda de forma direta, clara e objetiva."
            }
        });

        // Pega o texto gerado de forma segura
        const replyText = response.text || "Opa, recebi sua mensagem, mas não veio texto de resposta.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Erro detalhado no chat:", error);
        res.status(500).json({ reply: "Eita, deu um erro interno aqui no meu servidor." });
    }
});

app.listen(port, () => {
    console.log(`LOBINHO rodando na porta ${port}`);
});
