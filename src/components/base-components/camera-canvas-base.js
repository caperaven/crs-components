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

    get allowPostProcess() {
        if (this._allowPostProcess == null) {
            this._allowPostProcess = this.getAttribute("allow-postprocess") || "false";
        }
        return typeof this._allowPostProcess == "boolean" ? this._allowPostProcess : this._allowPostProcess.toLowerCase() == "true";
    }

    set allowPostProcess(newValue) {
        this._allowPostProcess = newValue;
        if (newValue == true) {
            this._enableRenderPass();
        }
        else {
            this._disableRenderPass();
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

            console.log(this.allowPostProcess);
            if (this.allowPostProcess == true) {
                this.renderer.autoClear = false;
            }

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

        if (this.composer != null) {
            this.composer.render();
        }
        else {
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }
    }

    async resize() {
        this.width = this.offsetWidth;
        this.height = this.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    async _enableRenderPass() {
        const renderPassModule = await import("./../../../third-party/three/external/postprocessing/render-pass.js");
        const shaderPassModule = await import("./../../../third-party/three/external/postprocessing/shader-pass.js");
        const composerModule = await import("./../../../third-party/three/external/postprocessing/effect-composer.js");
        const fxaaModule = await import("./../../../third-party/three/external/shaders/FXAA-shader.js");

        const renderPass = new renderPassModule.RenderPass();
        await renderPass.initialize(this.scene, this.camera);

        // This should be moved out to outside
        const fxaaPass = new shaderPassModule.ShaderPass();
        await fxaaPass.initialize(fxaaModule.FXAAShader);
        const pixelRatio = this.renderer.getPixelRatio();
        fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (this.width * pixelRatio);
        fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (this.height * pixelRatio);

        this.composer = new composerModule.EffectComposer();
        await this.composer.initialize(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass(fxaaPass);

        this.renderer.autoClear = false;
        await this.render();
    }

    async _disableRenderPass() {
        this.renderer.autoClear = true;
        this.composer.dispose();
    }
}