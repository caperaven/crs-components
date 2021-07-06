import "./../../src/components/adaptive-loader/adaptive-loader.js";

export default class AdaptiveLoaderView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this._getSchemaHandler = this._getSchema.bind(this);
        await crsbinding.events.emitter.on("adaptive-schema", this._getSchemaHandler);

        crsbinding.events.emitter.postMessage("#schema-loader", {
            action :"resize",
            width  : "1024"
        });


        postMessage("all", {
            action: "load",
            width: "1024"
        })
    }

    async disconnectedCallback() {
        this._getSchemaHandler = this._getSchema.bind(this);
        await crsbinding.events.emitter.remove("adaptive-schema", this._getSchemaHandler)
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

    async _getSchema(event) {
        const url = this.getProperty("folder");
        const html = await fetch(`${url}/views/${event.device}.html`).then(result => result.text());
        event.callback(html);
    }
}