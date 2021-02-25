import {Scene} from "/node_modules/three/src/scenes/Scene.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {OrthographicCamera} from "/node_modules/three/src/cameras/OrthographicCamera.js";
import {WebGLRenderer} from '/node_modules/three/src/renderers/WebGLRenderer.js';

export class OrthographicCanvas extends HTMLElement {
    get background() {
        return this.getAttribute("background") || 0xffffff;
    }

    connectedCallback() {
        requestAnimationFrame(() => {
            this.width = this.offsetWidth;
            this.height = this.offsetHeight;
            this.aspect = this.width / this.height;
            this.scene = new Scene();
            this.scene.background = new Color(this.background);
            this.top = this.height / 2;
            this.left = this.width / -2;

            this.camera = new OrthographicCamera( this.left, this.width / 2, this.top, this.height / - 2, 0, 100);
            this.camera.position.z = 0;
            this.camera.aspect = this.aspect;
            this.camera.updateProjectionMatrix();
            this.scene.add(this.camera);

            this.renderer = new WebGLRenderer({antialias: true});
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.width, this.height);

            this.appendChild(this.renderer.domElement);

            this.dispatchEvent(new CustomEvent("ready"));
            this.render();
        })
    }

    disconnectedCallback() {
        this.scene.clear();
        this.render.dispose();
        this.scene = null;
        this.renderer = null;
        this.camera = null;
    }

    render() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }
}

customElements.define("orthographic-canvas", OrthographicCanvas);