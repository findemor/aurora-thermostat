var DISPLAY = function(config, log){
    return {
        writeStatus: function(status) { log.log(JSON.stringify(status)); }
    }
}

module.exports = DISPLAY;
