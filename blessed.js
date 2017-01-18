var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'Library Voices';

var controlPanel = blessed.box({
    top: 'top',
    left: '0%',
    width: '50%',
    height: '100%',
    label: 'Control Panel',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'magenta',
      border: {
        fg: '#f0f0f0'
      },
      hover: {
        bg: 'green'
      }
    }
});

var controlForm = blessed.form({
    top: '10%',
    width: '80%',
    height: '80%',
    left: '10%',
    keys: true,
    style: {
        fg: 'black',
        bg: 'white'
    }
});

var startButton = blessed.button({
    content: 'Start',
    width: '50%',
    height: '50%',
    style: {
        hover: {
            bg: 'black'
        },
        focus: {
            bg: 'black'
        }
    }
});

var stopButton = blessed.button({
    left: '50%',
    content: 'Stop',
    width: '50%',
    height: '50%',
    style: {
        hover: {
            bg: 'black'
        },
        focus: {
            bg: 'black'
        }
    }
});

var log = blessed.box({
    top: 'top',
    left: '50%',
    width: '50%',
    height: '100%',
    label: 'Log',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'blue',
      border: {
        fg: '#f0f0f0'
      },
      hover: {
        bg: 'green'
      }
    }
});

// Create a box perfectly centered horizontally and vertically.
// var box = blessed.box({
//   top: 'center',
//   left: 'center',
//   width: '50%',
//   height: '100%',
//   content: 'Hello {bold}world{/bold}!',
//   tags: true,
//   border: {
//     type: 'line'
//   },
//   style: {
//     fg: 'white',
//     bg: 'magenta',
//     border: {
//       fg: '#f0f0f0'
//     },
//     hover: {
//       bg: 'green'
//     }
//   }
// });

// Append our box to the screen.
screen.append(controlPanel);

controlPanel.append(controlForm);
controlForm.append(startButton);
controlForm.append(stopButton);

screen.append(log);

// // Add a png icon to the box
// var icon = blessed.image({
//   parent: box,
//   top: 0,
//   left: 0,
//   type: 'overlay',
//   width: 'shrink',
//   height: 'shrink',
//   file: __dirname + '/my-program-icon.png',
//   search: false
// });
//
// // If our box is clicked, change the content.
// box.on('click', function(data) {
//   box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
//   screen.render();
// });
//
// // If box is focused, handle `enter`/`return` and give us some more content.
// box.key('enter', function(ch, key) {
//   box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
//   box.setLine(1, 'bar');
//   box.insertLine(1, 'foo');
//   screen.render();
// });
//

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

var isPlaying = false;

screen.key(['space'], function(ch, key) {
    if(isPlaying) {
        isPlaying = false;
        log.setContent("Playback stopped");
        stopButton.focus();
    } else {
        isPlaying = true;
        log.setContent("Playback started");
        startButton.focus();
    }
});

// Render the screen.
screen.render();
