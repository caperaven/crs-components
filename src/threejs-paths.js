globalThis.crs = globalThis.crs || {};

export async function loadThreeModules(root) {
    const url = `${root}three/src/`;

    // materials
    await crs.modules.add("MeshBasicMaterial", `${url}materials/MeshBasicMaterial.js`);
    await crs.modules.add("LineBasicMaterial", `${url}materials/LineBasicMaterial.js`);
    await crs.modules.add("LineDashedMaterial", `${url}materials/LineDashedMaterial.js`);
    await crs.modules.add("MeshPhongMaterial", `${url}materials/MeshPhongMaterial.js`);
    await crs.modules.add("MeshPhysicalMaterial", `${url}materials/MeshPhysicalMaterial.js`);
    await crs.modules.add("MeshStandardMaterial", `${url}materials/MeshStandardMaterial.js`);
    await crs.modules.add("PointsMaterial", `${url}materials/PointsMaterial.js`);
    await crs.modules.add("RawShaderMaterial", `${url}materials/RawShaderMaterial.js`);
    await crs.modules.add("ShaderMaterial", `${url}materials/ShaderMaterial.js`);
    await crs.modules.add("ShadowMaterial", `${url}materials/ShadowMaterial.js`);
    await crs.modules.add("SpriteMaterial", `${url}materials/SpriteMaterial.js`);

    // geometry
    await crs.modules.add("PlaneGeometry", `${url}geometries/PlaneGeometry.js`);
    await crs.modules.add("CircleGeometry", `${url}geometries/CircleGeometry.js`);
    await crs.modules.add("BoxGeometry", `${url}geometries/BoxGeometry.js`);
    await crs.modules.add("ConeGeometry", `${url}geometries/ConeGeometry.js`);
    await crs.modules.add("CylinderGeometry", `${url}geometries/CylinderGeometry.js`);
    await crs.modules.add("WireframeGeometry", `${url}geometries/WireframeGeometry.js`);

    // cameras
    await crs.modules.add("OrthographicCamera", `${url}cameras/OrthographicCamera.js`);
    await crs.modules.add("PerspectiveCamera", `${url}cameras/PerspectiveCamera.js`);

    // common
    await crs.modules.add("Scene", `${url}scenes/Scene.js`);
    await crs.modules.add("WebGLRenderer", `${url}renderers/WebGLRenderer.js`);
    await crs.modules.add("Mesh", `${url}objects/Mesh.js`);
    await crs.modules.add("Color", `${url}math/Color.js`);
    await crs.modules.add("Vector2", `${url}math/Vector2.js`);
    await crs.modules.add("Vector3", `${url}math/Vector3.js`);
    await crs.modules.add("Vector4", `${url}math/Vector4.js`);
    await crs.modules.add("ThreeConstants", `${url}/constants.js`);

    // textures
    await crs.modules.add("TextureLoader", `${url}loaders/TextureLoader.js`);

    // objects
    await crs.modules.add("BufferGeometry", `${url}core/BufferGeometry.js`);
    await crs.modules.add("Line", `${url}objects/Line.js`);
    await crs.modules.add("Object3D", `${url}core/Object3D.js`);
    await crs.modules.add("InstancedMesh", `${url}objects/InstancedMesh.js`);
    await crs.modules.add("Raycaster", `${url}core/Raycaster.js`);
}

/**
 * Create a 3js object based on the class.
 * Also supports parameters
 * @param className
 * @param args
 * @returns {Promise<*>}
 */
globalThis.crs.createThreeObject = async (className, ...args) => {
    return await crs.modules.getInstanceOf(className, className, ...args);
}

/**
 * Get a 3js class so you can instanciate it at your own time.
 * @param className
 * @returns {Promise<*>}
 */
globalThis.crs.getThreePrototype = async className => {
    const module = await crs.modules.get(className);
    return module[className];
}

/**
 * Create a Color class based on the string hex value of a color
 * @param color
 * @returns {Promise<*>}
 */
globalThis.crs.createColor = async color => {
    const cn = Number(color.replace("#", "0x"));
    return crs.createThreeObject("Color", cn);
}

/**
 * Get a 3js constant from the constants.js
 * @param constant
 * @returns {Promise<*>}
 */
globalThis.crs.getThreeConstant = async constant => {
    const module = await crs.modules.get("ThreeConstants");
    return module[constant];
}