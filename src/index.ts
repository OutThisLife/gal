#!/usr/bin/env node

;(async ({ version }) => {
  try {
    const { default: assert } = await import('assert')
    const { Command } = await import('commander')
    const { default: simpleGit } = await import('simple-git')

    const prog = new Command('gal')

    prog
      .version(`${version}`, '-v, --version')
      .option('-d, --dry', 'run in dry mode')

    const git = simpleGit({
      baseDir: process.cwd(),
      binary: 'git'
    }).outputHandler((bin, stdout, stderr, args) => {
      assert.equal(bin, 'git')

      if (args.length > 1 && !args.includes('status')) {
        stdout.pipe(process.stdout)
        stderr.pipe(process.stderr)
      }
    })

    const [{ name: remote = 'origin' }] = await git.getRemotes()
    const { current: branch } = await git.status()

    if (!(remote && branch)) {
      throw new Error('Are you in a git repo?')
    }

    prog
      .command('pull')
      .description('git pull <origin> <branch>')
      .action(async () => void git.pull(remote, branch))

    prog
      .command('fetch')
      .description('git fetch <remote> <branch>')
      .action(async () => void git.fetch(remote, branch))

    prog
      .command('push')
      .description('git pull <remote> <branch>')
      .action(async () => void git.push(remote, branch))

    prog
      .command('prune')
      .description('git remote prune <remote>, cleaning up local branches')
      .action(async () => void git.remote(['prune', remote]))

    prog
      .command('squash')
      .description('automatically squash commits on a branch into 1')
      .action(async (_, { dry }) => {
        await git.env({
          ...process.env,
          GIT_SEQUENCE_EDITOR: true
        })

        await git.rebase(['-i', '--autosquash', 'master'])
        await git.add(['-A'])
        await git.commit('')

        if (!dry) {
          await git.push(remote, branch)
        }
      })

    prog
      .option('-m [msg...]')
      .argument('[msg...]')
      .description('git commit -m [msg]')
      .action(async (k, { dry, m }) => {
        const msg = m ?? k

        await git.add(['.', '-A'])

        if (!msg?.length) {
          await git.commit('', { '--allow-empty-message': null })
        } else {
          if (!/^(feat|fix|style|docs|chore|test|refactor):$/.test(msg[0])) {
            msg.unshift('chore:')
          }

          await git.commit(msg.join(' '))
        }

        if (!dry) {
          await git.push(remote, branch)
        }
      })

    await prog.parseAsync(process.argv)

    process.exit(0)
  } catch (err: any) {
    console.error(err)

    process.exit(1)
  }
})(require('../package.json'))
