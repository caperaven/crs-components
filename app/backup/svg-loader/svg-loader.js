import "../../../src/components/orthographic-canvas/orthographic-canvas.js";
//import {SVGLoader} from "./../../src/svg-to-geometry/svg-loader.js";
import {SVGLoader} from "../../../third-party/three/external/loaders/SVGLoader.js";
import {enableOrthographicDraggable, disableOrthographicDraggable} from "../../../src/extensions/orthographic-canvas/orthographic-draggable.js";
import {OrbitControls} from "../../../third-party/three/external/controls/OrbitControls.js";
import Stats from "../../../third-party/three/external/lib/stats.js";
import {mergeBufferGeometries} from "../../../src/threejs-helpers/buffer-geometry-utils.js";

export default class SvgLoader extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        this.canvas = document.querySelector("orthographic-canvas");
        this.animateHandler = this.animate.bind(this);
        this.stats = new Stats();

        const ready = async () => {
            this.canvas.camera.position.z = 10;
            // await enableOrthographicDraggable(this.canvas);
            this.orbitControls = new OrbitControls(this.canvas.camera, this.canvas.renderer.domElement);
            this.orbitControls.update();
            await this.svgLoad();

            this.element.appendChild(this.stats.dom);
        }

        this.canvas.addEventListener("ready", ready);
    }

    async disconnectedCallback() {
        // await disableOrthographicDraggable(this.canvas);
        this.canvas = null;
        await super.disconnectedCallback();
    }

    async svgLoad() {
        const loader = new SVGLoader();
        loader.load("/images/svg/flatfloorplan.svg", async data => {
            const paths = data.paths;
            const group = await crs.createThreeObject("Group");

            const material = await crs.createThreeObject("MeshBasicMaterial", {color: await crs.createThreeObject("Color", 0xff0090), side: crs.getThreeConstant("DoubleSide"), depthWrite: false});
            material.alphaToCoverage = true;

            const geometries = [];
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];

                const shapes = SVGLoader.createShapes(path);
                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j];
                    const geometry = await crs.createThreeObject("ShapeGeometry", shape);
                    geometries.push(geometry);
                }
            }

            const geometry = await mergeBufferGeometries(geometries);
            const mesh = await crs.createThreeObject("Mesh", geometry, material);

            this.canvas.scene.add(mesh);
            this.canvas.render();

            this.group = group;
        });

        await this.animate();

        // const loader = new SVGLoader();
        // //const result = await loader.load(`${window.location.origin}/images/material-design-icons/action/ic_alarm_24px.svg`);
        //
        // const material = await crs.createThreeObject("MeshBasicMaterial", {color: await crs.createColor(0xff0000)});
        // const result = await loader.parse(svg);
        //
        // // const result = await loader.parse("<svg></circle></svg>");
        //
        // const mesh = await crs.createThreeObject("Mesh", result, material);
        // this.canvas.scene.add(mesh);
        // this.canvas.render();
    }

    async animate(time) {
        requestAnimationFrame(this.animateHandler);
        // const time = performance.now() / 1000;
        // this.group.rotation.x = time * 0.5;
        // this.group.rotation.y = time * 0.5;
        this.orbitControls.update();
        this.stats.update();
        this.canvas.render();
    }

}