export class MsdfFont {
    constructor() {

    }

    dispose() {

    }

    async initialize(jsonFile, fontSize) {
        const json = await fetch(jsonFile).then(result => result.json());
        const size = json.info.size;
        this.charSet = {};

        for (let char of json.chars) {
            const ho = char.height / size;
            const wo = char.width / size;

            this.charSet[char.id] = {
                char: String.fromCharCode(char.id),
                uv: {
                    x: char.x,
                    y: char.y,
                    width: char.width,
                    height: char.height
                },
                layout: {
                    xoffset: char.xoffset,
                    yoffset: char.yoffset,
                    xadvance: char.xadvance
                },
                geom: {
                    height: ho * fontSize,
                    width: wo * fontSize
                }
            }
        }

        console.log(this.charSet);
    }
}