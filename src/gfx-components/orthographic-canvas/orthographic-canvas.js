import {CameraCanvasBase} from "../../components/base-components/camera-canvas-base.js";

/**
 * The purpose of this component is to allow a optimized canvas using webgl but that works closely to canvas settings.
 */
export class OrthographicCanvas extends CameraCanvasBase {
    async createCamera() {
        return await crs.createThreeObject("OrthographicCamera", this.left, this.width / 2, this.top, this.height / - 2, this.nearPlane, this.farPlane);
    }

    zeroBottomLeft() {
        this.cameraStartLeft = this.width / 2;
        this.cameraStartTop = this.height / -2;
        this.camera.position.set(this.cameraStartLeft, this.cameraStartTop, 0);
    }

    /**
     * Place the mesh as if it was on a canvas where zero is top left
     * @param mesh
     * @param x
     * @param y
     */
    canvasPlace(mesh, x, y) {
        mesh.position.set(x, -y, 0);
    }
}

customElements.define("orthographic-canvas", OrthographicCanvas);