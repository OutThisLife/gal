# gal
Inspired by [git-push-all](https://github.com/ssmolkin1/git-push-all), I made this to get rid of some errors and simplify to just adding and pushing.

## Usage
Install via `npm i -g gal` or `yarn global add gal` and then use it like so:

|gal \<option>|git equiv|
|-|-|
|-d, --dry|run in dry mode|
|[msg...], -m [msg...]|`git add . -A`<br />`git commit -m "my message"`<br />`git push <origin> <branch>`|
|pull|`git pull <remote> <branch>`|
|push|`git push <remote> <branch>`|
|prune|`git remote prune <remote>, cleaning up local branches`|
|fetch|`git fetch <remote> <branch>`|
|rm \<branch>|delete branches, pass `-r` to delete remote|
