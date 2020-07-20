const fetch = require('node-fetch');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const resp = await fetch(process.env.JWT_RESOURCE_URL, {
    mode: ' no-cors', // no-cors, *cors, same-origin
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.user.jwt}`
    }
  });
  const json = await resp.json();
  res.json(json);
});

module.exports = router;
