#!/usr/bin/env node

//
;(async ({ version }) => {
  try {
    const { default: assert } = await import('assert')
    const { Command } = await import('commander')
    const { default: simpleGit } = await import('simple-git')

    const prog = new Command('gal')

    prog
      .version(`${version}`, '-v, --version')
      .option(
        '-d, --dry',
        'run in dry mode',
        process.env.NODE_ENV === 'development'
      )

    const git = simpleGit({
      baseDir: process.cwd(),
      binary: 'git'
    }).outputHandler((bin, stdout, stderr, [cmd]) => {
      assert.equal(bin, 'git')

      if (!/^(status|remote)/.test(`${cmd}`)) {
        stdout.pipe(process.stdout)
        stderr.pipe(process.stderr)
      }
    })

    const [{ name: remote = 'origin' }] = await git.getRemotes()
    const { current } = await git.status()

    if (!(remote && current)) {
      throw new Error('Are you in a git repo?')
    }

    prog
      .command('pull')
      .description('git pull <origin> <branch>')
      .action(async () => void (await git.pull(remote, current)))

    prog
      .command('fetch')
      .description('git fetch <remote> <branch>')
      .action(async () => void (await git.fetch(remote, current)))

    prog
      .command('push')
      .description('git pull <remote> <branch>')
      .action(async () => void (await git.push(remote, current)))

    prog
      .command('prune')
      .description('git remote prune <remote>, cleaning up local branches')
      .action(async () => void (await git.remote(['prune', remote])))

    prog
      .command('rm ')
      .arguments('<branch>')
      .description('delete branch')
      .option('-r', 'delete remote branch as well')
      .action(async (branch, { r = false }) => {
        try {
          await git.branch(['-D', branch])
        } catch (_) {}

        try {
          if (r) {
            await git.push([remote, `:${branch}`])
          }
        } catch (_) {}
      })

    prog
      .command('squash')
      .argument('[head]', 'head branch', 'master')
      .description('automatically squash commits on a branch into 1')
      .action(async head => {
        await git.env({
          ...process.env,
          GIT_SEQUENCE_EDITOR: `sed -i -se '2,$s/^pick/s/'`
        })

        await git.rebase(['-i', '--autosquash', head])
        await git.add(['-A'])
        await git.commit('')
        await git.push(remote, current)
      })

    prog
      .option('-m [msg...]')
      .argument('[msg...]')
      .description('git commit -m [msg]')
      .action(async (k, { dry, m }) => {
        const msg = (m ?? k ?? []) as string[]

        if (!msg.length) {
          msg.push('uptick')
        }

        if (
          !/^(feat|release|fix|style|docs|chore|test|refactor):$/.test(
            `${msg.at(0)}`
          )
        ) {
          msg.unshift('chore:')
        }

        msg.push('🦄')

        await git.add(['.', '-A'])
        await git.commit(msg.join(' '))

        if (!dry) {
          await git.push(remote, current)
        } else {
          console.log(msg)
        }
      })

    await prog.parseAsync(process.argv)

    process.exit(0)
  } catch (err: any) {
    console.error(err)

    process.exit(1)
  }
})(require('../package.json'))
