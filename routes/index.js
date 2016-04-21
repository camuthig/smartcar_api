var express = require('express');
var router = express.Router();

/* GET ping page for testing the server */
router.get('/ping', function(req, res, next) {
  res.json({success: true});
});

module.exports = router;
