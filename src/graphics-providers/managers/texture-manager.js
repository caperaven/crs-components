import {BaseManager} from "./base-manager.js";

export default class TextureManager extends BaseManager {
    get key() {
        return "textures";
    }

    async processItem(textures, program) {
        if (textures == null) return;

        const loader = await crs.createThreeObject("TextureLoader");
        for (let texture of textures) {
            await this._loadTexture(texture, program, loader);
        }
    }

    async _loadTexture(def, program, loader) {
        if (program.textures.has(def.id)) return;

        return new Promise(resolve => {
            loader.load(def.texture, texture => {
                program.textures.set(def.id, texture);
                resolve();
            })
        })
    }
}