#!/usr/bin/env node

import simpleGit from 'simple-git'

const main = async () => {
  const [, , msg] = process.argv

  if (!`${msg}`.length) {
    console.log('No commit message found')

    process.exit(1)
  }

  const git = simpleGit({
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 1
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
    git.push(`${name}`, `${current}`)
  ])

  process.exit(0)
}

main()
