/* jshint esversion: 6 */

const say = require('say');
const ws = require('ws');
const fs = require('fs');
const fluid = require('infusion');

var ca = fluid.registerNamespace("ca");

fluid.defaults("ca.alanharnum.libraryVoices", {
    gradeNames: "fluid.component",
    config: {
        endpoint: "ws://45.55.209.67:4571/rtsearches",
        speak: true,
        log: false
    },
    listeners: {
        "onCreate.start": {
            funcName: "ca.alanharnum.libraryVoices.start",
            args: ["{that}.options.config.endpoint", "{that}.options.config.speak", "{that}.options.config.log", "{that}"]
        }
    }
});

ca.alanharnum.libraryVoices.start = function (endpoint, speak, log, that) {
    that.socket = new ws(endpoint);
    that.socket.on('open', function open() {
        console.log("Connection opened");
    });
    if (log) {
        ca.alanharnum.libraryVoices.logHandler(that.socket);
    }
    if (speak) {
        ca.alanharnum.libraryVoices.speakHandler(that.socket);
    }
};

ca.alanharnum.libraryVoices.logToFile = function (message) {
    fs.appendFile("log.txt", message + "\n", 'utf8', (err) => {
        if (err) throw err;
        console.log("Data appended to file.");
    });
};

ca.alanharnum.libraryVoices.speakHandler = function (socket) {
    socket.on('message', function(data, flags) {
        console.log("Message received, speaking message");
        console.log(data);
        var terms = JSON.parse(data)[0].terms;
        say.speak(terms);
    });
};

ca.alanharnum.libraryVoices.logHandler = function (socket) {
    socket.on('message', function(data, flags) {
        console.log("Message received, logging message to file");
        console.log(data);
        var terms = JSON.parse(data)[0].terms;
        ca.alanharnum.libraryVoices.logToFile(terms);
    });
};

ca.alanharnum.libraryVoices();
