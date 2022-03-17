import { is } from '@magic/test'
import fs from 'fs'
import zlib from 'zlib'
import util from 'util'

import zopfli from '../lib/zopfli.js'

const inflate = util.promisify(zlib.inflate)

const fixture = fs.readFileSync('test/.fixtures/test.js')

export default [
  { fn: zopfli.zlib(), expect: is.error, info: 'zlib without arguments returns error' },
  {
    info: 'zopfli.zlib returns buffer',
    fn: zopfli.zlib(fixture),
    expect: is.buffer,
  },
  {
    info: 'zopfli.zlib result can be zlib.inflated',
    fn: async () => {
      const res = await inflate(await zopfli.zlib(fixture))
      return res.toString()
    },
    expect: fixture.toString(),
  },
  {
    info: 'zopfli.zlibSync result is equal to zopfli.zlib',
    fn: async () => {
      const res = await inflate(await zopfli.zlib(fixture))
      return res.toString()
    },
    expect: async t => {
      const fixed = await inflate(zopfli.zlibSync(fixture))
      return t.toString() === fixed.toString()
    },
  },
]
