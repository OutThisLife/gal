#!/usr/bin/env node

import assert from 'assert'
import simpleGit from 'simple-git'

type Args = [never, never, 'pull' | 'push' | '-m' | string, string | undefined]

const main = async () => {
  const [, , k, v] = process.argv as Args

  if (!k?.length) {
    console.log('No commit message found')

    process.exit(1)
  }

  try {
    const git = simpleGit({
      baseDir: process.cwd(),
      binary: 'git',
      maxConcurrentProcesses: 3
    }).outputHandler((bin, stdout, stderr, [cmd]) => {
      assert.equal(bin, 'git')

      if (!['branch', 'remote'].includes(cmd)) {
        stdout.pipe(process.stdout)
        stderr.pipe(process.stderr)
      }
    })

    const [{ name = 'origin' }] = await git.getRemotes()
    const { current } = await git.branch()

    switch (k) {
      case 'pull':
        await git.pull(name, current)

        break

      case 'push':
        await git.push(name, current)

        break

      default:
        await Promise.all([
          git.add(['.', '-A']),
          git.commit(`${k === '-m' ? v : k}`),
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
