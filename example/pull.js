
var pull = require('../pull')
var server = pull('0.0.0.0:3000');

server.on('message', function (msg) {
  console.log(msg);
});
