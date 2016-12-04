var TEMP = function(config, log){
    return {
        ///obtiene la temperatura del sensor
        getCurrentTemp: function(callback) {
          callback(null, 19);
        }
    }
}

module.exports = TEMP;
