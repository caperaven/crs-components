import {BaseManager} from "./base-manager.js";
import {processProperty} from './../helpers/property-processor.js';

const fnMap = new Map([
    ["center", createVector2],
    ["repeat", createVector2],
    ["offset", createVector2],
    ["wrapS", getConstant],
    ["wrapT", getConstant],
    ["minFilter", getConstant],
    ["magFilter", getConstant],
    ["format", getConstant],
    ["internalFormat", getConstant],
    ["type", getConstant]
])

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
                await this._applyArguments(texture, def.args, program);
                resolve();
            })
        })
    }

    async _applyArguments(texture, args, program) {
        if (args == null) return;
        const keys = Object.keys(args);
        for (let key of keys) {
            if (fnMap.has(key)) {
                texture[key] = await fnMap.get(key)(args[key], program);
            }
            else {
                texture[key] = processProperty(args[key], program);
            }
        }
    }
}

async function createVector2(param, program) {
    param = processProperty(param, program);
    return await crs.createThreeObject("Vector2", param.x || 0, param.y || 0);
}

async function getConstant(param, program) {
    param = processProperty(param, program);
    return await crs.getThreeConstant(param);
}