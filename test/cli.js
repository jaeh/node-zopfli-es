'use strict'

import { is, tryCatch, fs } from '@magic/test'
import { exec } from '@magic/cli'

import path from 'path'

const binary = `node ${path.join(process.cwd(), 'bin', 'zopfli')}`

const fixture = path.join(process.cwd(), 'test', '.fixtures', 'test.css')
const zipped = `${fixture}.gz`

export default [
  { fn: tryCatch(exec, binary), expect: is.error, info: 'fail without arguments' },
  {
    fn: () => exec(`${binary} ${fixture}`),
    expect: () => fs.exists(zipped),
    before: () => () => fs.rmrf(zipped),
    info: 'zipped file exists after zipping',
  },
]
