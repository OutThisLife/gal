#!/usr/bin/env node

import debug from 'debug'
import simpleGit from 'simple-git'

debug.enable('simple-git:output:*')

const main = async () => {
  const [, , a, b] = process.argv

  if (!a?.length || (a === 'm' && !b?.length)) {
    console.log('No commit message found')

    process.exit(1)
  }

  const msg = a === '-m' ? b : a

  try {
    const git = simpleGit({
      baseDir: process.cwd(),
      binary: 'git',
      maxConcurrentProcesses: 3
    })

    const { current } = await git.branch()
    const [{ name = 'origin' }] = await git.getRemotes()

    if (!current) {
      console.log('Not on any branch, apparently?')

      process.exit(1)
    }

    await Promise.all([
      git.add(['.', '-A']),
      git.commit(`${msg}`),
      git.push(`${name}`, `${current}`, ['-n'])
    ])

    process.exit(0)
  } catch (err) {
    console.error(err)

    process.exit(1)
  }
}

main()
