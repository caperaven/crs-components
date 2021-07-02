import "./../../src/components/adaptive-loader/adaptive-loader.js";

export default class AdaptiveLoaderView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        const data = [];

        for (let i = 0; i < 10; i++) {
            data.push({
                id: i,
                title: `Item ${i}`,
                value: i + 10
            })
        }

        this.setProperty("folder", import.meta.url.replace("adaptive-loader.js", ""));
        this.setProperty("data", data);
    }

    changeWidth(event) {
        crsbinding.events.emitter.postMessage("adaptive-loader", {
            action :"resize",
            width  : event.target.value
        });
    }
}