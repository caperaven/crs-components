import "../../../src/gfx-components/orthographic-canvas/orthographic-canvas.js";
import {OrbitControls} from "../../../third-party/three/external/controls/OrbitControls.js";
import {LineCurveHelper} from "./../../src/gfx-helpers/line-curve-helper.js";
import {LineCurve3Joint} from "./../../src/gfx-helpers/line-curve3-joint.js";

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

    async disconnectedCallback() {
        this.disposed = true;
        await super.disconnectedCallback();
        this.joint = this.joint.dispose();
    }

    async initialize() {
        await this.catMull();
        await this.dynamic();
    }

    async catMull() {
        const MeshBasicMaterial = await crs.getThreePrototype("MeshBasicMaterial");
        const planMaterial      = new MeshBasicMaterial({color : 0xff0090});

        const curve = await LineCurveHelper.new(2, 5, 2, planMaterial, this.canvas.scene, "static curve");
        await curve.addLine({x: 100, y: -100}, {x: 200, y: -100});
        await curve.addLine({x: 200, y: -100}, {x: 200, y: -200});
        await curve.addQuadraticBezier({x: 200, y: -200}, {x: 250, y:-250}, {x: 300, y: -200});
        await curve.addLine({x: 300, y: -200}, {x: 300, y: -100});
        await curve.addLine({x: 300, y: -100}, {x: 400, y: -100});
        await curve.addCubicBezier({x: 400, y: -100}, {x: 400, y: -400}, {x: 100, y: -400},{x: 100, y: -100});

        this.mainJoint = new LineCurve3Joint(curve, 0);

        await curve.drawDashes(100);
    }

    async dynamic() {
        const MeshBasicMaterial = await crs.getThreePrototype("MeshBasicMaterial");
        const planMaterial      = new MeshBasicMaterial({color : 0x0000ff});
        this.dynamicCurve       = await LineCurveHelper.new(15, 10, 10, planMaterial, this.canvas.scene, "dynamic curve");
        await this.dynamicCurve.addLine({x: 100, y: -100}, {x: 250, y: -300});
        await this.dynamicCurve.addLine({x: 250, y: -300}, {x: 400, y: -100});
        await this.dynamicCurve.addLine({x: 400, y: -100}, {x: 600, y: -600});
        await this.dynamicCurve.addLine({x: 600, y: -600}, {x: 200, y: -500});
        await this.dynamicCurve.addLine({x: 200, y: -500}, {x: 100, y: -100});
        await this.dynamicCurve.drawDashes(1000);

        this.joint = new LineCurve3Joint(this.dynamicCurve, 0);
    }

    async render() {
        if (this.disposed == true) return;

        requestAnimationFrame(this.render.bind(this));
        //this.orbitControl.update();

        await this.update();
        this.canvas.render();
    }

    async update() {
        await this.setValue(0.5);
    }

    async setValue(value) {
        if (this.joint == null) {
            return this.disposed = true;
        }

        let yValue = this.joint.point.y + value;

        if (yValue >= 0) {
            yValue = -300;
        }

        this.joint.update(null, yValue);
        this.mainJoint.update(null, yValue);
        this.canvas.render();
    }
}