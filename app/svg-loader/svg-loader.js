import {SVGLoader} from "./../../src/svg-to-geometry/svg-loader.js";

export default class SvgLoader extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async svgLoad() {
        const loader = new SVGLoader();
        const result = await loader.load(`${window.location.origin}/images/material-design-icons/action/ic_alarm_24px.svg`);
    }
}