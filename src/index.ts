#!/usr/bin/env node

import assert from 'assert'
import simpleGit from 'simple-git'

type Args = [
  never,
  never,
  'push' | 'pull' | '-m' | string | undefined,
  string | undefined
]

const main = async () => {
  const [, , k, v] = process.argv as Args

  try {
    const git = simpleGit({
      baseDir: process.cwd(),
      binary: 'git',
      maxConcurrentProcesses: 3
    }).outputHandler((bin, stdout, stderr, args) => {
      assert.equal(bin, 'git')
      console.log(args.join(' '))

      if (!['branch', 'remote'].includes(args[0])) {
        stdout.pipe(process.stdout)
        stderr.pipe(process.stderr)
      }
    })

    const [{ name = 'origin' }] = await git.getRemotes()
    const { current } = await git.branch()

    if (k && ['push', 'pull'].includes(k)) {
      await git[k](name, current)
    } else {
      await Promise.all([
        git.add(['.', '-A']),
        git.commit(`${k === '-m' ? v : k}`, { '--allow-empty': null }),
        git.push(`${name}`, `${current}`)
      ])
    }

    process.exit(0)
  } catch (err) {
    console.error(err)

    process.exit(1)
  }
}

main()
