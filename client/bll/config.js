
function Configuration(options, controller) {

	function put(params, callback) {
		console.log('config put');

		if (params.refresh_ms != options.refresh_ms) {

			console.log('config put: se actualiza el tiempo de refresco a ' + params.refresh_ms);
			options.refresh_ms = params.refresh_ms;

			//actualizamos 
			controller.checker.execute(true);
		}

		callback(null, true);
	};

	function get(callback) {
		console.log('config get');

		var r = {
			refresh_ms: options.refresh_ms
		}

		callback(null, r);
	};

	return {
		put: put,
		get: get
	}
}


module.exports = Configuration;