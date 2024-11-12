const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

class LsTreeCommand {
    constructor(flags, treeSHA) {
        this.flags = flags;
        this.treeSHA = treeSHA;
    }

    run() {
        // PS: here, only directory name is printed whether the user provides flag or not
        // The output is for: node ./app/main.js ls-tree --write-only <tree_SHA> || similar ouptut is obtained for: node ./app/main.js ls-tree <tree_SHA>

        // Navigate to: .git/objects/treeSHA[0..2]/treeSHA[2....end]
        const folderName = this.treeSHA.slice(0, 2);
        const fileName = this.treeSHA.slice(2);

        const completePath = path.join(process.cwd(), ".git", "objects", folderName, fileName);

        // checking if that file exists or not
        if(!fs.existsSync(completePath)){
            throw new Error(`fatal: Not a valid object name ${this.treeSHA}`);
        }

        // Decompress the contents using ZLib
        const compressedFileContents = fs.readFileSync(completePath);
        const outputBuffer = zlib.inflateSync(compressedFileContents);

        // Actual content of the tree, splitted based on null character
        const fileContents = outputBuffer.toString().split("\0");
        
        // parsing the content of the file
        const treeNames = fileContents.slice(1).filter(value => value.includes(" "));
        const names = treeNames.map(value=>value.split(" ")[1]).filter(item=>isNaN(item));

        // printing the tree names
        names.forEach(name => {
            process.stdout.write(`${name}\n`)
        });
    }
}

module.exports = LsTreeCommand;