var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Another Knowelege Base',
		link: 'https://github.com/Romax-91/Another-Knowelege-Base',
	});
});

module.exports = router;
