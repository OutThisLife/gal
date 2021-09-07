#!/usr/bin/env node

import simpleGit from 'simple-git'

const main = async () => {
  const [, , a, b] = process.argv

  if (!a?.length || (a === 'm' && !b?.length)) {
    console.log('No commit message found')

    process.exit(1)
  }

  const msg = a === '-m' ? b : a

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

  const [, , res] = await Promise.all([
    git.add(['.', '-A']),
    git.commit(`${msg}`),
    git.push(`${name}`, `${current}`)
  ])

  console.log(res.remoteMessages)

  process.exit(0)
}

main()
