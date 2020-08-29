const express   = require('express');
const router    = express.Router();
const transpile = require('../sass.js');

function translateToSassOptions(opts) {
	const options = {
		indentedSyntax: true,
		indentType:     "tab",
		indentWidth:    1,
		linefeed:       'crlf',
		sourceMap:      false,
		outputStyle:    "compact",
		precision:      3,
	};
	// console.info(opts, options);
	return options
}

router.use(express.json());
router.route('/sass')
      .post((req, res) => {
	      const {options, ...json} = req.body;
	      const sassOptions        = translateToSassOptions(options);
	      transpile(json, (response) => {
		      const jsonRes = JSON.stringify(response);
		      res.json(jsonRes);
	      }, sassOptions);
      });

module.exports = router;
