const request = require('request-promise');

const test = function(msg) {
    return request.get("http://localhost:3000/chat?chat=" + msg+ '"');
}

const buscar_vuelos = function(params) {
     var options = {
        url:"http://localhost:3000/",
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