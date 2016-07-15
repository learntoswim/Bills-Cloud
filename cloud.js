// Wrapper for http
var request = require('request');

var APIId = '30e271fb6eab239f791c67f44da98659';

// Options for the Phillips Hue http server where the API requests will be hit
var options = {
  host: 'http://10.10.33.105',
  port: 80,
  path: '/api/' + APIId + '/lights/2/state',
  method: 'PUT'
};

// Sound, rain and thunder!
var player = require('player');
var rain = new player('./thunder/background-rain.mp3');
var thunder = new player('./thunder/thunder-clap.mp3');

// Config for flash intervals
var flashInterval = 0;
var numFlashesPerEpisode = 10;
var maxTimeBetweenFlashes = 5 * 1000;

// Start the rain...
rain.play();

// Generate a random number between 1 sec
function generateFlashTime () {
  return Math.floor(Math.random() * 1000);
}

// Hit the API and make the Phillips Hue light flash
function makeLightning (turnBulbOn, bulbBrightness) {
  // console.log('⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡');
  request(
    {
      url: options.host + ':' + options.port + options.path,
      method: options.method,
      json: {
        on: turnBulbOn,
        bri: bulbBrightness
      }
    },
    function (error, response, body) {
      if (response.statusCode == 201) {
        // console.log(response);
      } else {
        // console.log('error: '+ response.statusCode);
        // console.log(body);
      }
    }
  );
}

// Action loop
(function loop() {
    var timeBetweenFlashes = generateFlashTime();
    var bulbBrightness = Math.floor(Math.random() * 255);
    setTimeout(function() {
      // console.log(flashInterval, numFlashesPerEpisode);
      if (flashInterval < numFlashesPerEpisode) {

        // Play now and callback when playend
        if (flashInterval === 0) {
          thunder.play(function(err, player) {
            console.log(err, player);
          });

        }

        makeLightning(true, bulbBrightness);
        flashInterval++;

        // Loop through the flash cycle
        loop();

      }
      else {
        // Stop noise and flashing
        thunder.stop();
        makeLightning(false, 0);
        // Wait between the loop starts again
        setTimeout(loop, maxTimeBetweenFlashes);
        flashInterval = 0;
      }
    }, timeBetweenFlashes);
}());
