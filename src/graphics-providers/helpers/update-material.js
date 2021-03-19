import {Color} from "/node_modules/three/src/math/Color.js";

const fnMap = new Map([
    ["color", createColor],
    ["map", setTexture],
    ["alphaMap", setTexture],
    ["aoMap", setTexture],
    ["envMap", setTexture],
    ["lightMap", setTexture],
    ["specularMap", setTexture]
])

export async function updateMaterial(material, args, program) {
    const keys = Object.keys(args);
    for (let key of keys) {
        if (fnMap.has(key)) {
            material[key] = await fnMap.get(key)(args[key], program);
        }
        else {
            material[key] = args[key];
        }
    }
    material.needsUpdate = true;
}

function createColor(color) {
    const value = Number(color.replace("#", "0x"));
    return new Color(value);
}

function setTexture(id, program) {
    return program.textures.get(id) || null;
}
