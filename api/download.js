const ytdl = require('@distube/ytdl-core');

export default async function handler(req, res) {
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL missing');

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\sа-яА-Я]/gi, '');

        if (format === 'mp3') {
            res.setHeader('Content-Disposition', `attachment; filename="music.mp3"`);
            ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="video.mp4"`);
            ytdl(url, { filter: 'audioandvideo', quality: 'highest' }).pipe(res);
        }
    } catch (e) {
        res.status(500).send('Error: ' + e.message);
    }
}
