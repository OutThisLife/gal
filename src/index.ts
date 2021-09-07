#!/usr/bin/env node

import assert from 'assert'
import simpleGit from 'simple-git'

const main = async () => {
  try {
    const [, , k, v] = process.argv

    const git = simpleGit({
      baseDir: process.cwd(),
      binary: 'git',
      maxConcurrentProcesses: 3
    }).outputHandler((bin, stdout, stderr, args) => {
      assert.equal(bin, 'git')

      if (args.length > 1 && !args.includes('status')) {
        stdout.pipe(process.stdout)
        stderr.pipe(process.stderr)
      }
    })

    const [{ name = 'origin' }] = await git.getRemotes()
    const { current } = await git.status()

    if (k && ['push', 'pull'].includes(k)) {
      await git[k](name, current)
    } else if (k === 'prune') {
      await git.remote(['prune', name])
    } else {
      await Promise.all([
        git.add(['.', '-A']),
        git.commit((k === '-m' ? v : k) ?? '', {
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
