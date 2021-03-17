import {Color} from "/node_modules/three/src/math/Color.js";

const fnMap = new Map([
    ["color", createColor]
])

export function updateMaterial(material, parameters) {
    const keys = Object.keys(parameters);
    for (let key of keys) {
        if (fnMap.has(key)) {
            material[key] = fnMap.get(key)(parameters[key]);
        }
        else {
            material[key] = parameters[key];
        }
    }
    material.needsUpdate = true;
}

function createColor(color) {
    const value = Number(color.replace("#", "0x"));
    return new Color(value);
}