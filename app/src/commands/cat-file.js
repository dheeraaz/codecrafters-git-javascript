const path = require("path");
const fs = require("fs");
const zlib = require('zlib');

class CatFileCommand {
    constructor(flags, commitHash) {
        // flags can be: -p, -t and -s
        this.flags = flags;
        this.commitHash = commitHash;
    }

    execute() {
        /*steps:
        1. Navigate to: .git/objects/commitHash[0..2]
        2. Read the file from that directory: commitHash[2....end]
        3. Decompress the contents using ZLib
        4. Extract actual content from decompressed data and print the content
        */

        switch (this.flags) {
            case "-p":
                {
                    const folderName = this.commitHash.slice(0,2);
                    const fileName = this.commitHash.slice(2);

                    const completePath = path.join(process.cwd(), ".git", "objects", folderName, fileName);

                    // checking if the file exists or not and throwing error

                    if(!fs. existsSync(completePath)){
                        throw new Error(`Not a valid object name ${this.commitHash}`)
                    }

                    const compressedFileContents = fs.readFileSync(completePath);
                    const outputBuffer = zlib.inflateSync(compressedFileContents);
                    // just removing \n from the output before printing it 
                    const originalFileContents = outputBuffer.toString().split("\x00")[1];

                    process.stdout.write(originalFileContents);
                }
                break;
            default:
                throw new Error(`Unknown flag ${this.flags}`);
        }
    }
}

module.exports = CatFileCommand;