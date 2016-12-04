var express   = require('express');
var actions   = require('./../controllers/api-actions');
var auth      = require('./../controllers/api-auth');
var router    = express.Router();

//middlewares
router.use(auth);

//endpoints del api
router.get  	('/status',  				actions.getStatus);
router.put  	('/status',  				actions.putStatus);
router.get  	('/schedules', 			    actions.getSchedules);
router.put  	('/schedules', 	            actions.putSchedule);
router.put  	('/schedules/:scheduleId', 	actions.putSchedule);
router.delete   ('/schedules/:scheduleId', 	actions.delSchedule);
router.put  	('/config',					actions.putConfig);
router.get  	('/config', 				actions.getConfig);

//exports
module.exports = router;
