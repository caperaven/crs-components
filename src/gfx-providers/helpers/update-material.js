import {processProperty} from "./../helpers/property-processor.js";

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
            material[key] = processProperty(args[key]);
        }
    }
    material.needsUpdate = true;
}

async function createColor(color, program) {
    if (color.indexOf("#") != -1) {
        const value = processProperty(Number(color.replace("#", "0x")));
        return await crs.createThreeObject("Color", value);
    }

    return program.colors[color];
}

function setTexture(id, program) {
    return program.textures.get(id) || null;
}
