const Sass = require('node-sass');

const defaultSassOptions = {
	indentedSyntax: true,
	indentType:     "tab",
	indentWidth:    1,
	linefeed:       'crlf',
	sourceMap:      false,
	outputStyle:    "compact",
	precision:      3,
};

/**
 *
 * @param { { file?: string, sass?: string, scss?: string, to: string} } request
 * @param { (result: { started_at: string, css?: string, error?: string, ended_at: string }) => void } cb
 * @param { typeof defaultSassOptions | undefined } options
 */
function transpile(request, cb, options) {
	const {file, sass, scss} = request;
	const resJson                = {
		started_at: new Date().toISOString(),
	}

	const opts = {
		...defaultSassOptions,
		...options,
	};

	if (!!file)
		opts.file = file;
	else
		opts.data = sass || scss || "";

	opts.indentedSyntax = !!sass;

	if (opts.watch === true){
		Sass.render(opts, )
	} else {

	}

	try {
		const resultDisplay  = Sass.renderSync(opts);
		resJson.css          = resultDisplay.css.toString();
	} catch (e) {
		resJson.error = e.message;
	} finally {
		resJson.ended_at = new Date().toISOString();
	}
	cb(resJson);
}

module.exports = transpile;
