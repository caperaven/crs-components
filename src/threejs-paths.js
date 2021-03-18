globalThis.crs = globalThis.crs || {};
globalThis.crs.threejsPath = "/node_modules/three/src/";
globalThis.crs.threePathsObj = {
    // materials
    "MeshBasicMaterial": "materials/MeshBasicMaterial.js",
    "LineBasicMaterial": "materials/LineBasicMaterial.js",
    "LineDashedMaterial": "materials/LineDashedMaterial.js",
    "MeshPhongMaterial": "materials/MeshPhongMaterial.js",
    "MeshPhysicalMaterial": "materials/MeshPhysicalMaterial.js",
    "MeshStandardMaterial": "materials/MeshStandardMaterial.js",
    "PointsMaterial": "materials/PointsMaterial.js",
    "RawShaderMaterial": "materials/RawShaderMaterial.js",
    "ShaderMaterial": "materials/ShaderMaterial.js",
    "ShadowMaterial": "materials/ShadowMaterial.js",
    "SpriteMaterial": "materials/SpriteMaterial.js",

    // geometry
    "PlaneGeometry": "geometries/PlaneGeometry.js",
    "CircleGeometry": "geometries/CircleGeometry.js",
    "BoxGeometry": "geometries/BoxGeometry.js",
    "ConeGeometry": "geometries/ConeGeometry.js",
    "CylinderGeometry": "geometries/CylinderGeometry.js",
    "WireframeGeometry": "geometries/WireframeGeometry.js",

    // cameras
    "OrthographicCamera": "cameras/OrthographicCamera.js",
    "PerspectiveCamera": "cameras/PerspectiveCamera.js",

    // common
    "Mesh": "objects/Mesh.js",
    "Color": "math/Color.js",
    "Vector3": "math/Vector3.js",
    "Vector4": "math/Vector4.js",

    // textures
    "TextureLoader": "loaders/TextureLoader.js",

    // objects
    "BufferGeometry": "core/BufferGeometry.js",
    "Line": "objects/Line.js",
    "GridHelper": "helpers/GridHelper.js",
    "Object3D": "core/Object3D.js",
    "InstancedMesh": "objects/InstancedMesh.js"
}

/**
 * Get the file path on where to find the 3js objects
 * @param className
 * @returns {string}
 */
globalThis.crs.threePaths = className => {
    return `${crs.threejsPath}${crs.threePathsObj[className]}`;
}

/**
 * Create a 3js object based on the class.
 * Also supports parameters
 * @param className
 * @param args
 * @returns {Promise<*>}
 */
globalThis.crs.createThreeObject = async (className, ...args) => {
    const module = await import(crs.threePaths(className));
    return new module[className](...args);
}

/**
 * Get a 3js class so you can instanciate it at your own time.
 * @param className
 * @returns {Promise<*>}
 */
globalThis.crs.getThreePrototype = async className => {
    const module = await import(crs.threePaths(className));
    return module[className];
}

globalThis.crs.createColor = async color => {
    // JHR: find other places that does this and use this instead.
    const cn = Number(color.replace("#", "0x"));
    return crs.createThreeObject("Color", cn);
}