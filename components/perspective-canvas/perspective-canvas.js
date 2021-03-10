import {CameraCanvasBase} from "./../base-components/camera-canvas-base.js";
import {PerspectiveCamera} from "/node_modules/three/src/cameras/PerspectiveCamera.js";

export class PerspectiveCanvas extends CameraCanvasBase {
    get fov() {
        if (this._fov == null) {
            this._fov = Number(this.getAttribute("fov") || 75);
        }
        return this._fov;
    }

    set fov(newValue) {
        this._fov = newValue;
    }

    createCamera() {
        return new PerspectiveCamera(this.fov, this.width / this.height, this.nearPlane, this.farPlane);
    }
}

customElements.define("perspective-canvas", PerspectiveCanvas);