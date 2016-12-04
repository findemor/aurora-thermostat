/* modulo de autorización del api */
var config      = require('./../config.json');


var authorize = function (req, res, next) {
  var token = req.header("Authorization") ? req.header("Authorization") : req.param("Authorization");
  
  if (token == config.apikey)
     next();
  else 
    res.status(401).json({ code: 401, message: "Unauthorized", info: "You must include Authorization" });
};

//exports
module.exports = authorize;