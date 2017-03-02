const request = require('request-promise');

var asistente_url = process.env.ASISTENTE_URL;

const test = function(msg) {
    var url = asistente_url + "/chat?chat=" + msg;
    console.log(url);
    return request.get(url);
}

const buscar_vuelos = function(params) {
     var options = {
        url: asistente_url+"/buscar_vuelos",
        body: {
            result : {
                action: "buscar_vuelos",
                parameters : params
            }
        },
        json: true // Automatically stringifies the body to JSON
    };
    return request.post(options);
}

module.exports = {
    test:test,
    buscar_vuelos:buscar_vuelos
}