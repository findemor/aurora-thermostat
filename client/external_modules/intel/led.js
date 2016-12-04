var groveSensor = require('jsupm_grove');
//https://gist.github.com/Atlas7/6aa14e92b3f8fafee366
//https://github.com/intel-iot-devkit/upm

var LED = function(config, log){

    var pin = config.grove.led.pin;

    var led = new groveSensor.GroveLed(pin);

    log.debug("Led ready: " + led2.name() + " on pin " + pin);

    return {
        on: function() { led.on(); },
        off: function() { led.off(); }
    }

}

module.exports = LED;