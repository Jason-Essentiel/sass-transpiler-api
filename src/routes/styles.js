const express    = require('express');
const router     = express.Router();
const path       = require('path');
const ROOT       = path.resolve(__dirname, '../../');
const MODULES    = path.resolve(ROOT, 'node_modules');
const BOOTSTRAP  = path.resolve(MODULES, 'bootstrap/dist');
const CODEMIRROR = path.resolve(MODULES, 'codemirror/lib');

router
	.get('/bootstrap', (req, res) => {
		res.sendFile(path.resolve(BOOTSTRAP, 'css/bootstrap.css'));
	})
	.get('/bootstrap.css.map', (req, res) => {
		res.sendFile(path.resolve(BOOTSTRAP, 'css/bootstrap.css.map'));
	})
	.get('/codemirror', (req, res) => {
		res.sendFile(path.resolve(CODEMIRROR, 'codemirror.css'));
	});

module.exports = router;
