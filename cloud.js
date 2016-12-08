// Wrapper for http
var request = require('request');

var APIId = '30e271fb6eab239f791c67f44da98659';

// Options for the Phillips Hue http server where the API requests will be hit
var options = {
  host: 'http://10.10.33.105',
  port: 80,
  path: '/api/' + APIId + '/lights/1/state',
  method: 'PUT'
};

console.log(options);

// Sound, rain and thunder!
//var player = require('player');
// var rain = new player('./thunder/background-rain.mp3');
// var thunderMP3s = [
//   // './thunder/148277450.mp3',
//   // './thunder/315681025.mp3',
//   // './thunder/587966950.mp3',
//   // './thunder/1913038465.mp3',
//   './thunder/thunder-clap.mp3'
// ]
// var thunder;

// Config for flash intervals
var flashInterval = 0;
var numFlashesPerEpisode = 10;
var maxTimeBetweenFlashes = 5 * 1000;

// Start the rain...
// rain.play();

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
          // var randomThunderClap = thunderMP3s[Math.floor(Math.random() * thunderMP3s.length)];
          // thunder = new player(randomThunderClap);
          // thunder.play();
          // thunder.play(function(err, player) {
          //   console.log(err, player);
          // });
        }

        makeLightning(true, bulbBrightness);
        flashInterval++;

        // Loop through the flash cycle
        loop();

      }
      else {
        // Stop noise and flashing
        // thunder.stop();
        // makeLightning(false, 0);
        // Wait between the loop starts again
        setTimeout(loop, maxTimeBetweenFlashes);
        flashInterval = 0;
      }
    }, timeBetweenFlashes);
}());
