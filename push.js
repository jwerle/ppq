
/**
 * Module dependencies
 */

var Message = require('amp-message')
  , net = require('net')
  , url = require('url')
  , through = require('through')

/**
 * Pushes a message to a given host
 * over TCP.
 *
 * @api public
 * @param {String} host
 */

module.exports = push;
function push (host) {
  if (-1 == host.indexOf('tcp://')) {
    host = 'tcp://'+host;
  }

  var u = url.parse(host);
  var client = null;
  var stream = through();
  var open = false;

  stream.send = function (data) {
    var msg = null;
    if (null != data) {
      msg = new Message(data);
      client.write(msg.toBuffer());
    }
    return this;
  };

  // attempt connection
  void function connect () {
    client = net.connect(u.port, u.hostname, function () {
     open = true;
    });

    client.on('error', function (err) {
      if ('ECONNREFUSED' == err.code) {
        return connect();
      }
    });
  }();

  return stream;
}
