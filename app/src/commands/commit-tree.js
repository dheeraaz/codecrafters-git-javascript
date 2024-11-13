const fs = require("fs")
const crypto = require("crypto")
const path = require("path")
const zlib = require("zlib")

class CommitTreeCommand{
    constructor(treeSHA, commitSHA, commitMessage){
        this.treeSHA = treeSHA;
        this.commitSHA = commitSHA;
        this.commitMessage = commitMessage;
    }

    run(){
        const commitContentBuffer = Buffer.concat([
            Buffer.from(`tree ${this.treeSHA}\n`),
            Buffer.from(`parent ${this.commitSHA}\n`),
            Buffer.from(`author dhirajacharya <076bct023.dhiraj@pcampus.edu.np> ${Date.now()} +0101\n`),
            Buffer.from(`committer dhirajacharya <076bct023.dhiraj@pcampus.edu.np> ${Date.now()} +0101\n\n`),
            Buffer.from(`${this.commitMessage}\n`)
        ])

        const commitHeader = `commit ${commitContentBuffer.length}\0`;
        const commitBuffer = Buffer.concat([Buffer.from(commitHeader), commitContentBuffer]);

        const commitHash = crypto.createHash('sha1').update(commitBuffer).digest('hex');

        const folderName = commitHash.slice(0, 2);
        const fileName = commitHash.slice(2);

        const completeFolderPath = path.join(process.cwd(), ".git", "objects", folderName);

        if (!fs.existsSync(completeFolderPath)) fs.mkdirSync(completeFolderPath);

        const compressedFileContents = zlib.deflateSync(commitBuffer);

        fs.writeFileSync(path.join(completeFolderPath, fileName), compressedFileContents);

        process.stdout.write(commitHash);

    }
}

module.exports = CommitTreeCommand;