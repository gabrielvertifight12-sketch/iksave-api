const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL é necessária');

    console.log(`Processando link: ${videoUrl}`);

    try {
        // Adicionado User-Agent para evitar bloqueio da API
        const response = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const data = response.data.data;

        if (!data) {
            console.log('API respondeu, mas não encontrou dados do vídeo.');
            return res.status(404).json({ error: 'Vídeo não encontrado ou link inválido' });
        }

        console.log('Vídeo encontrado com sucesso!');
        res.json({
            title: data.title,
            cover: data.cover,
            video_url: data.play, 
            id: data.id
        });
    } catch (error) {
        console.error('Erro detalhado na requisição:', error.response ? error.response.status : error.message);
        res.status(500).json({ error: 'O servidor de download está instável. Tente novamente em instantes.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor online na porta ${PORT}`);
});
