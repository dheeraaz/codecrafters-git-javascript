const fs = require("fs");
const path = require("path");

const {CatFileCommand} = require('./src/commands')

console.error("Logs from your program will appear here!");

const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handleCatFileCommand();
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
  const commitHash = process.argv[4];

  const catFileCommand = new CatFileCommand(flags, commitHash);
  catFileCommand.execute();

}

