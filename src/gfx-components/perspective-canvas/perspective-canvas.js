import {CameraCanvasBase} from "../../components/base-components/camera-canvas-base.js";

export class PerspectiveCanvas extends CameraCanvasBase {
    async connectedCallback() {
        this._nearPlane = 0.1;
        await super.connectedCallback();
    }

    get fov() {
        if (this._fov == null) {
            this._fov = Number(this.getAttribute("fov") || 60);
        }
        return this._fov;
    }

    set fov(newValue) {
        this._fov = newValue;
    }

    async createCamera() {
        return crs.createThreeObject("PerspectiveCamera", this.fov, this.width / this.height, this.nearPlane, this.farPlane);
    }
}

customElements.define("perspective-canvas", PerspectiveCanvas);