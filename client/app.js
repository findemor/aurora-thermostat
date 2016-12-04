
var express     	= require('express');
var bodyParser  	= require('body-parser');
var config      	= require('./config.json');
var app         	= express();
var server 		  	= require('http').createServer(app);
var Logger      	= require('./libs/logger.js');
var Checker			= require('./bll/checker.js'); 
var DB				= require('./bll/db.js');



// routers
// ==============================================
var api         = require('./routers/api');
//var web			= require('./routers/web');

// configuramos la aplicacion
// ==============================================
app.use(bodyParser.urlencoded({ extended: true }));   //nos permite obtener urlencode data desde body
app.use(bodyParser.json());                           //nos permite obtener json data desde body

//set up the process env
if (config.node_env) process.env.NODE_ENV = config.node_env; //if development, it will load mock external_modules

var requireIntel	= require('./external_modules/intel/require_intel.js');
var requireAPI  	= require('./external_modules/api/require_api.js');

// setup
app.config = config;
app.log = Logger(config);
app.db = DB();
app.current = {
		board: {	//configuración de la placa y modulos de acceso a los sensores
			//led: 		requireIntel("led")		(app.config, app.log),
			display:	requireIntel("display")	(app.config, app.log),
			relay:		requireIntel("relay")	(app.config, app.log),
			temp:		requireIntel("temp")	(app.config, app.log),
			button: 	requireIntel("button") 	(app.config, app.log),
			angle: 		requireIntel("angle")	(app.config, app.log)
		},
		api: {		//acceso a servicios externos 
			temp:		requireAPI("weather")	(app.config, app.log)
		},
		status: {
			temp_external: 0,
			temp_indoor: 0,
			temp_desired: 0,
			mode: "OFF",
			status: "OFF",
			schedule: null
		},
		now: function() { return new Date(); }
};
app.current.checker = Checker(config, app.current, app.db, app.log);


// rutas
// ==============================================
app.use('/api/:version', api);
//app.use('/', web);


// servidor
// ==============================================
var port = process.env.PORT || config.port;

server.listen(port, function() {
	app.current.checker.execute();

	app.current.board.button.setOnStateChanged(function(state){
		app.current.checker.next(state, function() {});
	});

	console.log('Servidor preparado en http://localhost:%s', server.address().port);
});
