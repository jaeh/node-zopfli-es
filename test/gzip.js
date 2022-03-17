import { is } from '@magic/test'
import fs from 'fs'
import zlib from 'zlib'
import util from 'util'

import zopfli from '../lib/zopfli.js'

const gunzip = util.promisify(zlib.gunzip)

const fixture = fs.readFileSync('test/.fixtures/test.js')

const catchable = async (fn, ...args) => {
  const oldError = console.error
  console.error = () => {}
  try {
    const res = await fn(...args)
    return res
  } catch (e) {
    // return e
  }
  console.error = oldError
}

export default [
  { fn: catchable(zopfli.gzip), expect: is.error, info: 'gzip empty arguments returns error' },
  { fn: catchable(zopfli.gzip, 'string'), expect: is.buffer, info: 'gzip string returns buffer' },
  {
    info: 'returns a buffer if called with a buffer',
    fn: zopfli.gzip(fixture),
    expect: is.buffer,
  },
  {
    info: 'returns a buffer if called with a string',
    fn: zopfli.gzip(fixture.toString()),
    expect: is.buffer,
  },
  {
    info: 'zopfli.gzip called with a string can be inflated using zlib',
    fn: async () => await gunzip(await zopfli.gzip(fixture.toString())),
    expect: fixture,
  },
  {
    info: 'zopfli.gzip called with a buffer can be inflated using zlib',
    fn: async () => await gunzip(await zopfli.gzip(fixture)),
    expect: fixture,
  },
]
