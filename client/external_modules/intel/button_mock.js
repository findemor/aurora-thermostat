var BUTTON = function(config, log){
    return {
        isPressed: function() { log.log("IS PRESSED?"); return false; }
    }
}

module.exports = BUTTON;