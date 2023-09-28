/* jshint mocha: true */

'use strict'

import { is, tryCatch } from '@magic/test'

import util from 'util'
import path from 'path'
import fs from 'fs'
import cp from 'child_process'

const xc = util.promisify(cp.exec)
const exists = util.promisify(fs.exists)
const unlink = util.promisify(fs.unlink)

const binary = `node ${path.join(process.cwd(), 'bin', 'zopfli')}`

const fixture = path.join(process.cwd(), 'test', '.fixtures', 'test.css')
const zipped = `${fixture}.gz`

const before = async () => {
  await unlink(zipped)
}

export default [
  { fn: tryCatch(xc, binary), expect: is.error, info: 'fail without arguments' },
  {
    fn: () => new Promise(r => cp.exec(`${binary} ${fixture}`, r)),
    expect: async () => await exists(zipped),
    before,
    info: 'zipped file exists after zipping',
  },
]
