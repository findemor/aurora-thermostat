var async = require('async');

var CHECKER = function (config, current, db, log) {
    var	checkerTaskId = null;
    var power = false;

    /**
     * Realiza todas las comprobaciones y actualiza el estado del servidor en función de 
     * la configuración del controlador y del estado actual
     */
    function doCheck(cb) {

        async.series([
            readSensors,
            updateStatus,
            writeOutput
        ], cb);
    }

    function updateStatus(done) {

        var mode = current.status.mode;

        switch(mode) {
            case "ON": {
                updateStatusON(current.board, current.status, done);
                break;
            }
            case "OFF": {
                updateStatusOFF(current.board, current.status, done);
                break;
            }
            case "SCHEDULE": {
                updateStatusSCHEDULE(current.now(), current.board, current.status, done);
                break;
            }
            default: {
                done();
            }
        }
    }

    function writeOutput(done) {
        if (power) {
            current.board.relay.on();
            current.status.status = "ON";
        } else {
            current.board.relay.off();
            current.status.status = "OFF";
        }
        
        current.board.display.writeStatus(current.status);
        done();
    }

    function updateStatusON(board, status, done) {
        status.schedule = null;
        if (status.temp_desired <= status.temp_indoor) {
            //hay que apagar la calefaccion
            powerOff(status, board);
        } else {
            //hay que encender
            powerOn(status, board)
        }
        status.schedule = null;
        done();
    }

    function updateStatusOFF(board, status, done) {
        powerOff(status, board);
        status.schedule = null;
        done();
    }

    /**
     * Comprueba si algun programa encaja y lo pone en marcha
     */
    function updateStatusSCHEDULE(now, board, status, done) {
        db.getSchedules(function(err, schedules) {

            var selected = null;
            for(var i in schedules) {
                selected = checkSingleSchedule(now, status, schedules[i]);
                if (selected) break;
            }

            status.schedule = selected;
            if (selected) {
                status.temp_desired = selected.temp_desired;

                if (status.temp_desired <= status.temp_indoor) {
                    //hay que apagar la calefaccion
                    powerOff(status, board);
                } else {
                    //hay que encender
                    powerOn(status, board)
                }
            } else {
                //ninguno encaja
                //hay que apagar la calefaccion
                powerOff(status, board);
            }

            return done();
        });
        
    }

    function powerOn(status, board) {
        power = true;
        //board.relay.on();
        //status.status = "ON";
    }

    function powerOff(status, board) {
        power = false;
        //board.relay.off();
        //status.status = "OFF";
    }

    /**
     * Devuelve el schedule si deberia aplicarse segun el status actual
     * devuelve null si no aplica
     */
    function checkSingleSchedule(now, status, schedule) {
        if (now >= schedule.start && now <= schedule.end) {
            log.log("now is perfect for this schedule");
            return schedule;
        } else if (schedule.repeat.indexOf(now.getDay()) > -1) {
            //comprobamos solo la hora porque estamos en un patron de repetición
            //y hoy es uno de los dias en los que deberia saltar este programa
            var time = new Date(now).setFullYear(2000,0,1);
            var start = new Date(schedule.start).setFullYear(2000,0,1);
            var end = new Date(schedule.end).setFullYear(2000,0,1);

            //ahora podemos comparar solo los tiempos
            if (time >= start && time <= end) {
                //encaja
                log.log("now is enought for this schedule, today " + now.getDay() + " start " + (new Date(schedule.start)).getDay());
                return schedule;
            }
        }

        //ninguno encajaba
        return null;
    }


    /**
     * Realiza la lectura de todos los sensores y actualiza el estado
     */
    function readSensors(done) {
        async.series([
            updateTempIndoor,
            updateTempExternal
        ], done);
    }

    /**
     * Actualiza la temperatura interior en el estado
     */
    function updateTempIndoor(cb) {
        current.board.temp.getCurrentTemp(function(err, temp) {
            if (!err) {
                current.status.temp_indoor = temp;
            } else log.error("error reading Temp indoor: " + err);
            cb();
        });
    }

    /**
     * Actualiza la temperatura exterior en el estado
     */
    function updateTempExternal(cb) {
        current.api.temp.getCurrentTemp(function(err, temp) {
            if (!err) {
                current.status.temp_external = temp;
            } else log.error("error reading Temp external: " + err);
            cb();
        });
    }

    function execute(cancelFirst, cb) { //funcion que se ejecutará para actualizar el estado del controlador
            //cancela el siguiente check si estamos reprogramandolo en tiempo de ejecución
            if (cancelFirst && checkerTaskId) {
                clearTimeout(checkerTaskId);
                log.log("checker cancelled ");
            }

            doCheck(cb);
            
            //programamos la siguiente ejecución
            checkerTaskId = setTimeout(current.checker.execute, config.refresh_ms); 
            log.log("checker scheduled " + config.refresh_ms + "ms");
        };

    function refresh(cb) {
        execute(true, function() {
            if (cb) cb();
        });
    }

    function next(buttonState, cb) {
        if (buttonState) { //button pushed
            var seq = [ "OFF", "ON", "SCHEDULE" ];
            var cur = seq.indexOf(current.status.mode);
            if (cur < 0) cur = 0;
            var nex = (cur + 1) % seq.length;

            current.status.mode = seq[nex];

            if (seq[nex] == "ON") { //allowed desired_temp readings
                current.board.angle.enableReadings(function(celsius) {
                    var old_value = current.status.temp_desired;
                    current.status.temp_desired = celsius;

                    if (old_value != celsius) {
                        //must refresh
                        refresh();
                    }
                });
            }

            refresh();

        } else { //button released
            current.board.angle.enableReadings(null); //disable readings
        }
    }

    return {
        execute: execute,
        next: next
    }

}

module.exports = CHECKER;