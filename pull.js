
/**
 * Module dependencies
 */

var net = require('net')
  , Message = require('amp-message')
  , through = require('through')
  , url = require('url')

/**
 * Pull messages from address
 *
 * @api public
 * @param {Number} port
 */

module.exports = pull;
function pull (port) {
  var server = net.createServer(onconnect);
  var stream = through();
  var listening = false;

  server.listen(port, function () {
    listening = true;
  });

  stream.close = function () {
    server.close(function () {
      server.unref();
      stream.end();
    });
  };

  return stream;

  function onconnect (socket) {
    var open = true;
    socket.on('end', cleanup);
    socket.on('close', cleanup);
    socket.on('error', onerror);
    socket.on('readable', function () {
      var msg = null;
      var d = null;
      var chunk = null;
      while ((chunk = socket.read())) {
        msg = new Message(chunk);
        d = msg.shift();
        stream.emit('message', d);
      }
    });
    function cleanup () {
      if (false == open) { return; }
      socket.unpipe(stream);
      open = false;
    }
    function onerror (err) {
      stream.emit('error', err);
      cleanup();
    }
  }
}

