const fs = require("fs");
const glob = require("glob");

function reformat() {
    glob("./images/material-design-icons/**/*.svg", {}, (error, files) => {
        for (let file of files) {
            const name = file.split("ic_").join("").split("_24px", "");
            fs.rename(file, name, error => {
                console.log(error);
            });
        }
    });
}

reformat();