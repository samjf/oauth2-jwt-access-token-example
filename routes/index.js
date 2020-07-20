var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OAuth2.0 test', authUrl: process.env.AUTHORIZATION_URL, user: req.user});
});

module.exports = router;
