import "./../../src/components/adaptive-loader/adaptive-loader.js";

export default class AdaptiveLoaderView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        this.setProperty("folder", import.meta.url.replace("adaptive-loader.js", ""));
    }

    changeWidth(event) {
        crsbinding.events.emitter.postMessage("adaptive-loader", {
            action :"resize",
            width  : event.target.value
        });
    }
}