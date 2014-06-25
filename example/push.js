
var push = require('../push');
var a = push('0.0.0.0:3000');
var b = push('0.0.0.0:3000');

setInterval(function () {
  a.send('kinkajou');
}, 500);

setInterval(function () {
  b.send('panda');
}, 800);
