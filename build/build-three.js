const fs = require("fs");
const mkdirp = require("mkdirp");
const glob = require("glob");
const path = require("path");

class BuildThree {
    constructor() {
    }

    async copyFiles() {
        glob(`node_modules/three/src/**/*.js`, {}, (error, files) => {
            for (let file of files) {
                const targetName = file.replace("node_modules", "third-party");
                const dir = path.dirname(targetName);
                mkdirp.sync(path.resolve(dir));
                fs.copyFileSync(`${file}`, `${targetName}`);
            }
        });
    }
}

const instance = new BuildThree();
instance.copyFiles();