var WEATHER = function(config, log){
    return {
      //obtiene la temperatura actual en grados celsius
      getCurrentTemp: function(callback) {
        callback(null, 29);
      }
    }
}

module.exports = WEATHER;
