[![progress-banner](https://backend.codecrafters.io/progress/git/d8852c51-d735-45b6-bc80-81b2ed5906bc)](https://app.codecrafters.io/users/codecrafters-bot?r=2qF)

This is a JavaScript solutions to the
["Build Your Own Git" Challenge](https://codecrafters.io/challenges/git).

In this challenge, I have built a small Git implementation that's capable of
initializing a repository and creating the commits.
Along the way I learnt about the `.git` directory, Git objects (blobs,
commits, trees etc.) and more.

**Note**: To try this challenge, head over to [codecrafters.io](https://codecrafters.io) 

# Commands Implemented
- `git init`
- `git cat-file -p <commit_SHA>`
- `git cat-file -s <commit_SHA>`
- `git hash-object <filepath>`
- `git hash-object -w <filepath>`
- `git ls-tree <tree_SHA> || git ls-tree --name-only <tree_SHA>`
- `git write-tree`
- `git commit-tree <tree_sha> -p <commit_sha> -m <message>`

# Stage 2 & beyond

Note: This section is for stages 2 and beyond.

1. Ensure you have `node (21)` installed locally
1. Run `./your_program.sh` to run your Git implementation, which is implemented
   in `app/main.js`.
1. Commit your changes and run `git push origin master` to submit your solution
   to CodeCrafters. Test output will be streamed to your terminal.

# Testing locally

The `your_program.sh` script is expected to operate on the `.git` folder inside
the current working directory. If you're running this inside the root of this
repository, you might end up accidentally damaging your repository's `.git`
folder.

We suggest executing `your_program.sh` in a different folder when testing
locally. For example:

```sh
mkdir -p /tmp/testing && cd /tmp/testing
/path/to/your/repo/your_program.sh init
```

To make this easier to type out, you could add a
[shell alias](https://shapeshed.com/unix-alias/):

```sh
alias mygit=/path/to/your/repo/your_program.sh

mkdir -p /tmp/testing && cd /tmp/testing
mygit init
```
