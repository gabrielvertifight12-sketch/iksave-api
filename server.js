const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL é necessária');

    console.log(`Tentando nova API para o link: ${videoUrl}`);

    try {
        // Mudamos a rota da API para tentar burlar o bloqueio de IP do Render
        const response = await axios.get(`https://tiktokvm.com/api/br/download?url=${encodeURIComponent(videoUrl)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            }
        });

        // A estrutura de resposta pode mudar dependendo da API, então vamos validar
        const data = response.data.data || response.data;

        if (!data || (!data.play && !data.video_url)) {
            console.log('API alternativa não retornou link de vídeo.');
            return res.status(404).json({ error: 'Não foi possível encontrar o vídeo.' });
        }

        console.log('Sucesso com a API alternativa!');
        res.json({
            title: data.title || 'Vídeo do TikTok',
            cover: data.cover || data.thumbnail,
            video_url: data.play || data.video_url, 
            id: data.id
        });
    } catch (error) {
        const status = error.response ? error.response.status : 'Erro';
        console.error(`Erro na nova API: ${status} - ${error.message}`);
        res.status(500).json({ error: `Erro ${status}: Servidor instável. Tente outro vídeo.` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor online na porta ${PORT}`);
});
