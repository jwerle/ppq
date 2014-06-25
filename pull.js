
/**
 * Module dependencies
 */

var net = require('net')
  , Message = require('amp-message')
  , through = require('through')
  , url = require('url')

/**
 * Pull messages from host
 *
 * @api public
 * @param {String} host
 */

module.exports = pull;
function pull (host) {
  if (-1 == host.indexOf('tcp://')) {
    host = 'tcp://'+host;
  }
  var u = url.parse(host);
  var server = net.createServer(onconnect);
  var stream = through(write);
  var listening = false;

  server.listen(u.port, function () {
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
    socket.pipe(stream);
    socket.on('end', cleanup);
    socket.on('close', cleanup);
    socket.on('error', onerror);
    function cleanup () {
      if (false == open) { return; }
      socket.unpipe(stream);
    }
    function onerror (err) {
      stream.emit('error', err);
      cleanup();
    }
  }

  function write (chunk) {
    var msg = null;
    var d = null;
    if (null != chunk) {
      msg = new Message(chunk);
      d = msg.shift();
      this.push(d);
      stream.emit('message', d);
    }
  }
}

