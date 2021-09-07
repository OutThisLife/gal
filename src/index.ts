#! /usr/bin/env node

import { exec } from 'child_process'

if (!exec('git')) {
  console.log(`Git not found`)

  process.exit(1)
}

const [, , msg] = process.argv

if (!`${msg}`.length) {
  console.log('No commit message found')

  process.exit(1)
}

exec('git add . -A')

exec(`git commit -m "${msg}"`)

exec('git status')

process.exit(0)
