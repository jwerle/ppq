
var pull = require('../pull')
var server = pull(3000);

server.on('message', function (msg) {
  console.log(msg);
});
