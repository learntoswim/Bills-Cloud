// var http = require('http');

// var options = {
//   host: '10.10.33.105',
//   port: 80,
//   path: '/api/30e271fb6eab239f791c67f44da98659/lights/2/state',
//   method: 'PUT'
// };

var player = require('player');
// create player instance
var thunder = new player('./thunder-clap.mp3');

var request = require('request')
var flashInterval = 0;
var numFlashesPerEpisode = 10;
var maxTimeBetweenFlashes = 5 * 1000;


function generateFlashTime () {
  return Math.floor(Math.random() * 1000);
}

(function loop() {
    var rand = generateFlashTime();
    var brightness = Math.floor(Math.random() * 255);
    setTimeout(function() {
      // console.log(flashInterval, numFlashesPerEpisode);
      if (flashInterval < numFlashesPerEpisode) {

        // play now and callback when playend
        if (flashInterval === 0) {
          thunder.play(function(err, player) {
            console.log(err, player);
          });
        }

        makeLightning(true, brightness);
        flashInterval++;
        loop();

      }
      else {
        thunder.stop();
        makeLightning(false, 0);
        setTimeout(loop, maxTimeBetweenFlashes);
        flashInterval = 0;
        // console.log('☁☁☁☁☁☁')
      }
    }, rand);
}());


function makeLightning (on, brightness) {
  // console.log('⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡');
  request({ url: 'http://10.10.33.105/api/30e271fb6eab239f791c67f44da98659/lights/2/state', method: 'PUT', json: {on: on, bri: brightness}}, function (error, response, body) {
    if (response.statusCode == 201) {
      // console.log(response);
    } else {
      // console.log('error: '+ response.statusCode);
      // console.log(body);
    }
  });

}

