const Sass = require('node-sass');

/**
 *
 * @param { { sass?: string, scss?: string, to: string} } request
 * @param { (result: { started_at: string, css: string }) => void } cb
 */
function transpile(request, cb) {
	const {sass, scss, to} = request;
	const resJson          = {
		started_at: new Date().toISOString(),
	}

	try {
		const result = Sass.renderSync({
			                               data:           sass || scss || "",
			                               indentedSyntax: !!sass,
		                               });
		// @var { Buffer } css
		const { css } = result;
		resJson.css = css.toString();
	} catch (e) {
		resJson.css = e.message;
	} finally {
		resJson.ended_at = new Date().toISOString();
		cb(resJson);
	}
}

module.exports = transpile;
