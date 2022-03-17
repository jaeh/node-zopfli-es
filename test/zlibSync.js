import { is } from '@magic/test'
import fs from 'fs'
import zlib from 'zlib'
import util from 'util'

import zopfli from '../lib/zopfli.js'

const inflate = util.promisify(zlib.inflate)

const fixture = fs.readFileSync('test/.fixtures/test.js')

export default [
  { fn: zopfli.zlibSync(), expect: is.error, info: 'empty buffer returns error' },
  {
    info: 'buffer arg returns buffer',
    fn: zopfli.zlibSync(fixture),
    expect: is.buffer,
  },
  {
    info: 'string arg returns buffer',
    fn: zopfli.zlibSync(fixture.toString()),
    expect: is.buffer,
  },
  {
    info: 'result can be zlib.inflated',
    fn: async () => {
      const res = await inflate(zopfli.zlibSync(fixture))
      return res.toString()
    },
    expect: fixture.toString(),
  },
  {
    info: 'zopfli.zlibSync result is equal to zopfli.zlib',
    fn: async () => {
      const res = await inflate(zopfli.zlibSync(fixture))
      return res.toString()
    },
    expect: async t => {
      const fixed = await inflate(await zopfli.zlib(fixture))
      return t.toString() === fixed.toString()
    },
  },
]
