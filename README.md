# osm-p2p-diff

> Generate a diff of OSM documents in two osm-p2p-db instances.

Writes, to standard out, all of the OSM documents that appear in the second DB
that don't appear in the first, as newline-delimited JSON.

Can be used in conjunction with
[osm-p2p-append](https://github.com/noffle/osm-p2p-append) to merge two
osm-p2p-db databases together.

## CLI

```
  USAGE: osm-p2p-diff <LEVELDB-DIR> <LEVELDB-DIR>
```

Point this at two [hyperlog](https://github.com/mafintosh/hyperlog) leveldb
directories. If you're working with an osm-p2p-db, this will be `osm-dir/log`.

## API

```js
var diff = require('osm-p2p-diff')
```

### var readable = diff(log1, log2)

Accepts two hyperlog instances of two `osm-p2p-db`s. Returns a Readable stream
of newline-delimited JSON containing the documents that are in `log2` but not
`log1`.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install -g osm-p2p-diff
```

## See Also

- [osm-p2p-append](https://github.com/noffle/osm-p2p-append)

## License

ISC
