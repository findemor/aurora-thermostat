var Logger = function(config) {
    return {
        debug: function(msg) { console.debug(msg); },
        error: function(msg) { console.error(msg); },
        log: function(msg) { console.log(msg); }
    }
}

module.exports = Logger;