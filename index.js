// non-destructive. accepts two osm-p2p-db databases and writes ndjson to
// stdout with the documents that are in input #2 but not input #1

var TopoSort = require('topo-sort')
var through = require('through2')

module.exports = function (log1, log2) {
  var t = through()

  var nodes = {}
  var docs = {}

  indexLog(log1, function () {
    indexLog(log2, function () {
      var versions = {}
      var tsort = new TopoSort()

      Object.keys(docs).forEach(function (id, n) {
        docs[id].forEach(function (d) {
          tsort.add(d._version, d._links)
          versions[d._version] = d
        })
      })

      var res = tsort.sort().reverse()
      res.forEach(function (v) {
        var doc = versions[v]
        if (doc._log.length === 1 && doc._log[0] === 2) {
          t.write(JSON.stringify(doc))
        }
      })
    })
  })

  return t

  function indexLog (log, done) {
    log.createReadStream()
      .on('data', function (node) {
        var value = JSON.parse(node.value.toString())

        if (nodes[node.key]) {
          if (nodes[node.key]._log.indexOf(log.__id) === -1) {
            nodes[node.key]._log.push(log.__id)
          }
          return
        }

        var doc
        if (value.k) {
          doc = value.v
          doc.id = value.k
          doc._links = node.links
          doc._log = [log.__id]
          doc._version = node.key
        } else {
          doc = {
            id: value.d,
            _version: node.key,
            _links: node.links,
            _log: [log.__id],
            _points: value.points,
            _refs: value.refs,
            deleted: true
          }
        }

        if (!docs[doc.id]) {
          docs[doc.id] = []
        }
        docs[doc.id].push(doc)

        nodes[node.key] = doc
      })
      .on('end', done)
  }
}
