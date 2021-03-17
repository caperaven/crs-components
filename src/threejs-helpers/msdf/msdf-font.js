import {TextureLoader} from "/node_modules/three/src/loaders/TextureLoader.js";
import {Group} from "/node_modules/three/src/objects/Group.js";
import {createCustomUVPlane} from "../shape-factory.js";
import {MsdfLayout} from "./msdf-layout.js";

export class MsdfFont {
    constructor(json, loadedCallback) {
        this._cache = new Map();
        this._loadResources(json).then(() => loadedCallback && loadedCallback()).catch(e => console.error(e));
    }

    dispose() {
        this._layout.dispose();
        this._layout = null;
        this._cache.clear();
        this._cache = null;
        this.texture = null;
        this.lineHeight = null;
        this.baseLine = null;
        this.kernings = null;
    }

    /**
     * Get the font data for a given text
     * @param string
     * @returns {Promise<[]>}
     */
    async fromText(string) {
        const group = new Group();

        for (let char of string) {
            const charItem = this._cache.get(char);
            const plane = await createCustomUVPlane(charItem.width, charItem.height, this.texture, charItem.uv.tx1, charItem.uv.tx2, charItem.uv.ty1, charItem.uv.ty2);
            plane.__charItem = charItem;
            group.add(plane);
        }

        await this._layout.layout(group);

        return group;
    }

    /**
     * Load the json data from file and add to cache.
     * Load the image of the font file and create a texture for it.
     * @param jsonPath
     * @returns {Promise<void>}
     * @private
     */
    async _loadResources(jsonPath) {
        this.texture = new TextureLoader().load(jsonPath.replace(".json", ".png"));
        const json = await fetch(jsonPath).then(result => result.json());
        this._layout = new MsdfLayout(json);
        await this._populateCache(json);
    }

    /**
     * Process the font json provided and add it to the cache
     * @param json
     * @returns {Promise<void>}
     * @private
     */
    async _populateCache(json) {
        const tWidth = json.common.scaleW;
        const tHeight = json.common.scaleH;

        for (let charItem of json.chars) {
            const char = String.fromCharCode(charItem.id);

            charItem.uv = {
                tx1: charItem.x / tWidth,
                tx2: (charItem.x + charItem.width) / tWidth,
                ty1: 1 - (charItem.y / tHeight),
                ty2: 1 - ((charItem.y + charItem.height) / tHeight)
            }

            this._cache.set(char, charItem);
        }
    }
}