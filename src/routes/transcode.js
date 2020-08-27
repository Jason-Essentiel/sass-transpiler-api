const express   = require('express');
const router    = express.Router();
const transpile = require('../sass.js');

router.use(express.json());
router.route('/sass')
      .post((req, res) => {
	      const json = req.body;
	      transpile(json, (response) => {
		      const json = JSON.stringify(response);
		      res.json(json);
	      });
      });

module.exports = router;
