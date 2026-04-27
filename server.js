const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

// Главная страница, чтобы видеть, что сервер живой
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
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                }
            }
        };

        const info = await ytdl.getInfo(url, options);
        // Очищаем название файла от странных символов
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
        res.status(500).send('YouTube блокирует запрос. Попробуй другую ссылку или подожди пару минут.');
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Пинг самого себя каждые 10 минут, чтобы не спать
    setInterval(() => {
        require('https').get('https://turbo-downloader.onrender.com/');
    }, 600000); 
});
