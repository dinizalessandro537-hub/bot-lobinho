import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// Inicializa a IA usando a chave de ambiente do Render
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());

// Serve a página web que criamos na pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rota de API que a página web chama para conversar com o LOBINHO
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Mensagem vazia' });
        }

        // Chama o Gemini para gerar a resposta como o LOBINHO
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: "Você é o LOBINHO, um assistente virtual inteligente, amigável e prestativo. Responda de forma direta, clara e objetiva à seguinte mensagem: " + userMessage }
                    ]
                }
            ]
        });

        const replyText = response.text || "Opa, não consegui processar direito.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Erro no chat:", error);
        res.status(500).json({ reply: "Eita, deu um erro interno aqui no meu servidor." });
    }
});

app.listen(port, () => {
    console.log(`LOBINHO rodando na porta ${port}`);
});
