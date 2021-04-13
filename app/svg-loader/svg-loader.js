import "../../src/components/orthographic-canvas/orthographic-canvas.js";
//import {SVGLoader} from "./../../src/svg-to-geometry/svg-loader.js";
import {SVGLoader} from "./../../third-party/three/external/loaders/SVGLoader.js";
import {enableOrthographicDraggable, disableOrthographicDraggable} from "../../src/extensions/orthographic-canvas/orthographic-draggable.js";

export default class SvgLoader extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        this.canvas = document.querySelector("orthographic-canvas");

        const ready = async () => {
            this.canvas.camera.position.z = 10;
            await enableOrthographicDraggable(this.canvas);
            await this.svgLoad();
        }

        this.canvas.addEventListener("ready", ready);
    }

    async disconnectedCallback() {
        await disableOrthographicDraggable(this.canvas);
        this.canvas = null;
        await super.disconnectedCallback();
    }

    async svgLoad() {
        const loader = new SVGLoader();
        loader.load("/images/svg/desk.svg", async data => {
            const paths = data.paths;
            const group = await crs.createThreeObject("Group");

            const material = await crs.createThreeObject("MeshBasicMaterial", {color: await crs.createThreeObject("Color", 0xff0090), side: crs.getThreeConstant("DoubleSide"), depthWrite: false});
            material.alphaToCoverage = true;

            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];

                const shapes = SVGLoader.createShapes(path);
                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j];
                    const geometry = await crs.createThreeObject("ShapeGeometry", shape);
                    const mesh = await crs.createThreeObject("Mesh", geometry, material);
                    group.add(mesh);
                }
            }

            group.scale.set(2, 2, 2);
            this.canvas.scene.add(group);
            this.canvas.render();

            this.group = group;
        });

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

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const time = performance.now() / 1000;
        this.group.rotation.x = time * 0.5;
        this.group.rotation.y = time * 0.5;
        this.canvas.render();
    }

}