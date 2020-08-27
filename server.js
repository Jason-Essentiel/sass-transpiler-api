const express = require('express');
const path = require('path');
const transcodeRoutes = require('./src/routes/transcode.js');

const PORT = 3000;

const ROOT = path.resolve(__dirname);
const PUBLIC = path.resolve(ROOT, 'public');
const SERVER = path.resolve(ROOT, 'server.js');

const app = express();

app.use(express.static(PUBLIC));

app.use('/transpile', transcodeRoutes);
app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
