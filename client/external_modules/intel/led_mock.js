var LED = function(config, log){
    return {
        on: function() { log.log("LED ON"); },
        off: function() { log.log("LED OFF"); }
    }
}

module.exports = LED;