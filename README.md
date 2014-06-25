ppq
===

Push/Pull TCP Messaging. Somewhat inspired by [punt](https://github.com/visionmedia/punt).

## install

```sh
$ npm install ppq
```

## usage

Pull server

```js
var pull = require('ppq/pull')
var server = pull(3000);

server.on('message', function (msg) {
  console.log(msg);
});
```

Push client

```js
var push = require('ppq/push');
var a = push('0.0.0.0:3000');
var b = push('0.0.0.0:3000');

setInterval(function () {
  a.send('kinkajou');
}, 500);

setInterval(function () {
  b.send('panda');
}, 800);
```

## api

### pull(port)

Returns a readable and writable stream listening on `port`.

#### #close

Closes the server listening on `port`.

### push(addr)

Returns a readable and writable stream bound to `addr`.

#### #send

Sends an arbitrary message to bound `addr`.

## license

MIT
