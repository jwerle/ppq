
/**
 * Module dependencies
 */

var assert = require('assert')
  , ppq = require('./')

var expected = 4;

// pull server
var serv = ppq.pull('0.0.0.0:3000');
assert(serv);

// push client
var a = ppq.push('0.0.0.0:3000');
var b = ppq.push('0.0.0.0:3000');

serv.on('message', function (msg) {
  assert(msg);
  assert(msg == 'beep');
  if (0 == --expected) {
    serv.close();
  }
});

setTimeout(function () {
  a.send('beep');
  a.send('beep');
  b.send('beep');
  b.send('beep');
}, 1000);
