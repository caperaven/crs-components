import "../../src/components/charts/bar-chart/bar-chart.js";
import {getData} from "./data-factory.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";

export default class SimpleBarChart extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("crs-bar-chart");
        this.canvas.addEventListener("ready", () => this.canvas.draw(getData(100)));
    }

    async disconnectedCallback() {
        this.canvas = null;
        await super.disconnectedCallback();
    }

    async update() {
        await this._createPlane();
        this.canvas.render();
    }

    async _createPlane() {
        const geometry = new PlaneGeometry(100, 100);
        const material = new MeshBasicMaterial({color: new Color(0xff0090)});
        this.plane = new Mesh(geometry, material);
        this.canvas._program.canvas.scene.add(this.plane);
    }
}