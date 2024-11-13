const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");

class WriteTreeCommand {
    run() {
        const treeHash = this.createTreeForPath(process.cwd());
        process.stdout.write(treeHash);
    }

    createTreeForPath(basePath) {
        const dirContent = fs.readdirSync(basePath);

        const entries = dirContent
            .filter((fileOrFolder) => fileOrFolder !== ".git")
            .map((fileOrFolder) => {
                const currentPath = path.join(basePath, fileOrFolder);
                // statSync returns stats related to file or folder
                const stat = fs.statSync(currentPath);

                if (stat.isDirectory()) {
                    const treehash = this.createTreeForPath(currentPath);

                    if (treehash) {
                        return { mode: "40000", basename: path.basename(currentPath), hash: treehash }
                    }
                } else if (stat.isFile()) {
                    const fileHash = this.writeFileAsBlob(currentPath);

                    return { mode: "100644", basename: path.basename(currentPath), hash: fileHash };
                }
            })
            // .sort((a, b) => a.basename.localeCompare(b.basename));

        // not tracking empty directory
        if (dirContent.length === 0 || entries.length === 0) return null;

        const treeData = entries.reduce((accumulator, currentObject) => {
            const { mode, basename, hash } = currentObject;

            return Buffer.concat([accumulator, Buffer.from(`${mode} ${basename}\0`), Buffer.from(hash, "hex")]);
        }, Buffer.alloc(0))

        const tree = Buffer.from([Buffer.from(`tree ${treeData.length}\0`), treeData]);

        const finalTreeHash = crypto.createHash('sha1').update(tree).digest('hex');

        const folderName = finalTreeHash.slice(0, 2);
        const fileName = finalTreeHash.slice(2);

        const treeFolderPath = path.join(process.cwd(), ".git", "objects", folderName);

        if (!fs.existsSync(treeFolderPath)) {
            fs.mkdirSync(treeFolderPath, { recursive: true });
        }

        const compressedFileContents = zlib.deflateSync(tree);
        fs.writeFileSync(path.join(treeFolderPath, fileName), compressedFileContents);

        return finalTreeHash;
    }

    writeFileAsBlob(filePath) {
        // read the content and length of file
        const fileContents = fs.readFileSync(filePath); //here, fileContents is in Buffer Format
        const fileContentsLength = fileContents.length;

        // create the blob object: blob <size>\0<content> and also 
        const blobPart = `blob ${fileContentsLength}\0`;
        const blobObject = Buffer.concat([Buffer.from(blobPart), fileContents]);

        // create the file as: .git/objects/fileHash[0..2]/fileHash[2..end] 
        // Then compress the fileContents, and write into that file

        // calculate/find the hash of blobObject
        const fileHash = crypto.createHash('sha1').update(blobObject).digest("hex");

        const folderName = fileHash.slice(0, 2);
        const fileName = fileHash.slice(2);

        const completeFolderPath = path.join(process.cwd(), ".git", "objects", folderName);

        if (!fs.existsSync(completeFolderPath)) {
            fs.mkdirSync(completeFolderPath, { recursive: true });
        }

        const compressedFileContents = zlib.deflateSync(blobObject);
        fs.writeFileSync(path.join(completeFolderPath, fileName), compressedFileContents);

        return fileHash;
    }

}

module.exports = WriteTreeCommand;