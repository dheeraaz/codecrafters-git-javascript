const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const zlib = require('zlib');

class HashObjectCommand{
    constructor(flags, filePath){
        this.flags = flags;
        this.filePath = filePath;
    }

    execute(){
        // checking if the file exists or not 
        // for this.filePath: index.js, filepath is: C:\Users\LEGION\Desktop\End\codecrafters-git-javascript\index.js 
        const filePath = path.resolve(this.filePath);

        if(!fs.existsSync(filePath)){
            throw new Error(`could not open ${this.filePath}: No Such file or directory exists.`)
        }

        // read the content and length of file
        const fileContents = fs.readFileSync(filePath); //here, fileContents is in Buffer Format
        const fileContentsLength = fileContents.length;

        // create the blob object: blob <size>\0<content> and also 
        const blobPart = `blob ${fileContentsLength}\0`;
        const blobObject = Buffer.concat([Buffer.from(blobPart), fileContents])

        // calculate/find the hash of blobObject
        const fileHash = crypto.createHash('sha1').update(blobObject).digest("hex");

        // Now, if the user has sent -w flags, create the file as: .git/objects/fileHash[0..2]/fileHash[2..end] 
        // Then compress the fileContents, and write into that file

        if(this.flags && this.flags==="-w"){
            const folderName = fileHash.slice(0, 2);
            const fileName = fileHash.slice(2);

            const completeFolderPath = path.join(process.cwd(), ".git", "objects", folderName);

            if(!fs.existsSync(completeFolderPath)){
                fs.mkdirSync(completeFolderPath, { recursive: true });
            }

            const compressedFileContents = zlib.deflateSync(blobObject);

            fs.writeFileSync(path.join(completeFolderPath, fileName), compressedFileContents)
        }

        process.stdout.write(fileHash);
    }
}

module.exports = HashObjectCommand;