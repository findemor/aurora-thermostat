function Schedule (options, controller, db) {

	function get(callback) {
		console.log('schedule get');
		db.getSchedules(callback);
	};

	function put(id, params, callback) {
		console.log('schedule put ' + id);
		
		//establecemos el id si lo tenemos, para actualizar este programa
		if (id) {
			params._id = id;
		}

		params.start 	= new Date(params.start);
		params.end 		= new Date(params.end);

		db.putSchedule(params, callback);
	};


	function remove(id, callback) {
		console.log('schedule remove ' + id);
		db.delSchedule(id, callback);
	};

	return {
		put: put,
		get: get,
		remove: remove
	}
}



module.exports = Schedule;