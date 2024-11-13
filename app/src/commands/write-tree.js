const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");

class WriteTreeCommand {

    run() {
        const finalTreeHash = this.recursiveCreateTree(process.cwd());
        process.stdout.write(finalTreeHash);
    }

    recursiveCreateTree(basePath) {
        const dirContents = fs.readdirSync(basePath);

        const result = dirContents
            .filter((fileOrFolder) => fileOrFolder !== ".git") //skipping .git folder
            .map((fileOrFolder) => {
                const currentPath = path.join(basePath, fileOrFolder);
                // statSync returns stats related to file or folder
                const stat = fs.statSync(currentPath);

                if (stat.isDirectory()) {
                    const treeHash = this.recursiveCreateTree(currentPath);
                    if (treeHash) {
                        return { mode: "40000", basename: path.basename(currentPath), sha: treeHash };
                    }
                } else if (stat.isFile()) {
                    const fileHash = this.writeFIleAsBlob(currentPath);
                    return { mode: "100644", basename: path.basename(currentPath), sha: fileHash }
                }
            })
            .sort((a, b) => a.basename.localeCompare(b.basename));

        // skipping empty directory
        if (dirContents.length === 0 || result.length === 0) return null;

        const treeData = result.reduce((accumulator, currentObject) => {
            const { mode, basename, sha } = currentObject;

            return Buffer.concat([accumulator, Buffer.from(`${mode} ${basename}\0`), Buffer.from(sha, 'hex')]);
        }, Buffer.alloc(0))

        const tree = Buffer.concat([Buffer.from(`tree ${treeData.length}\0`), treeData]);

        const hash = crypto.createHash('sha1').update(tree).digest('hex');

        this.saveFileAsBlobFromHash(hash, tree);

        return hash;
    }

    writeFIleAsBlob(currentPath) {
        const fileContents = fs.readFileSync(currentPath);
        const fileContentsLength = fileContents.length;

        const blobHeader = `blob ${fileContentsLength}\0`;
        const blobObject = Buffer.concat([Buffer.from(blobHeader), fileContents]);

        const hash = crypto.createHash("sha1").update(blobObject).digest("hex");

        this.saveFileAsBlobFromHash(hash, blobObject)
        return hash;
    }

    saveFileAsBlobFromHash(hash, data) {
        const folderName = hash.slice(0, 2);
        const fileName = hash.slice(2);

        const completeFolderPath = path.join(process.cwd(), ".git", "objects", folderName);

        if (!fs.existsSync(completeFolderPath)) fs.mkdirSync(completeFolderPath);

        const compressedFileContents = zlib.deflateSync(data);

        fs.writeFileSync(path.join(completeFolderPath, fileName), compressedFileContents);
    }

}

module.exports = WriteTreeCommand;