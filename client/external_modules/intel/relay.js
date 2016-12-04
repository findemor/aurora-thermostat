var groveSensor = require('jsupm_grove');


var RELAY = function(config, log){

    var relay = new groveSensor.GroveRelay(config.board.relay.pin);
    
    function on(){
        if (relay.isOff())
            relay.on();
    }

    function off(){
        if (relay.isOn())
            relay.off();
    }

    return {
        on: on,
        off: off
    }
}

module.exports = RELAY;
