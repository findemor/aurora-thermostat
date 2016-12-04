var RELAY = function(config, log){
    return {
        on: function() { log.log("RELAY ON"); },
        off: function() { log.log("RELAY OFF"); }
    }
}

module.exports = RELAY;
