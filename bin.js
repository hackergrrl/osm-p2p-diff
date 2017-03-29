#!/usr/bin/env node

if (process.argv.length !== 4) {
  console.error('USAGE: osm-p2p-diff <LEVELDB-DIR> <LEVELDB-DIR>')
  process.exit(1)
}

var level = require('level')
var hyperlog = require('hyperlog')

var log1 = hyperlog(level(process.argv[2]))
log1.__id = 1

var log2 = hyperlog(level(process.argv[3]))
log2.__id = 2

require('./')(log1, log2).pipe(process.stdout)
