import "../../src/components/orthographic-canvas/orthographic-canvas.js";
import {SVGLoader} from "./../../src/svg-to-geometry/svg-loader.js";
import {enableOrthographicDraggable, disableOrthographicDraggable} from "../../src/extensions/orthographic-canvas/orthographic-draggable.js";

export default class SvgLoader extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("orthographic-canvas");

        const ready = async () => {
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
        //const result = await loader.load(`${window.location.origin}/images/material-design-icons/action/ic_alarm_24px.svg`);

        const material = await crs.createThreeObject("MeshBasicMaterial", {color: await crs.createColor(0xff0000)});
        const result = await loader.parse("<svg><rect x='0' y='0' rx='20' ry='20' width='100' height='100'></rect></svg>");
        const mesh = await crs.createThreeObject("Mesh", result, material);
        this.canvas.scene.add(mesh);
        this.canvas.render();
    }
}