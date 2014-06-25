
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
  var stream = through();

  stream.send = function (data) {
    var client = null;
    // attempt connection
    void function connect () {
      client = net.connect({port:u.port}, function () {
        var msg = null;
        if (null != data) {
          msg = new Message();
          msg.push(data);
          client.write(msg.toBuffer());
          client.end();
        }
      });

      client.on('error', function (err) {
        if ('ECONNREFUSED' == err.code) {
          return process.nextTick(connect);
        }
      });

      stream.pipe(client);
    }();

    return this;
  };

  return stream;
}
