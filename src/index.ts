#!/usr/bin/env node

import assert from 'assert'
import simpleGit from 'simple-git'

const main = async () => {
  try {
    const [, , k, v] = process.argv as [
      never,
      never,
      '-m' | 'push' | 'pull' | 'clean' | string | undefined,
      string | undefined
    ]

    const git = simpleGit({
      baseDir: process.cwd(),
      binary: 'git',
      maxConcurrentProcesses: 3
    }).outputHandler((bin, stdout, stderr, [cmd]) => {
      assert.equal(bin, 'git')

      if (!['branch', 'remote'].includes(cmd)) {
        stdout.pipe(process.stdout)
      }

      stderr.pipe(process.stderr)
    })

    const [{ name = 'origin' }] = await git.getRemotes()
    const { current } = await git.status()

    if (k && ['push', 'pull'].includes(k)) {
      await git[k](name, current)
    } else if (k === 'clean') {
      console.log(await git.branchLocal())
    } else {
      await Promise.all([
        git.add(['.', '-A']),
        git.commit(`${(k === '-m' ? v : k) ?? ''}`, {
          '--allow-empty-message': null
        }),
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
