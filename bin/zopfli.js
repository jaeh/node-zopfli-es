#!/usr/bin/env node

import { program } from 'commander'
import fs from 'fs'
import zopfli from '../lib/zopfli.js'

program
  .usage('[options] [files...]')
  .option('--deflate', 'raw deflate (without container)')
  .option('--zlib', 'deflate using zlib container')
  .option('--gzip', 'deflate using gzip container')
  .option('-e, --ext <s>', 'overwrite default file extension')
  .option('-i, --iterations <n>', 'number of iterations (higher = smaller = slower)', parseInt)
  .option('-v, --verbose', 'Verbose')
  .parse(process.argv)
  .version(process.env.npm_package_version)

const options = {
  verbose: false,
  verbose_more: false,
  numiterations: 15,
  blocksplitting: true,
  blocksplittinglast: false,
  blocksplittingmax: 15,
}

if (program.iterations) {
  options.numiterations = parseInt(program.iterations, 10)
}

if (program.verbose) {
  options.verbose = program.verbose
}

let method = zopfli.createGzip
let extension = 'gz'

if (program.deflate) {
  method = zopfli.createDeflate
  extension = 'deflate'
}
if (program.zlib) {
  method = zopfli.createZlib
  extension = 'zlib'
}
if (program.ext) {
  extension = program.ext
}

if (program.args.length === 0) {
  program.outputHelp()
  process.exit(1)
} else {
  const mapper = item =>
    new Promise((resolve, reject) =>
      fs
        .createReadStream(item)
        .on('error', reject)
        .pipe(method(options))
        .on('error', reject)
        .pipe(fs.createWriteStream(item + '.' + extension))
        .on('error', reject)
        .on('finish', resolve),
    )

  Promise.all(program.args.map(mapper))
}
