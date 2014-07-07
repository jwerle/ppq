
/**
 * Module dependencies
 */

var assert = require('assert')
  , ppq = require('./')

var expected = 4;
//var addr = '127.0.0.1:5000'
var addr = '0.0.0.0:5000'

// pull server
var serv = ppq.pull(5000);
var eserv = ppq.pull(6000);

// push client
var a = ppq.push(addr);
var b = ppq.push(addr);
var e = ppq.push(6000);

serv.on('message', function (msg) {
  console.log('message %s', msg);
  assert(msg);
  assert(msg == 'beep');
  if (0 == --expected) {
    serv.close();
  }
});

eserv.on('message', function (msg) {
  assert('wtf!' == msg.message);
  eserv.close();
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

setTimeout(function () {
  e.send(new Error("wtf!"));
}, 200);
