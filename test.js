
/**
 * Module dependencies
 */

var assert = require('assert')
  , ppq = require('./')

var expected = 4;
//var addr = '127.0.0.1:5000'
var addr = '0.0.0.0:5000'

// pull server
var serv = ppq.pull(addr);
assert(serv);

// push client
var a = ppq.push(addr);
var b = ppq.push(5000);

serv.on('message', function (msg) {
  console.log('message %s', msg);
  assert(msg);
  assert(msg == 'beep');
  if (0 == --expected) {
    serv.close();
  }
});

setTimeout(function () {
  a.send('beep');
}, 200);

setTimeout(function () {
  a.send('beep');
}, 100);

setTimeout(function () {
  b.send('beep');
}, 100);

setTimeout(function () {
  b.send('beep');
}, 100);
