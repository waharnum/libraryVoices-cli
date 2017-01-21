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
        consoleDisplay: true,
        logLocation: "log.txt",
        autoLogName: true,
        maxConnectionErrors: 30
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
            args: ["{that}.options.config.speak", "{that}.options.config.log", "{that}.options.config.consoleDisplay", "{that}"]
        }
    },
    members: {
        connectionErrors: 0
    }
});

ca.alanharnum.libraryVoices.openSocket = function (endpoint, that) {
    var socket = new ws(endpoint);

    socket.on('open', function open() {
        console.log("Connection opened, the library voices will begin...");
        say.speak("Connection opened, the library voices will begin...");
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

ca.alanharnum.libraryVoices.addOnMessageHandlers = function (speak, log, consoleDisplay, that) {
    if (log) {
        ca.alanharnum.libraryVoices.logHandler(that.socket, that.options.config.logLocation, that.options.config.autoLogName);
    }
    if (speak) {
        ca.alanharnum.libraryVoices.speakHandler(that.socket);
    }
    if (consoleDisplay) {
        ca.alanharnum.libraryVoices.consoleDisplayHandler(that.socket);
    }
};

ca.alanharnum.libraryVoices.logToFile = function (message, logLocation) {
    fs.appendFile(logLocation, message + "\n", 'utf8', (err) => {
        if (err) throw err;
        console.log("Data appended to file.");
    });
};

ca.alanharnum.libraryVoices.getAutoLogName = function () {
    var today = new Date();
    var autoLogName = "log-" + today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (today.getDate() + ".txt");
    console.log(autoLogName);
    return autoLogName;

};

ca.alanharnum.libraryVoices.speakHandler = function (socket) {
    socket.on('message', function(data, flags) {
        console.log("Speaking message");
        var terms = JSON.parse(data)[0].terms;
        say.speak(terms);
    });
};

ca.alanharnum.libraryVoices.logHandler = function (socket, logLocation, autoLogName) {
    logLocation = autoLogName ? ca.alanharnum.libraryVoices.getAutoLogName() : logLocation;
    socket.on('message', function(data, flags) {
        console.log("Logging message to file");
        var terms = JSON.parse(data)[0].terms;
        var now = new Date();
        var timePrefix = now.toISOString() + " >>> ";
        ca.alanharnum.libraryVoices.logToFile(timePrefix + terms, logLocation);
    });
};

ca.alanharnum.libraryVoices.consoleDisplayHandler = function (socket) {
    socket.on('message', function(data, flags) {
        var now = new Date();
        console.log("Message received " + now.toISOString());
        console.log(data);
    });
};

ca.alanharnum.libraryVoices({
    config: {
        speak: false,
        log: true,
        logLocation: "log-2017-01-21.txt",
    },
});
