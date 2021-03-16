import {RawShaderMaterial} from "/node_modules/three/src/materials/RawShaderMaterial.js";
import {TextureLoader} from "/node_modules/three/src/loaders/TextureLoader.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {GLSL3} from "/node_modules/three/src/constants.js";

class Program {
    constructor(canvas) {
        this._canvas = canvas;
        this._animateHandler = this.animate.bind(this);
    }

    dispose() {
        this._canvas = null;
        this._animateHandler = null;
    }

    animate() {
        if (this._animateHandler == null) return;
        requestAnimationFrame(this._animateHandler);
        this._canvas.render();
    }
}

export async function loadProgram(canvas, program) {
    const fragmentShader = await loadShader(program.fragmentShader);
    const vertexShader = await loadShader(program.vertexShader);
    const uniforms = await processUniforms(program.uniforms);

    const material = new RawShaderMaterial({
        fragmentShader: fragmentShader.trim(),
        vertexShader: vertexShader.trim(),
        uniforms: uniforms
        //glslVersion: GLSL3,
    });

    await loadScene(canvas, program.scene, material);

    return new Program(canvas);
}

async function loadShader(file) {
    return await fetch(file).then(result => result.text());
}

async function processUniforms(uniforms) {
    const keys = Object.keys(uniforms);
    for (let key of keys) {
        if (key.toLowerCase().indexOf("color") != -1) {
            uniforms[key].value = new Color(uniforms[key].value)
        }

        if (uniforms[key].type != null) {
            if (uniforms[key].type == "t") {
                uniforms[key].value = await loadTexture(uniforms[key].value);
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