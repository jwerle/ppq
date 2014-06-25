
/**
 * Module dependencies
 */

var assert = require('assert')
  , ppq = require('./')

// pull server
var serv = ppq.pull('0.0.0.0:3000');
assert(serv);

// push client
var client = ppq.push('0.0.0.0:3000');
assert(client);

serv.on('message', function (msg) {
  console.log('foo')
  assert(msg);
  assert(msg == 'beep');
  serv.close();
});

setTimeout(function () {
  client.send('beep');
}, 1000);
