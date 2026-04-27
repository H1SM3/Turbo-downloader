const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL missing');

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            ytdl(url, { format: 'mp3', filter: 'audioonly' }).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            ytdl(url, { quality: 'highestvideo', filter: 'audioandvideo' }).pipe(res);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Ошибка при скачивании');
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Turbo Server active on ${PORT}`));
 
