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
- `git commit-tree <tree_sha> -p <Parent_commit_sha> -m <message>`

# Resources Followed:
Along with the instructions provided in the codecrafters challenge, following are the resources followed to complete this project:
- Reference1 : https://blog.meain.io/2023/what-is-in-dot-git/
- Reference2 : https://git-scm.com/book/en/v2/Git-Internals-Git-Objects

# Installation and Setup || Testing Locally
1. **Clone the repository:**
   ```bash
   git clone https://github.com/dheeraaz/codecrafters-git-javascript.git
   
2. **Navigate to the project directory:**
   ``` bash
   cd codecrafters-git-javascript
   
3. **`init` command**:
   
   ``` bash
   node .\app\main.js init
   
4. **`cat-file -p <commit_SHA>` or `cat-file -s <commit_SHA>` command**

   First, make an empty commit  
   ```bash
   git add .
   git commit --allow-empty -m 'test'
   ```
   Then copy the <commit_SHA of test> by using `git log` command
   ```bash
   git log
   ```
   Now read the blob object as
   ``` bash
   node .\app\main.js cat-file -p <commit_SHA of test>
   ```
   Or, for size of file
   ``` bash
   node .\app\main.js cat-file -s <commit_SHA of test>
   ```

5. **`hash-object <filepath>` or `hash-object -w <filepath>>` command**

   For computing the SHA hash of a Git object, say for package.json [this will not write the file]  
   ```bash
   node .\app\main.js hash-object .\package.json
   ```
   When used with the -w flag, it also writes the object to the .git/objects directory.
   ```bash
   node .\app\main.js hash-object -w .\package.json
   ```
   **PS**: This will create the file as: .git/objects/fileSHA[0..2]/fileSHA[2....end]
   
6. **`write-tree` command**

   This command will return the tree SHA as well as writes the tree object into .git/objects directory  
   ```bash
   node .\app\main.js write-tree 
   ```
   
7. **`ls-tree <tree_SHA>` || `ls-tree --name-only <tree_SHA>` command**

   Note: whether --name-only flag is passed or not, the output is always equivalent to ls-tree --name-only command

   First find and copy the SHA of tree, for that use
   ```bash
   node .\app\main.js write-tree 
   ```
   After that run this command for ls tree
   ``` bash
   node .\app\main.js ls-tree <tree_SHA>
   ```
   
8. **`commit-tree <tree_sha> -p <Parent_commit_sha> -m <message>` command**
   </br>   
   Create a tree, get its SHA
   ``` bash
   echo "hello world" > sample.txt
   git add sample.txt
   git write-tree
   1723393b4898695515ac61d7c2a1f8bdbcd55ecd
   ```
   Create the initial commit
   ``` bash
   git commit-tree 1723393b4898695515ac61d7c2a1f8bdbcd55ecd -m "Initial Commit"
   f872e9f1c3fe061753f9924649d6603c267279b6
   ```
   Write some changes, get another tree SHA
   ``` bash
   echo "hello world 2" > sample.txt
   git add sample.txt
   git write-tree
   924a66aa3389d928836a7bd80b2e631736d81d47
   ```
   Create a **new commit** with the **new tree SHA**
   ``` bash
   node .\app\main.js commit-tree 924a66aa3389d928836a7bd80b2e631736d81d47 -p f872e9f1c3fe061753f9924649d6603c267279b6 -m "Second Commit"
   86e88f2834c1be7af07f5f34b23e2bd387fc63f6
   ```
   To verify this commit, run this command:
   ``` bash
   node .\app\main.js cat-file -p 86e88f2834c1be7af07f5f34b23e2bd387fc63f6
   ```
   
  
   
   
