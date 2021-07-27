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

            const Vector3 = await crs.getThreePrototype("Vector3");

            this.line = await crs.createThreeObject("LineCurve3", new Vector3(1, 1, 1), new Vector3(4, 1, 1));
            this.curvePath = await crs.createThreeObject("CurvePath");
            this.curvePath.add(this.line);

            // this.orbitControl = new OrbitControls(this.canvas.camera, this.canvas.renderer.domElement);
            // this.orbitControl.update();

            await this.initialize();
            await this.render();
        }

        this.canvas.addEventListener("ready", ready);
    }

    async initialize() {
        await this.catMull();
        await this.dynamic();
    }

    async catMull() {
        const LineBasicMaterial = await crs.getThreePrototype("LineBasicMaterial");
        const MeshBasicMaterial = await crs.getThreePrototype("MeshBasicMaterial");

        const material          = new LineBasicMaterial({color : 0xff0000});
        const planMaterial      = new MeshBasicMaterial({color : 0xff0090});

        const curve = await LineCurveHelper.new(5, 10, 5, planMaterial, this.canvas.scene, "static curve");
        await curve.addLine({x: 100, y: -100}, {x: 200, y: -100});
        await curve.addLine({x: 200, y: -100}, {x: 200, y: -200});
        await curve.addQuadraticBezier({x: 200, y: -200}, {x: 250, y:-250}, {x: 300, y: -200});
        await curve.addLine({x: 300, y: -200}, {x: 300, y: -100});
        await curve.addLine({x: 300, y: -100}, {x: 400, y: -100});
        await curve.addCubicBezier({x: 400, y: -100}, {x: 400, y: -400}, {x: 100, y: -400},{x: 100, y: -100});

        // await curve.drawLine(material, this.canvas.scene);
        // await curve.drawDashes(5, 10, 5, planMaterial, this.canvas.scene);
        await curve.drawDashes();
    }

    async dynamic() {
        const MeshBasicMaterial = await crs.getThreePrototype("MeshBasicMaterial");
        const planMaterial      = new MeshBasicMaterial({color : 0x0000ff});
        this.dynamicCurve       = await LineCurveHelper.new(5, 10, 5, planMaterial, this.canvas.scene, "dynamic curve");
        await this.dynamicCurve.addLine({x: 100, y: -100}, {x: 250, y: -300});
        await this.dynamicCurve.addLine({x: 250, y: -300}, {x: 400, y: -100});
        await this.dynamicCurve.drawDashes(5, 10, 5, planMaterial, this.canvas.scene, "my curve");
    }

    async render() {
        requestAnimationFrame(this.render.bind(this));
        //this.orbitControl.update();

        // for (let mesh of this.meshes) {
        //     mesh.rotation.z += 0.01;
        // }

        this.canvas.render();
    }

    async update() {
        this.setValue(100);

        await this.dynamicCurve.update();
        this.canvas.render();
    }

    setValue(value) {
        const c1 = this.dynamicCurve.curvePath.curves[0];
        const c2 = this.dynamicCurve.curvePath.curves[1];

        c1.v2.y += value;
        c1.updateArcLengths();

        c2.v1.y += value;
        c2.updateArcLengths();
    }
}