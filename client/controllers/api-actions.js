/* core de la funcionalidad de la aplicación */

var Schedule = require('./../bll/schedule');
var Status = require('./../bll/status');
var Configuration = require('./../bll/config');

// actions
// ==============================================

var getStatus = function getStatus(req, res) {  
    
  var status = Status(req.app.config, req.app.current);

  status.get(function(err, data) {
    res.json(data);
  });
  
};


var putStatus = function putStatus(req, res) {
  
  var status = Status(req.app.config, req.app.current);
  var params = req.body;
  
  status.put(params, function(err, data) {
    res.status(204);
    res.send();
  });
  
};

var getSchedules = function getSchedules(req, res) {  
  
  var schedule = Schedule(req.app.config, req.app.current, req.app.db);

  schedule.get(function(err, data) {
    res.json(data);
  });
  
};

var putSchedule = function putSchedule(req, res) {
  
  var schedule = Schedule(req.app.config, req.app.current, req.app.db);
  var id = req.params.scheduleId;
  var params = req.body;
  //var skip  = req.query.skip   ? Number(req.query.skip)  : 0;
    
  schedule.put(id, params, function(err, data) {
    res.status(204);
    res.send();
  });

};

var delSchedule = function delSchedule(req, res) {
  
  var schedule = Schedule(req.app.config, req.app.current, req.app.db);
  var id = req.params.scheduleId;
  
  schedule.remove(id, function(err, data) {
    res.status(204);
    res.send();
  });

};

var putConfig = function putConfig(req, res) {

  var configuration = Configuration(req.app.config, req.app.current);
  var params = req.body;
    
  configuration.put(params, function(err, data) {
    res.status(204);
    res.send();
  });

};

var getConfig = function getConfig(req, res) {
    
  var configuration = Configuration(req.app.config, req.app.current);
  
  configuration.get(function(err, data) {
    res.json(data);
  });

};



//exports
var exports = module.exports = {};
    exports.getStatus     = getStatus;
    exports.putStatus     = putStatus;
    exports.getSchedules  = getSchedules;
    exports.putSchedule   = putSchedule;
    exports.putConfig     = putConfig;
    exports.delSchedule   = delSchedule;
    exports.getConfig     = getConfig;