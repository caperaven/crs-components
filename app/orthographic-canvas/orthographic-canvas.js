import "../../src/components/orthographic-canvas/orthographic-canvas.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {enableOrthographicDraggable, disableOrthographicDraggable} from "../../src/extensions/orthographic-canvas/orthographic-draggable.js";
import {createRegularMesh} from "../../src/threejs-helpers/shape-factory.js";

export default class OrthographicCanvas extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("orthographic-canvas");

        const ready = async () => {
            await this._createPlane();
            await this._createPenta();
            this.canvas.removeEventListener("ready", ready);
            this.canvas.zeroBottomLeft();
            this.canvas.render();

            requestAnimationFrame(async () => {
                await enableOrthographicDraggable(this.canvas);
            })
        }

        this.canvas.addEventListener("ready", ready);
    }

    async disconnectedCallback() {
        await disableOrthographicDraggable(this.canvas);
        this.canvas = null;
        this.plane = null;
        await super.disconnectedCallback();
    }

    async _createPlane() {
        const geometry = new PlaneGeometry(100, 100);
        const material = new MeshBasicMaterial({color: new Color(0xff0090)});
        this.plane = new Mesh(geometry, material);
        this.canvas.scene.add(this.plane);
        this.canvas.canvasPlace(this.plane,0, 0);
    }

    async _createPenta() {
        const mesh = await createRegularMesh(new MeshBasicMaterial({color: new Color(0xff0000)}), 6, 100);
        this.canvas.scene.add(mesh);
        this.canvas.canvasPlace(mesh,100, 100);
    }

    async render() {
        requestAnimationFrame(this.render.bind(this));
        this.plane.rotateZ(0.01);
        this.canvas.render();
    }
}