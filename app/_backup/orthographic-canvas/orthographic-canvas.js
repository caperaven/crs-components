import "../../../src/gfx-components/orthographic-canvas/orthographic-canvas.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {Color} from "/node_modules/three/src/math/Color.js";
//import {enableOrthographicDraggable, disableOrthographicDraggable} from "../../src/extensions/orthographic-canvas/orthographic-draggable.js";
import {createRegularMesh} from "../../../src/threejs-helpers/shape-factory.js";
//import {enableInputManager, disableInputManager} from "./../../src/graphics-helpers/graphics-input-manager.js"
import {mergeBufferGeometries} from "../../../src/threejs-helpers/buffer-geometry-utils.js";
import {OrbitControls} from "../../../third-party/three/external/controls/OrbitControls.js";

export default class OrthographicCanvas extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        this.canvas = document.querySelector("orthographic-canvas");

        const ready = async () => {
            await this._createPlane();
            await this._createPenta();
            await this._createBatch();
            this.canvas.removeEventListener("ready", ready);
            this.canvas.zeroBottomLeft();

            requestAnimationFrame(async () => {
                this.orbitControl = new OrbitControls(this.canvas.camera, this.canvas.renderer.domElement);
                this.orbitControl.update();
                await this.render();
            })
        }

        this.canvas.addEventListener("ready", ready);
    }

    async disconnectedCallback() {
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

    async _createBatch() {
        const buffer = [];

        buffer.push(
            (new PlaneGeometry(100, 100)).translate(-100, -100, 0),
            (new PlaneGeometry(200, 200))
        )

        const circle = await crs.modules.getInstanceOf("CircleGeometry", "CircleGeometry", 100, 5);
        circle.translate(100, 300, 0);
        buffer.push(circle);

        const geom = await mergeBufferGeometries(buffer);
        const material = new MeshBasicMaterial({color: new Color(0x0000ff)});
        const mesh = new Mesh(geom, material);
        this.canvas.scene.add(mesh);
        this.canvas.canvasPlace(mesh, 500, 400);
    }

    async render() {
        requestAnimationFrame(this.render.bind(this));

        this.controls.update();
        this.canvas.render();
    }
}