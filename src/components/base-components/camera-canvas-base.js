import {Scene} from "/node_modules/three/src/scenes/Scene.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {WebGLRenderer} from "/node_modules/three/src/renderers/WebGLRenderer.js";

export class CameraCanvasBase extends HTMLElement {
    get nearPlane() {
        if (this._nearPlane == null) {
            this._nearPlane = Number(this.getAttribute("near-plane") || 0);
        }
        return this._nearPlane;
    }

    set nearPlane(newValue) {
        this._nearPlane = newValue;
    }

    get farPlane() {
        if (this._farPlane == null) {
            this._farPlane = Number(this.getAttribute("far-plane") || 1000);
        }
        return this._farPlane;
    }

    set farPlane(newValue) {
        this._farPlane = newValue;
    }

    get background() {
        if (this._background == null) {
            this._background = this.getAttribute("background") || "#ffffff"
        }
        return Number(this._background.replace("#", "0x"));
    }

    set background(newValue) {
        this._background = newValue;
    }

    render() {
        if (this.renderer == null) return;
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    async connectedCallback() {
        requestAnimationFrame(() => {
            this.width = this.offsetWidth;
            this.height = this.offsetHeight;
            this.aspect = this.width / this.height;
            this.scene = new Scene();
            this.scene.background = new Color(this.background);
            this.top = this.height / 2;
            this.left = this.width / -2;

            this.camera = this.createCamera();
            this.scene.add(this.camera);

            this.renderer = new WebGLRenderer({antialias: true});
            this.renderer.setClearColor(this.background);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.width, this.height);

            this.appendChild(this.renderer.domElement);

            this.isReady = true;
            if (this.ready != null) this.ready();
            this.dispatchEvent(new CustomEvent("ready"));
            this.render();
        });

        this.resizeHandler = this.resize.bind(this);
        window.addEventListener("resize", this.resizeHandler);
    }

    async disconnectedCallback() {
        window.removeEventListener("resize", this.resizeHandler);
        this.resizeHandler = null;

        this.renderer && this.renderer.dispose();

        this.scene = null;
        this.renderer = null;
        this.camera = null;
    }

    async render() {
        if (this.renderer == null) return;
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    async resize() {
        this.width = this.offsetWidth;
        this.height = this.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }
}