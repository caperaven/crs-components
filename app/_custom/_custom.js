import "./../../src/gfx-components/perspective-canvas/perspective-canvas.js";
import {actionData} from "../../src/geometry-data/flowchart/actionData.js";
import {rectData} from "../../src/geometry-data/flowchart/rectData.js";
import {dataData} from "../../src/geometry-data/flowchart/dataData.js";
import {decisionData} from "../../src/geometry-data/flowchart/decisionData.js";
import {delayData} from "../../src/geometry-data/flowchart/delayData.js";
import {displayData} from "../../src/geometry-data/flowchart/displayData.js";
import {documentData} from "./../../src/geometry-data/flowchart/documentData.js";
import {documentsData} from "./../../src/geometry-data/flowchart/documentsData.js";

import {rawToGeometry} from "./../../src/gfx-helpers/raw-to-geometry.js";

export default class Custom extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("perspective-canvas");

        const ready = async () => {
            requestAnimationFrame(async () => {
                this.canvas.removeEventListener("ready", ready);
                this.canvas.camera.position.z = 2;

                await this.addFromData();
                await this.render();
            })
        }

        this.canvas.addEventListener("ready", ready);
    }


    async disconnectedCallback() {
        this.plane = null;
        this.canvas = null;
    }

    async render() {
        requestAnimationFrame(this.render.bind(this));
        this.canvas.render();
    }

    async addFromData() {
        const material = await crs.createThreeObject("MeshBasicMaterial", {color: await crs.createColor("#ff0000")});
        const result = await rawToGeometry(documentsData, material);
        this.canvas.scene.add(result);
    }

    // async _createPlane() {
    //     const geometry = await crs.createThreeObject("PlaneGeometry", 100, 100);
    //     const material = await crs.createThreeObject("MeshBasicMaterial", {color: await crs.createColor("#ff0090")});
    //     this.plane = await crs.createThreeObject("Mesh", geometry, material);
    //     this.canvas.scene.add(this.plane);
    //     this.canvas.canvasPlace(this.plane, 100, 100);
    //
    //     console.log(this.plane);
    // }
    //
    // async _createCustomGeometry() {
    //     const Float32BufferAttribute = await crs.modules.getPrototype("BufferAttribute", "Float32BufferAttribute");
    //
    //     const positions = [];
    //     const indices = [];
    //     await this.addPlane(positions, indices, -50, -50, 100, 100);
    //     await this.addPlane(positions, indices, 100, -50, 100, 100);
    //
    //     const geometry = await crs.createThreeObject("BufferGeometry");
    //     geometry.setIndex(indices);
    //     geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    //
    //     const material = await crs.createThreeObject("MeshBasicMaterial", {color: await crs.createColor("#ff0000")});
    //     const mesh = await crs.createThreeObject("Mesh", geometry, material);
    //     this.canvas.scene.add(mesh);
    //     this.canvas.canvasPlace(mesh, 200, 200);
    // }
    //
    // async addPlane(positions, indices, x = 0, y = 0, width, height) {
    //     const x2 = x + width;
    //     const y2 = y + height;
    //
    //     const si = positions.length / 3;
    //     positions.push(
    //         x, y2, 0,
    //         x2, y2, 0,
    //         x, y, 0,
    //         x2, y, 0
    //     );
    //     indices.push(si, si + 2, si + 1, si + 2, si + 3, si + 1);
    // }
}