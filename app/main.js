const fs = require("fs");
const path = require("path");

const { CatFileCommand, HashObjectCommand } = require('./src/commands')

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
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}

function handleCatFileCommand() {
  const flags = process.argv[3];
  const commitSHA_Hash = process.argv[4];

  const catFileCommand = new CatFileCommand(flags, commitSHA_Hash);
  catFileCommand.execute();

}

function handleHashObjectCommand() {
  let flags = process.argv[3];
  let filePath = process.argv[4];

  if (!filePath) {
    filePath = flags;
    flags = null;
  }

  const hashObjectCommand = new HashObjectCommand(flags, filePath);
  hashObjectCommand.execute()
}

