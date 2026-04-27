const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Turbo Server is Online! 🚀');
});

app.get('/download', async (req, res) => {
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL missing');

    try {
        const options = {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                }
            }
        };

        const info = await ytdl.getInfo(url, options);
        const title = info.videoDetails.title.replace(/[^\w\sа-яА-Я]/gi, '');

        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.mp3"`);
            ytdl(url, { ...options, filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.mp4"`);
            ytdl(url, { ...options, filter: 'audioandvideo', quality: 'highest' }).pipe(res);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('YouTube сопротивляется, но мы пробуем снова...');
    }
});

// ПОРТ 8000 специально для Koyeb
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
