var Datastore = require('nedb');

var DB = function() {
    //load datastores
    var db = {};
    db.schedules = new Datastore({ filename: '../dbs/schedules.nedb', autoload: true });

    function addSchedule(schedule, callback) {
        if (schedule._id)
            db.schedules.update({ _id: schedule._id }, schedule, { upsert: true }, callback);
        else
            db.schedules.insert(schedule, callback);
    }

    function removeSchedule(scheduleId, callback) {
        db.schedules.remove({ _id: scheduleId }, callback);
    }

    function getSchedules(callback) {
        db.schedules.find({}, callback);
    }

    //public methods
    return {
        putSchedule: addSchedule,
        delSchedule: removeSchedule,
        getSchedules: getSchedules
    }

}

module.exports = DB;