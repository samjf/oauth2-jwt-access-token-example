var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.user) {
    res.json(req.user);
  }
  else {
    res.status(404).send('Sorry, you are not logged in!');
  }
});

module.exports = router;
