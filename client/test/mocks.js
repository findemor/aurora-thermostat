


/*
var LED = function(){
    var status = false;
    return {
        on: function() { status = true; },
        off: function() { status = false; },
        v: function() { return status; }
    }
}
*/
var DISPLAY = function(){
    var screen = null;
    return {
        writeStatus: function(status) { screen = status; },
        v: function() { return screen; }
    }
}

var RELAY = function(){
    var status = false;
    return {
        on: function() { status = true; },
        off: function() { status = false; },
        v: function() { return status; }
    }
}

var TEMP = function(value){
    var v = value;
    return {
        getCurrentTemp: function(callback) {
          callback(null, v);
        }
    }
}

var WEATHER = function(value){
    var v = value;
    return {
      //obtiene la temperatura actual en grados celsius
      getCurrentTemp: function(callback) {
        callback(null, v);
      }
    }
}


var controller = {
		board: {	//configuración de la placa y modulos de acceso a los sensores
			//led: 		LED(),
			display:	DISPLAY(),
			relay:		RELAY(),
			temp:		TEMP(0)
		},
		api: {		//acceso a servicios externos 
			temp:		WEATHER(0)
		},
		status: {
			temp_external: 0,
			temp_indoor: 0,
			temp_desired: 0,
			mode: "OFF",
			status: "OFF",
			schedule: null
		},
		now: function() { return new Date(); },
        checker: {
            execute: function() {}
        }
};

var Logger = function() {
    return {
        debug: function(msg) {  },
        error: function(msg) {  },
        log: function(msg) {  }
    }
}

var DB = function() {
    
    var schedules = []

    function getIndex(scheduleId) {
        var index = -1;
        for(var i = 0; i < schedules.length; i++) {
            if (schedules[i]._id == scheduleId)
            {
                index = i;
                break;
            }
        }
        return index;
    }

    function addSchedule(schedule, callback) {
        if (schedule._id) {
            var index = getIndex(schedule._id);
            if (index > -1) {
                schedules.remove(index);
                schedules.push(schedule);
            }
        } else {
            schedule._id = randomString(8);
            schedules.push(schedule);
        }
        callback(null,null);
    }

    function removeSchedule(scheduleId, callback) {
        var index = getIndex(schedule._id);
        if (index > -1) {
            schedules.remove(index);
        }
        callback(null, null);
    }

    function getSchedules(callback) {
        callback(null, schedules);
    }

    //public methods
    return {
        putSchedule: addSchedule,
        delSchedule: removeSchedule,
        getSchedules: getSchedules
    }

}


function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

module.exports = {
    current: controller,
    TEMP: TEMP,
    WEATHER: WEATHER,
    log: Logger,
    db: DB
}