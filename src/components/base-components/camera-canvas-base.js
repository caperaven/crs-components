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

        if (this.scene != null) {
            crs.modules.getInstanceOf("Color", "Color", this.background).then(async color => {
                this.scene.background = color;
                await this.render();
            });
        }
    }

    async connectedCallback() {
        requestAnimationFrame(async () => {
            this.width = this.offsetWidth;
            this.height = this.offsetHeight;
            this.aspect = Math.round(this.width / this.height);
            this.scene = await crs.createThreeObject("Scene");
            this.scene.background = await crs.modules.getInstanceOf("Color", "Color", this.background);
            this.top = Math.round(this.height / 2);
            this.left = Math.round(this.width / -2);

            this.camera = await this.createCamera();
            this.scene.add(this.camera);

            this.renderer = await crs.createThreeObject("WebGLRenderer", {antialias: true, precision: "highp"});
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