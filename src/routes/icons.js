const express = require('express')
const router  = express.Router()

const path    = require('path')
const ROOT    = path.resolve(__dirname, '../../')
const MODULES = path.resolve(ROOT, 'node_modules')
const ICONS   = path.resolve(MODULES, 'bootstrap-icons')

router
	.get('/bootstrap', (req, res) => {
		res.sendFile(path.resolve(ICONS, `bootstrap-icons.svg`), {
			headers: {
				"Content-Type": "image/svg+xml"
			}
		})
	})

module.exports = router
