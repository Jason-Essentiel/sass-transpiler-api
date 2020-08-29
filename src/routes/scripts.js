const express    = require('express');
const router     = express.Router();

const path       = require('path');
const ROOT       = path.resolve(__dirname, '../../');
const MODULES    = path.resolve(ROOT, 'node_modules');
const BOOTSTRAP  = path.resolve(MODULES, 'bootstrap/dist');
const CODEMIRROR = path.resolve(MODULES, 'codemirror');

router
	.get('/bootstrap.js.map', (req, res) => {
		res.sendFile(path.resolve(BOOTSTRAP, 'js/bootstrap.js.map'));
	})
	.get('/bootstrap-bundle', (req, res) => {
		res.sendFile(path.resolve(BOOTSTRAP, 'js/bootstrap.bundle.js'));
	})
	.get('/bootstrap', (req, res) => {
		res.sendFile(path.resolve(BOOTSTRAP, 'js/bootstrap.js'));
	})
	.get('/codemirror/:mode', (req, res) => {
		res.sendFile(path.resolve(CODEMIRROR, `mode/${req.params.mode}/${req.params.mode}.js`));
	})
	.get('/codemirror/:mode/:file', (req, res) => {
		res.sendFile(path.resolve(CODEMIRROR, `mode/${req.params.mode}/${req.params.file}.js`));
	})
	.get('/codemirror', (req, res) => {
		res.sendFile(path.resolve(CODEMIRROR, 'lib/codemirror.js'));
	});

module.exports = router;
