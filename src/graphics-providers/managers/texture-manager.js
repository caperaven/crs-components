import {BaseManager} from "./base-manager.js";

const fnMap = new Map([
    ["center", createVector2],
    ["repeat", createVector2],
    ["offset", createVector2],
    ["wrapS", getWrap],
    ["wrapT", getWrap]
])

const Vector2 = await crs.getThreePrototype("Vector2");

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
        if (program.textures == null) {
            program.textures = new Map();
            program._disposables.push(program.textures);
        }

        if (program.textures.has(def.id)) return;

        return new Promise(resolve => {
            loader.load(def.texture, async texture => {
                program.textures.set(def.id, texture);
                await this._applyArguments(texture, def.args);
                resolve();
            })
        })
    }

    async _applyArguments(texture, args) {
        if (args == null) return;
        const keys = Object.keys(args);
        for (let key of keys) {
            if (fnMap.has(key)) {
                texture[key] = await fnMap.get(key)(args[key]);
            }
            else {
                texture[key] = args[key];
            }
        }
    }
}

async function createVector2(param) {
    return new Vector2(param.x || 0, param.y || 0);
}

async function getWrap(param) {
    return crs.getThreeConstant(param);
}