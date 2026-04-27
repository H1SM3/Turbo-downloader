const express = require('express');
const ytDlp = require('yt-dlp-exec');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    const { url, format } = req.query;
    if (!url) return res.status(400).send('URL missing');

    const options = format === 'mp3' 
        ? { extractAudio: true, audioFormat: 'mp3', output: '-' } 
        : { format: 'best', output: '-' };

    res.header('Content-Disposition', `attachment; filename="TurboFile.${format}"`);

    try {
        const subprocess = ytDlp.exec(url, { ...options, stdio: ['ignore', 'pipe', 'ignore'] });
        subprocess.stdout.pipe(res);
    } catch (e) {
        res.status(500).send('Error');
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Turbo Server running on port ${PORT}`));
