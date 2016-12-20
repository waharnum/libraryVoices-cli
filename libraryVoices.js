/* jshint esversion: 6 */

const Say = require('say');
const WS = require('ws');
const fs = require('fs');
const fluid = require('infusion');
var ca = fluid.registerNamespace("ca");

fluid.defaults("ca.alanharnum.libraryVoices", {
    gradeNames: "fluid.component",
    wsOptions: {
        endpoint: "ws://45.55.209.67:4571/rtsearches"
    },
    listeners: {
        "onCreate.start": {
            funcName: "ca.alanharnum.libraryVoices.start",
            args: ["{that}.options.wsOptions.endpoint"]
        }
    }
});

ca.alanharnum.libraryVoices.start = function (endpoint) {
    // ca.alanharnum.libraryVoices.speakMode();
    ca.alanharnum.libraryVoices.logMode(endpoint);
};

ca.alanharnum.libraryVoices.logToFile = function (message) {
    fs.appendFile("log.txt", message + "\n", 'utf8', (err) => {
        if (err) throw err;
        console.log("Data appended to file.");
    });
};

ca.alanharnum.libraryVoices.speakMode = function (endpoint) {
    var socket = new WS(endpoint);

    socket.on('open', function open() {
        console.log("Connection opened");
    });

    socket.on('message', function(data, flags) {
        console.log("Message received");
        console.log(data);
        var terms = JSON.parse(data)[0].terms;
        Say.speak(terms);
    });
};

ca.alanharnum.libraryVoices.logMode = function (endpoint) {
    var socket = new WS(endpoint);

    socket.on('open', function open() {
        console.log("Connection opened");
    });

    socket.on('message', function(data, flags) {
        console.log("Message received");
        console.log(data);
        var terms = JSON.parse(data)[0].terms;
        ca.alanharnum.libraryVoices.logToFile(terms);
    });
};

ca.alanharnum.libraryVoices();
