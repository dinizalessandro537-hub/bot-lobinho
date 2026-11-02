import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

const ai = new GoogleGenAI();
// Cole a sua URL do webhook do Google Chat aqui entre as aspas
const GOOGLE_CHAT_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQAH2vlCgU/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=fAwwNyD5vPZl9UNkqR-IHooGVdDWowSoSzyVqJUlf1E";

app.post('/webhook-lobinho', async (req, res) => {
    try {
        const messageText = req.body.message?.text || req.body.text || "";
        const spaceType = req.body.space?.type || req.body.space_type;

        // Se for mensagem em sala/grupo e não tiver a menção @LOBINHO, ignora
        if (spaceType === 'ROOM' && !messageText.includes('@LOBINHO')) {
            return res.status(200).send({ status: 'ignored' });
        }

        // Limpa o texto tirando a menção @LOBINHO
        const cleanPrompt = messageText.replace(/@LOBINHO/g, '').trim() || "Olá!";

        // Chama o Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: cleanPrompt,
            config: {
                systemInstruction: "Seu nome é LOBINHO. Você é um assistente prestativo, amigável e direto em um chat de equipe."
            }
        });

        const botReply = response.text;

        // Envia a resposta de volta para o sala usando a URL do Google Chat
        if (GOOGLE_CHAT_WEBHOOK_URL) {
            await fetch(GOOGLE_CHAT_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: botReply })
            });
        }

        return res.status(200).send({ status: 'success', text: botReply });

    } catch (error) {
        console.error("Erro no bot LOBINHO:", error);
        return res.status(500).send({ error: "Erro interno." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LOBINHO rodando na porta ${PORT}`));
