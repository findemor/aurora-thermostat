//https://software.intel.com/en-us/node/557432
var LCD = require('jsupm_i2clcd');


var DISPLAY = function(config, log){
    
    var lcd = new LCD.Jhd1313m1 (6, 0x3E, 0x62);
    log.log("display on")
    var currentStatus = null;
    var currentMode = null;
    
    String.prototype.paddingLeft = function (paddingValue) {
        return String(paddingValue + this).slice(-paddingValue.length);
    };

    function showMode(lcd, status) {
        lcd.setCursor(1,0);
        log.log('status mode lcd ' + status.mode)
        switch(status.mode) {
            case "OFF": {
                lcd.write("OFF             ");
                break;
            }
            case "ON": {
                lcd.write("ON              ");
                break;
            }
            case "SCHEDULE": {
                var text = "SCH: " + (status.schedule ? status.schedule.name : "---") + "                  ";
                lcd.write(text.substr(0, 16));
                break;
            }
        }
    }

    function showStatus(lcd, s, m) {
        
        if (currentStatus != s || currentMode != m) {
                        
            if (s == "ON") {                // en marcha
                lcd.setColor(255,51,51);    
            } else {                        // no esta en marcha
                if (m == "ON") //en espera, saltara cuando se alcance la temperatura deseada
                {
                    lcd.setColor(255,255,51); //amarillo
                } else if (m == "SCHEDULE")   //en espera, saltara cuando el programa este activo
                {
                    lcd.setColor(51,51,255); //azul
                } else {    //no esta en espera
                    lcd.setColor(0,0,0);
                }
            }
            
            currentStatus = s;
            currentMode = m;
        }
    }

    function showTemp(lcd, indoor, desired, external) {
        var i = indoor.toString().paddingLeft("00");
        var d = desired.toString().paddingLeft("00");
        var e = external.toString().paddingLeft("00");
        lcd.setCursor(0,0);
        var text = "I:" + i + " D:" + d + " E:" + e;
        text = text.substr(0,16);
        log.log("I:" + i + " D:" + d + " E:" + e);
        lcd.write(text);
    }

    function write (status) {
        try {
            showTemp(lcd, status.temp_indoor, status.temp_desired, status.temp_external);
            showMode(lcd, status);
            showStatus(lcd, status.status, status.mode);
        } catch (ex) {
            log.error("ON LCD WRITE: " + ex);
        }
    }

    return {
        writeStatus: write
    }
}

module.exports = DISPLAY;
