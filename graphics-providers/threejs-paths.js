const nodePath = "/node_modules/three/src/";

const threePathsObj = {
    // materials
    "MeshBasicMaterial": "materials/MeshBasicMaterial.js",
    "RawShaderMaterial": "materials/RawShaderMaterial.js",
    "ShaderMaterial": "materials/ShaderMaterial.js",
    "LineBasicMaterial": "materials/LineBasicMaterial.js",

    // geometry
    "PlaneGeometry": "geometries/PlaneGeometry.js",
    "CircleGeometry": "geometries/CircleGeometry.js",

    // common
    "Mesh": "objects/Mesh.js",
    "Color": "math/Color.js",
    "Vector3": "math/Vector3.js",
    "Vector4": "math/Vector4.js",

    // objects
    "BufferGeometry": "core/BufferGeometry.js",
    "Line": "objects/Line.js"
}

export function threePaths(className) {
    return `${nodePath}${threePathsObj[className]}`;
}

export async function createThreeObject(className, ...args) {
    const module = await import(threePaths(className));
    return new module[className](...args);
}

export async function getThreePrototype(className) {
    const module = await import(threePaths(className));
    return module[className];
}