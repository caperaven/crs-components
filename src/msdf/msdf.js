export class Msdf {
    constructor() {

    }

    dispose() {

    }

    async initialize(jsonFile) {
        this.json = await fetch(jsonFile).then(result => result.json());

        const fontSize = this.json.info.size;
        const lineHeight = this.json.common.lineHeight;
        this.heightScale = Number(fontSize) / Number(lineHeight);
    }

}