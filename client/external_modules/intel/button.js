var groveSensor = require('jsupm_grove');

var BUTTON = function(config, log){

	var button = new groveSensor.GroveButton(config.board.button.pin);
	var last_value = false;
	var callback = null;

	function readButtonValue() {
		var new_value = button.value();
		if (last_value != new_value) {
			onStateChanged(new_value);
			last_value = new_value;
		}
	}

	function setOnStateChanged(cb) {
		callback = cb;
	}

	function onStateChanged(state) {
		if (callback) callback(state);
	}

	setInterval(readButtonValue, config.board.button.refresh_ms);

	log.log("button scheduled each " + config.board.button.refresh_ms);

    return {
        setOnStateChanged: setOnStateChanged
    }
}

module.exports = BUTTON;