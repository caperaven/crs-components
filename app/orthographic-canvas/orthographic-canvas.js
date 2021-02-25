import "./../../components/orthographic-canvas/orthographic-canvas.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {Color} from "/node_modules/three/src/math/Color.js";

export default class OrthographicCanvas extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("orthographic-canvas");

        const ready = () => {
            this._createPlane();
            this.canvas.removeEventListener("ready", ready);
            this.canvas.render();
        }

        this.canvas.addEventListener("ready", ready);
    }

    _createPlane() {
        const geometry = new PlaneGeometry(800, 48);
        const material = new MeshBasicMaterial({color: new Color(0xff0000)});
        this.plane = new Mesh(geometry, material);
        this.canvas.scene.add(this.plane);
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.canvas.render();
        this.plane.rotateZ(0.01);
    }
}