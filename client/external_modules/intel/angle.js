var upm_grove = require('jsupm_grove');

var MaxRange = 300;
var MinRange = 0;

var ANGLE = function(config, log){
	var last_value = config.board.angle.min;
	var groveRotary = new upm_grove.GroveRotary(config.board.angle.pin);
	var callback = null;
	var task = null;

	function readCelsius() {
		var new_value = Math.trunc(parseInt(groveRotary.abs_deg()));
        
		if (last_value != new_value) {
            var celsius = Math.trunc((((new_value - MinRange) * (config.board.angle.max - config.board.angle.min)) / (MaxRange - MinRange)) + config.board.angle.min); //change range
			onStateChanged(celsius);
			last_value = new_value;
		}
	}

	/**
	Enable or disable (with param null) the reading loop
	*/
	function enableReadings(cb) {
		callback = cb;

		if (task) clearTimeout(task);

		if (cb) {
			task = setInterval(readCelsius, config.board.angle.refresh_ms);
		}
	}

	function onStateChanged(state) {
		if (callback) callback(state);
	}

    return {
        enableReadings: enableReadings
    }
}

module.exports = ANGLE;