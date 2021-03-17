const nodePath = "/node_modules/three/src/";

const threePathsObj = {
    // materials
    "MeshBasicMaterial": "materials/MeshBasicMaterial.js",
    "RawShaderMaterial": "materials/RawShaderMaterial.js",
    "ShaderMaterial": "materials/ShaderMaterial.js",

    // geometry
    "PlaneGeometry": "geometries/PlaneGeometry.js",
    "CircleGeometry": "geometries/CircleGeometry.js",

    // common
    "Mesh": "objects/Mesh.js",
    "Color": "math/Color.js"
}

export function threePaths(className) {
    return `${nodePath}${threePathsObj[className]}`;
}