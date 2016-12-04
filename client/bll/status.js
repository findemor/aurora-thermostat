function Status(options, controller) {

	var get = function get(callback) {
		console.log('status get');
		callback(null, controller.status);
	};

	var put = function put(params, callback) {
		console.log('status put');

		var previousMode = controller.status.mode;
		var previousTemp = controller.status.temp_desired;

		var mustRecheck = false;
		//hay que actualizar el estado?
		if (previousMode != params.mode ||
			previousTemp != params.temp_desired) {
			mustRecheck = true;
			
			controller.status.mode = params.mode;

			switch(params.mode) {
				case "OFF": {
					break;
				}
				case "ON": {
					if (params.temp_desired)
						controller.status.temp_desired = params.temp_desired;
					break;	
				}
				case "SCHEDULE": {
					break;
				}
			}
		}

		//respondemos
		//controller.status = params;

		if (mustRecheck) {
			//solicitamos la ejecución del checkeo ahora mismo
			controller.checker.execute(true);
		}

		callback(null, controller.status);
	};

	return {
		get: get,
		put: put
	}

}

module.exports = Status;
