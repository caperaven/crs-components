import {RawShaderMaterial} from "/node_modules/three/src/materials/RawShaderMaterial.js";
import {TextureLoader} from "/node_modules/three/src/loaders/TextureLoader.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";

export async function loadProgram(canvas, program) {
    const fragmentShader = await loadShader(program.fragmentShader);
    const vertexShader = await loadShader(program.vertexShader);
    const uniforms = await processUniforms(program.uniforms);

    const material = new RawShaderMaterial({
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        uniforms: uniforms
    });

    await loadScene(canvas, program.scene, material);
    canvas.render();
}

async function loadShader(file) {
    return await fetch(file).then(result => result.text());
}

async function processUniforms(uniforms) {
    const keys = Object.keys(uniforms);
    for (let key of keys) {
        if (uniforms[key].type != null) {
            if (uniforms[key].type == "t") {
                uniforms[key] = await loadTexture(uniforms[key].value);
            }
        }
    }
    return uniforms;
}

async function loadTexture(file) {
    return new Promise(resolve => {
        new TextureLoader().load(file, texture => resolve(texture));
    })
}

async function loadScene(canvas, scene, material) {
    const parameters = scene.parameters;
    let geometry;

    if (scene.shape == "plane") {
        geometry = new PlaneGeometry();
    }

    const mesh = new Mesh(geometry, material);
    mesh.scale.set(parameters.width || 1, parameters.height || 1, parameters.depth || 1);
    canvas.scene.add(mesh);
}