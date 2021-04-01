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

async function createColor(color) {
    const value = Number(color.replace("#", "0x"));
    return await crs.createThreeObject("Color", value);
}

function setTexture(id, program) {
    return program.textures.get(id) || null;
}
