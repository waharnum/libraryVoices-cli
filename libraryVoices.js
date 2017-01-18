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
        log: false,
        maxConnectionErrors: 10
    },
    events: {
        "onSocketOpened": null
    },
    listeners: {
        "onCreate.openSocket": {
            funcName: "ca.alanharnum.libraryVoices.openSocket",
            args: ["{that}.options.config.endpoint", "{that}"]
        },
        "onSocketOpened.addOnMessageHandlers": {
            funcName: "ca.alanharnum.libraryVoices.addOnMessageHandlers",
            args: ["{that}.options.config.speak", "{that}.options.config.log", "{that}"]
        }
    },
    members: {
        connectionErrors: 0
    }
});

ca.alanharnum.libraryVoices.openSocket = function (endpoint, that) {
    var socket = new ws(endpoint);

    socket.on('open', function open() {
        console.log("Connection opened");
        that.socket = socket;
        that.events.onSocketOpened.fire();
    });

    socket.on('error', function errorHandle(e) {
        that.connectionErrors = that.connectionErrors+1;
        console.log("Error occured: " + e);
        console.log(that.connectionErrors + " errors so far, max is " + that.options.config.maxConnectionErrors);
        if(that.connectionErrors < that.options.config.maxConnectionErrors) {
            console.log("Trying again in 10 seconds");
            setTimeout(function() {
                ca.alanharnum.libraryVoices.openSocket(endpoint, that);
            }, 10000);
        } else {
            console.log("Terminating program, maximum connection errors occured in trying to establish socket");
            process.exit();
        }
    });
};

ca.alanharnum.libraryVoices.addOnMessageHandlers = function (speak, log, that) {
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
