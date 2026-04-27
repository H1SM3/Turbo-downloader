const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL missing');

    try {
        // Настройки, чтобы YouTube нас не забанил
        const options = {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                }
            }
        };

        const info = await ytdl.getInfo(url, options);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            ytdl(url, { ...options, format: 'mp3', filter: 'audioonly' }).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            ytdl(url, { ...options, quality: 'highestvideo', filter: 'audioandvideo' }).pipe(res);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Ошибка при скачивании (YouTube блокирует запрос)');
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Turbo Server active on ${PORT}`));
