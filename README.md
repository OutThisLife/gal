# gal

Inspired by [git-push-all](https://github.com/ssmolkin1/git-push-all), I made this to get rid of some errors and simplify to just adding and pushing.

## Usage

Install via `npm i -g gal` or `yarn global add gal` and then use it like so:

```
gal "my commit message"
```

Will run:

```
> git add . -A
> git commit -m "my commit message"
> git push <origin> <branch>
```

All in one!
