const fs = require("fs");
const mkdirp = require("mkdirp");
const glob = require("glob");
const path = require("path");
const htmlMinifi = require("html-minifier").minify;
const {minify} = require("terser");

class Publish {
    static async distribute() {
        const instance = new Publish();
        await instance.copyFiles("./readme.md");
        await instance.copyFiles("./src/3rd-party/require.js", "3rd-party/");

        await instance.copyRecursiveMinified("./third-party/**/*.js");

        await instance.copyMinified("./src/components/html-to-text/html-to-text.js", "components/html-to-text/");
        await instance.copyMinified("./src/components/monaco-editor/monaco-editor.js", "components/monaco-editor/");
        await instance.copyFiles("./src/components/monaco-editor/monaco-editor.html", "components/monaco-editor/");

        await instance.copyRecursiveMinified("./src/components/base-components/*.js", null,"./src/");
        await instance.copyRecursiveMinified("./src/components/lib/*.js", null, "./src/");
        await instance.copyRecursiveMinified("./src/components/main-menu/*.js", null, "./src/");
        await instance.copyRecursiveMinified("./src/components/lists/*.js", null,"./src/");
        await instance.copyRecursiveMinified("./src/graphics-providers/**/*.js", null, "./src/");
        await instance.copyRecursiveMinified("./src/graphics-helpers/**/*.js", null, "./src/");
        await instance.copyRecursiveMinified("./src/extensions/**/*.js", null, "./src/");

        await instance.saveCommands();
        instance.bumpVersion();
    }
    
    constructor() {
        mkdirp.sync(path.resolve("./publish"));
        this.commands = [];
    }

    async copyMinified(query, folder) {
        const files = await this.getFiles(query);
        for (let file of files) {
            const target = folder != null ? `./publish/${folder}/` : `./publish/`;
            const fileName = path.basename(file);
            this.initFolder(target);
            const text = fs.readFileSync(file, {encoding: "utf8"});
            const result = await minify(text);
            fs.writeFileSync(`${target}/${fileName}`, result.code);
            console.log(`${target}/${fileName}`);
        }
    }

    async copyFiles(query, folder) {
        const files = await this.getFiles(query);
        for (let file of files) {
            const target = folder != null ? `./publish/${folder}/` : `./publish/`;
            const fileName = path.basename(file);
            this.initFolder(target);
            fs.copyFileSync(file, `${target}/${fileName}`);
            console.log(`${target}/${fileName}`);
        }
    }

    async copyRecursiveMinified(query, folder, stripOut = "") {
        const files = await this.getFiles(query);
        for (let file of files) {
            const f = file.replace(stripOut, "").replace("./", "");
            const target = (folder != null ? `./publish/${folder}/` : "./publish") + `/${f}`;
            this.initFolder(path.dirname(target));
            const text = fs.readFileSync(file, {encoding: "utf8"});
            const result = await minify(text);
            fs.writeFileSync(target, result.code);
            console.log(target);
        }
    }

    initFolder(folder) {
        mkdirp.sync(path.resolve(folder));
    }

    getFiles(query) {
        return new Promise((resolve, reject) => {
            const o = {};

            glob(query, o, (error, files) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }

                resolve(files);
            });
        });
    }

    bumpVersion() {
        const sourcePackage = `${path.resolve(".")}/package.json`;
        const targetPackage = `${path.resolve(".")}/publish/package.json`;

        const content = fs.readFileSync(sourcePackage, "utf8");
        const pkg = JSON.parse(content);
        const version = pkg.version;
        const isPre = version.indexOf("-pre") > -1;
        const preConstants = ["", "-pre"];

        const versions = version.split(".");
        versions[2] = versions[2].replace("-pre", "");
        versions[2] = Number(versions[2]) + 1;
        pkg.version = `${versions.join(".")}${preConstants[+ isPre]}`;

        fs.writeFileSync(sourcePackage, JSON.stringify(pkg, null, 4), "utf8");
        fs.copyFileSync(sourcePackage, targetPackage);
    }

    async copySource(sourceFolder) {
        const files = await this.getFiles(`./${sourceFolder}/**/*.*`);
        for (let file of files) {
            console.log(file);

            const basePath = path.dirname(file).replace("./", "");
            const target = `./publish/${basePath}/`;
            const fileName = path.basename(file);
            const ext = path.extname(file);
            this.initFolder(target);

            const toFile = `${target}${fileName}`.replace("publish/", "");

            if (ext == ".js") {
                this.commands.push(`terser ${toFile} -c -m -o ${toFile}`);
            }

            if (ext == ".html") {
                let html = fs.readFileSync(file, "utf8");
                html = htmlMinifi(html, {
                    minifyCSS: true,
                    collapseWhitespace: true
                });
                fs.writeFileSync(`${target}${fileName}`, html, "utf8");
            }
            else {
                fs.copyFileSync(file, `${target}${fileName}`);
            }

        }
    }

    async saveCommands() {
        const string = this.commands.join("\n");
        const target = `./publish/minify.sh`;
        fs.writeFileSync(target, string, "utf8");
    }
}

Publish.distribute();