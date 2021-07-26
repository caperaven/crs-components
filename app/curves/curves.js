import "../../../src/gfx-components/orthographic-canvas/orthographic-canvas.js";
import {OrbitControls} from "../../../third-party/three/external/controls/OrbitControls.js";
import {LineCurveHelper} from "./../../src/gfx-helpers/line-curve-helper.js";

/**
 * https://stackoverflow.com/questions/49604847/object-rotating-while-travelling-along-a-curve-path
 * https://discourse.threejs.org/t/rotate-objects-to-follow-2d-curve/28297
 * https://observablehq.com/@rveciana/three-js-object-moving-object-along-path
 */

export default class Curves extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        this.canvas = this.element.querySelector("orthographic-canvas");

        const ready = async () => {
            this.canvas.removeEventListener("ready", ready);
            this.canvas.zeroBottomLeft();
            this.canvas.camera.position.z = 10;

            // this.orbitControl = new OrbitControls(this.canvas.camera, this.canvas.renderer.domElement);
            // this.orbitControl.update();

            await this.initialize();
            await this.render();
        }

        this.canvas.addEventListener("ready", ready);
    }

    async initialize() {
        await this.catMull();
    }

    async catMull() {
        const LineBasicMaterial = await crs.getThreePrototype("LineBasicMaterial");
        const MeshBasicMaterial = await crs.getThreePrototype("MeshBasicMaterial");

        const material          = new LineBasicMaterial({color : 0xff0000});
        const planMaterial      = new MeshBasicMaterial({color : 0xff0090});

        const curve = await LineCurveHelper.new();
        await curve.addLine({x: 100, y: -100}, {x: 200, y: -100});
        await curve.addLine({x: 200, y: -100}, {x: 200, y: -200});
        await curve.addQuadraticBezier({x: 200, y: -200}, {x: 250, y:-250}, {x: 300, y: -200});
        await curve.addLine({x: 300, y: -200}, {x: 300, y: -100});
        await curve.addLine({x: 300, y: -100}, {x: 400, y: -100});
        await curve.addCubicBezier({x: 400, y: -100}, {x: 400, y: -400}, {x: 100, y: -400},{x: 100, y: -100});

        //await curve.drawLine(material, this.canvas.scene);
        await curve.drawDashes(10, 10, 10, planMaterial, this.canvas.scene);

        this.canvas.render();
    }

    async render() {
        requestAnimationFrame(this.render.bind(this));
        //this.orbitControl.update();

        // for (let mesh of this.meshes) {
        //     mesh.rotation.z += 0.01;
        // }

        this.canvas.render();
    }
}