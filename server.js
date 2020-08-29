const path            = require('path');
const express         = require('express');
const transcodeRoutes = require('./src/routes/transcode.js');
const scriptsRoutes   = require('./src/routes/scripts.js');
const stylesRoutes    = require('./src/routes/styles.js');
const iconsRoutes    = require('./src/routes/icons.js');

const PORT = 3000;

const ROOT   = path.resolve(__dirname);
const PUBLIC = path.resolve(ROOT, 'public');
// const SERVER     = path.resolve(ROOT, 'server.js');

const app = express();
/*transpile({
	          file: STYLE_SASS,
	          to:   "css",
          }, response => {
	console.info('Style transpiled successfully !');
	if (response.error) console.error(response.error);
	else fs.writeFile(STYLE_CSS, response.css, err => {
		if (err) console.error(err);
		else console.info('Transpiled style saved successfully !');
	});
}, {
	          indentedSyntax: true,
	          indentType:     "tab",
	          indentWidth:    1,
	          linefeed:       'crlf',
	          sourceMap:      false,
	          outputStyle:    "compact",
	          watch:          true,
	          precision:      3,
	          outFile:        STYLE_CSS,
          });*/

app.use(express.static(PUBLIC));
app.use('/scripts', scriptsRoutes);
app.use('/styles', stylesRoutes);
app.use('/icons', iconsRoutes);

app.use('/transpile', transcodeRoutes);
app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.listen(PORT, () => console.info(`Server available at http://localhost:${PORT}`));
