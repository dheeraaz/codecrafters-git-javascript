const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");

function writeFIleBlob(currentPath) {

    const contents = fs.readFileSync(currentPath);
    const len = contents.length;

    const header = `blob ${len}\0`;
    const blob = Buffer.concat([Buffer.from(header), contents]);

    const hash = crypto.createHash("sha1").update(blob).digest("hex");

    const folderName = hash.slice(0, 2);
    const fileName = hash.slice(2);

    const completeFolderPath = path.join(process.cwd(), ".git", "objects", folderName);

    if (!fs.existsSync(completeFolderPath)) {
        fs.mkdirSync(completeFolderPath);
    }

    const compressedFileContents = zlib.deflateSync(blob);

    fs.writeFileSync(path.join(completeFolderPath, fileName), compressedFileContents);

    return hash;
}

class WriteTreeCommand {

    run() {

        function recursiveCreateTree(basePath) {
            const dirContents = fs.readdirSync(basePath);

            const result = [];

            for (const dirContent of dirContents) {
                // skipping .git folder
                if (dirContent.includes(".git")) continue;

                const currentPath = path.join(basePath, dirContent);

                const stat = fs.statSync(currentPath)

                if (stat.isDirectory()) {
                    const sha = recursiveCreateTree(currentPath);
                    if (sha) {
                        result.push({ mode: "40000", basename: path.basename(currentPath), sha })
                    }
                } else if (stat.isFile()) {
                    const sha = writeFIleBlob(currentPath);

                    result.push({ mode: "100644", basename: path.basename(currentPath), sha })
                }

            }

            if (dirContents.length === 0 || result.length === 0) return null;

            const treeData = result.reduce((acc, current) => {
                const { mode, basename, sha } = current;

                return Buffer.concat([acc, Buffer.from(`${mode} ${basename}\0`), Buffer.from(sha, 'hex')]);
            }, Buffer.alloc(0))

            const tree = Buffer.concat([Buffer.from(`tree ${treeData.length}\0`), treeData]);

            const hash = crypto.createHash('sha1').update(tree).digest('hex');

            const folderName = hash.slice(0, 2);
            const fileName = hash.slice(2);

            const treeFolderPath = path.join(process.cwd(), ".git", "objects", folderName);

            if (!fs.existsSync(treeFolderPath)) {
                fs.mkdirSync(treeFolderPath);
            }

            const compressedFileContents = zlib.deflateSync(tree);

            fs.writeFileSync(path.join(treeFolderPath, fileName), compressedFileContents);

            return hash;
        }

        const sha = recursiveCreateTree(process.cwd());
        process.stdout.write(sha);

    }

}

module.exports = WriteTreeCommand;