var Forecast = require('forecast');

var WEATHER = function(config, log){

	var forecast = new Forecast(config.api.weather.forecast);

	function getCurrentTemp(callback) {
		forecast.get(config.api.weather.coords, function(err, weather) {
		  if(err) return callback(err, null);
		  else {
		  	return callback(null, weather && weather.currently ? Math.trunc(weather.currently.temperature) : 0);
		  }
		});
	}

    return {
      //obtiene la temperatura actual en grados celsius
      getCurrentTemp: getCurrentTemp
    }
}

module.exports = WEATHER;
