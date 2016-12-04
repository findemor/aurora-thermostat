//var mraa = require('mraa');
var groveSensor = require('jsupm_grove');

var TEMP = function(config, log){

    
    //var analogPin0 = new mraa.Aio(config.board.temp.pin);
    //var B = 3975; // B value of termistor 
    
    function getTempCelsius(callback) {
        
       /* var analogValue = analogPin0.read();
        var resistance = (1023 - analogValue) * 10000 / analogValue; //get the resistance of the sensor;
        var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15; //convert to temperature via datasheet ;
        
        var v = Math.round(celsius_temperature);*/
        
        var sensor = new groveSensor.GroveTemp(config.board.temp.pin);
        var v = sensor.value(); //fixing i don't know why the first reading is lower than the real temperature
        v = sensor.value();
        v = sensor.value();
        
        log.log("temp " + v + " at pin " + config.board.temp.pin);
        
        callback(null, v);
    }
    
    return {
        getCurrentTemp: getTempCelsius
    }
}

module.exports = TEMP;
