const Say = require('say');
const WS = require('ws');

var socket = new WS('ws://45.55.209.67:4571/rtsearches');

socket.on('open', function open() {
    console.log("Connection opened");
});

socket.on('message', function(data, flags) {
    console.log("Message received");
    console.log(data);
    var terms = JSON.parse(data)[0].terms;
    console.log(terms);
    Say.speak(terms);
});
