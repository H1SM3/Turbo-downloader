const express = require('express');
const kiwihul = require('yt-converter');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => res.send('Turbo Server Online! 🚀'));

app.get('/download', async (req, res) => {
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL missing');

    try {
        if (format === 'mp3') {
            const info = await kiwihul.getInfo(url);
            res.header('Content-Disposition', `attachment; filename="audio.mp3"`);
            // Используем конвертер
            kiwihul.convertAudio(url, res, (progress) => {
                console.log(progress);
            });
        } else {
            const info = await kiwihul.getInfo(url);
            res.header('Content-Disposition', `attachment; filename="video.mp4"`);
            kiwihul.convertVideo(url, res, (progress) => {
                console.log(progress);
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('YouTube сегодня слишком силен. Попробуй через VPN на сайте или другую ссылку.');
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
