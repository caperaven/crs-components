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

/**
 * Get the file path on where to find the 3js objects
 * @param className
 * @returns {string}
 */
export function threePaths(className) {
    return `${nodePath}${threePathsObj[className]}`;
}

/**
 * Create a 3js object based on the class.
 * Also supports parameters
 * @param className
 * @param args
 * @returns {Promise<*>}
 */
export async function createThreeObject(className, ...args) {
    const module = await import(threePaths(className));
    return new module[className](...args);
}

/**
 * Get a 3js class so you can instanciate it at your own time.
 * @param className
 * @returns {Promise<*>}
 */
export async function getThreePrototype(className) {
    const module = await import(threePaths(className));
    return module[className];
}