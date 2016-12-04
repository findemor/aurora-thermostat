/*
* Como no es posible compilar MRAA fuera de la placa Intel, si se desea ejecutar sin tener una placa conectada,
* este middleware sustituira los require de los sensores por su correspondiente mock
*/

module.exports = function(name) {
    var env = process.env.NODE_ENV;
    console.log(name);
    console.log(env);
    if (!env || env != 'development') {
      return require("./" + name + ".js"); //real module
    } else {
      return require("./" + name + "_mock.js") //mock module (must exists)
    }
  };

  //https://software.intel.com/en-us/creating-javascript-iot-projects-with-grove-starter-kit
