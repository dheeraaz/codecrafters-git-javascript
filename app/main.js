const fs = require("fs");
const path = require("path");

const { CatFileCommand, HashObjectCommand, LsTreeCommand, WriteTreeCommand, CommitTreeCommand } = require('./src/commands')

const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handleCatFileCommand();
    break;
  case "hash-object":
    handleHashObjectCommand();
    break;
  case "ls-tree":
    handleLsTreeCommand();
    break;
  case "write-tree":
    handleWriteTreeCommand();
    break;
  case "commit-tree":
    handleCommitTreeCommand();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });
  
  //NOTE: The recursive option in fs.mkdirSync() determines whether parent directories should be created if they do not exist.
  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}

function handleCatFileCommand() {
  const flags = process.argv[3];
  const commitSHA_Hash = process.argv[4];

  const catFileCommand = new CatFileCommand(flags, commitSHA_Hash);
  catFileCommand.run();

}

function handleHashObjectCommand() {
  let flags = process.argv[3];
  let filePath = process.argv[4];

  // if the user just provides flags, but do not provide filepath, then return
  if(!filePath && flags === "-w") return;

  // condition, when the user donot provide the flags
  if (!filePath) {
    filePath = flags;
    flags = null;
  }

  const hashObjectCommand = new HashObjectCommand(flags, filePath);
  hashObjectCommand.run()
}

function handleLsTreeCommand(){
  // node ./app/main.js ls-tree --name-only <tree_Sha>

  let flags = process.argv[3];
  let treeSHA = process.argv[4];

  // if the user just provides flags, but do not provide treeSHA, then return
  if(!treeSHA && flags === "--name-only") return;

  // condition when user donot provide flag: node ./app/main.js ls-tree <tree_Sha>
  if(!treeSHA){
    treeSHA = flags;
    flags = null;
  }

  const lstreeCommand = new LsTreeCommand(flags, treeSHA);
  lstreeCommand.run();
}

function handleWriteTreeCommand(){
  const writeTreeCommand = new WriteTreeCommand();
  writeTreeCommand.run();
};

function handleCommitTreeCommand(){
  const treeSHA = process.argv[3];
  const commitSHA = process.argv[5];
  const commitMessage = process.argv[7];

  const commitTreeCommand = new CommitTreeCommand(treeSHA, commitSHA, commitMessage);
  commitTreeCommand.run();
};




