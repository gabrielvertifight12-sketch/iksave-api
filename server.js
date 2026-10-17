const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Permite que seu site (no Netlify) acesse este servidor
app.use(cors());
app.use(express.json());

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL é necessária');

    try {
        // API externa que processa a remoção da marca d'água
        const response = await axios.get(`https://tikwm.com/api/?url=${videoUrl}`);
        const data = response.data.data;

        if (!data) {
            return res.status(404).json({ error: 'Vídeo não encontrado' });
        }

        // Retorna os dados necessários para o seu index.html
        res.json({
            title: data.title,
            cover: data.cover,
            video_url: data.play, // Link direto do arquivo .mp4 sem marca
            id: data.id
        });
    } catch (error) {
        console.error('Erro na requisição:', error.message);
        res.status(500).json({ error: 'Erro ao processar o vídeo' });
    }
});

// O Koyeb/Render define a porta automaticamente via variável de ambiente
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor online na porta ${PORT}`);
});
