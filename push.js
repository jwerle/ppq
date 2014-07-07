
/**
 * Module dependencies
 */

var Message = require('amp-message')
  , net = require('net')
  , url = require('url')
  , through = require('through')
  , isLocalhost = require('is-localhost')

/**
 * Pushes a message to a given addr
 * over TCP.
 *
 * @api public
 * @param {String} addr
 */

module.exports = push;
function push (addr) {
  if (Number(addr) == Number(addr)) {
    addr = 'tcp://127.0.0.1:'+ addr;
  } else if (-1 == addr.indexOf('tcp://')) {
    addr = 'tcp://' + addr;
  }

  var opts = {};
  var u = url.parse(addr);
  var stream = through();

  opts.port = u.port;
  if (!isLocalhost(u.hostname)) {
    opts.host = u.hostname;
  }

  stream.send = function (data) {
    var client = null;
    var alt = {};
    // presevre `Error' instances during
    // serialization
    if (data instanceof Error) {
      Object.getOwnPropertyNames(data).forEach(function (key) {
        alt[key] = this[key];
      }, data);
      data = alt;
    }
    // attempt connection
    void function connect () {
      client = net.connect(opts, function () {
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
