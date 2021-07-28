globalThis.crs = globalThis.crs || {};

export async function loadThreeModules(root) {
    const url = `${root}three/src/`;
    
    crs.threeModules = crs.threeModules || new crs.modules.constructor();

    // materials
    await crs.threeModules.add("MeshBasicMaterial",      `${url}materials/MeshBasicMaterial.js`);
    await crs.threeModules.add("LineBasicMaterial",      `${url}materials/LineBasicMaterial.js`);
    await crs.threeModules.add("LineDashedMaterial",     `${url}materials/LineDashedMaterial.js`);
    await crs.threeModules.add("MeshPhongMaterial",      `${url}materials/MeshPhongMaterial.js`);
    await crs.threeModules.add("MeshPhysicalMaterial",   `${url}materials/MeshPhysicalMaterial.js`);
    await crs.threeModules.add("MeshStandardMaterial",   `${url}materials/MeshStandardMaterial.js`);
    await crs.threeModules.add("MeshNormalMaterial",     `${url}materials/MeshNormalMaterial.js`);
    await crs.threeModules.add("PointsMaterial",         `${url}materials/PointsMaterial.js`);
    await crs.threeModules.add("RawShaderMaterial",      `${url}materials/RawShaderMaterial.js`);
    await crs.threeModules.add("ShaderMaterial",         `${url}materials/ShaderMaterial.js`);
    await crs.threeModules.add("ShadowMaterial",         `${url}materials/ShadowMaterial.js`);
    await crs.threeModules.add("SpriteMaterial",         `${url}materials/SpriteMaterial.js`);

    // geometry
    await crs.threeModules.add("PlaneGeometry",          `${url}geometries/PlaneGeometry.js`);
    await crs.threeModules.add("CircleGeometry",         `${url}geometries/CircleGeometry.js`);
    await crs.threeModules.add("BoxGeometry",            `${url}geometries/BoxGeometry.js`);
    await crs.threeModules.add("ConeGeometry",           `${url}geometries/ConeGeometry.js`);
    await crs.threeModules.add("CylinderGeometry",       `${url}geometries/CylinderGeometry.js`);
    await crs.threeModules.add("WireframeGeometry",      `${url}geometries/WireframeGeometry.js`);
    await crs.threeModules.add("EdgesGeometry",          `${url}geometries/EdgesGeometry.js`);
    await crs.threeModules.add("ShapeGeometry",          `${url}geometries/ShapeGeometry.js`);
    await crs.threeModules.add("ExtrudeGeometry",        `${url}geometries/ExtrudeGeometry.js`);

    // curvesCubicBezierCurve3
    await crs.threeModules.add("CatmullRomCurve3",        `${url}extras/curves/CatmullRomCurve3.js`);
    await crs.threeModules.add("Path",                    `${url}extras/core/Path.js`);
    await crs.threeModules.add("ShapePath",               `${url}extras/core/ShapePath.js`);
    await crs.threeModules.add("LineCurve3",              `${url}extras/curves/LineCurve3.js`);
    await crs.threeModules.add("CurvePath",               `${url}extras/core/CurvePath.js`);
    await crs.threeModules.add("QuadraticBezierCurve3",   `${url}extras/curves/QuadraticBezierCurve3.js`);
    await crs.threeModules.add("CubicBezierCurve3",       `${url}extras/curves/CubicBezierCurve3.js`);


    // cameras
    await crs.threeModules.add("OrthographicCamera",     `${url}cameras/OrthographicCamera.js`);
    await crs.threeModules.add("PerspectiveCamera",      `${url}cameras/PerspectiveCamera.js`);

    // math
    await crs.threeModules.add("Color",                  `${url}math/Color.js`);
    await crs.threeModules.add("Box2",                   `${url}math/Box2.js`)
    await crs.threeModules.add("Vector2",                `${url}math/Vector2.js`);
    await crs.threeModules.add("Vector3",                `${url}math/Vector3.js`);
    await crs.threeModules.add("Vector4",                `${url}math/Vector4.js`);
    await crs.threeModules.add("Matrix3",                `${url}math/Matrix3.js`);
    await crs.threeModules.add("Matrix4",                `${url}math/Matrix4.js`)
    await crs.threeModules.add("Plane",                  `${url}math/Plane.js`);
    await crs.threeModules.add("Box3",                   `${url}math/Box3.js`);

    // common
    await crs.threeModules.add("Scene",                  `${url}scenes/Scene.js`);
    await crs.threeModules.add("WebGLRenderer",          `${url}renderers/WebGLRenderer.js`);
    await crs.threeModules.add("Mesh",                   `${url}objects/Mesh.js`);
    await crs.threeModules.add("ThreeConstants",         `${url}constants.js`);
    await crs.threeModules.add("FileLoader",             `${url}loaders/FileLoader.js`);
    await crs.threeModules.add("Loader",                 `${url}loaders/Loader.js`);
    await crs.threeModules.add("Shape",                  `${url}extras/core/Shape.js`);
    await crs.threeModules.add("Group",                  `${url}objects/Group.js`);
    await crs.threeModules.add("UniformsUtils",          `${url}renderers/shaders/UniformsUtils.js`);

    // lights
    await crs.threeModules.add("AmbientLight",           `${url}lights/AmbientLight.js`);
    await crs.threeModules.add("PointLight",             `${url}lights/PointLight.js`);


    // textures
    await crs.threeModules.add("TextureLoader",          `${url}loaders/TextureLoader.js`);
    await crs.threeModules.add("Texture",                `${url}textures/Texture.js`);
    // objects
    await crs.threeModules.add("Clock",                  `${url}core/Clock.js`);
    await crs.threeModules.add("BufferGeometry",         `${url}core/BufferGeometry.js`);
    await crs.threeModules.add("BufferAttribute",        `${url}core/BufferAttribute.js`);
    await crs.threeModules.add("Line",                   `${url}objects/Line.js`);
    await crs.threeModules.add("Object3D",               `${url}core/Object3D.js`);
    await crs.threeModules.add("InstancedMesh",          `${url}objects/InstancedMesh.js`);
    await crs.threeModules.add("Raycaster",              `${url}core/Raycaster.js`);
    await crs.threeModules.add("WebGLRenderTarget",      `${url}renderers/WebGLRenderTarget.js`);
    await crs.threeModules.add("LineSegments",           `${url}objects/LineSegments.js`);
}

/**
 * Create a 3js object based on the class.
 * Also supports parameters
 * @param className
 * @param args
 * @returns {Promise<*>}
 */
globalThis.crs.createThreeObject = async (className, ...args) => {
    if (className.indexOf(".") == -1) {
        return await crs.threeModules.getInstanceOf(className, className, ...args);
    }

    const parts = className.split(".");
    return await crs.threeModules.getInstanceOf(parts[0], parts[1], ...args);
}

/**
 * Get a 3js class so you can instanciate it at your own time.
 * @param className
 * @returns {Promise<*>}
 */
globalThis.crs.getThreePrototype = async className => {
    const module = await crs.threeModules.get(className);
    return module[className];
}

/**
 * Create a Color class based on the string hex value of a color
 * @param color
 * @returns {Promise<*>}
 */
globalThis.crs.createColor = async color => {
    const cn = typeof color == "string" ? Number(color.replace("#", "0x")) : color;
    return crs.createThreeObject("Color", cn);
}

/**
 * Get a 3js constant from the constants.js
 * @param constant
 * @returns {Promise<*>}
 */
globalThis.crs.getThreeConstant = async constant => {
    const module = await crs.threeModules.get("ThreeConstants");
    return module[constant];
}