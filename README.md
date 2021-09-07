# gal
Inspired by [git-push-all](https://github.com/ssmolkin1/git-push-all), I made this to get rid of some errors and simplify to just adding and pushing.

## Usage
Install via `npm i -g gal` or `yarn global add gal` and then use it like so:

|gal \<option>|git equiv|
|-|-|
|\<empty>|`git add . -A`<br />`git commit --allow-empty-message`<br />`git push <origin> <branch>`|
|"my message"|`git add . -A`<br />`git commit -m "my message"`<br />`git push <origin> <branch>`|
|pull|`git pull <origin> <branch>`|
|push|`git push <origin> <branch>`|
|prune|`git remote prune origin`|
