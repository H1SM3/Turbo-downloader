const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL missing');

    try {
        // Используем более глубокие настройки обхода
        const agent = ytdl.createAgent(); 
        
        const options = {
            agent,
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Service-Worker-Navigation-Preload': 'true'
                }
            }
        };

        if (format === 'mp3') {
            res.setHeader('Content-Disposition', 'attachment; filename="music.mp3"');
            ytdl(url, { ...options, filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
            ytdl(url, { ...options, filter: 'audioandvideo', quality: 'highest' }).pipe(res);
        }
    } catch (e) {
        console.error(e.message);
        // Если опять просит бота, выведем понятную ошибку
        res.status(500).send('YouTube заблочил сервер. Попробуй через 5 минут или другую ссылку.');
    }
};
