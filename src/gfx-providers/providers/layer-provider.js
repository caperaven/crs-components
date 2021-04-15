import {BaseProvider} from "./base-provider.js";

export default class LayerProvider extends BaseProvider {
    get key() {
        return "layer"
    }

    async processItem(item, program) {
        // JHR: This works a little different to the rest where it uses the program to load the content.
        // Layers are conditional loading as when when you need them and only once.
        // The program manages that internally
        if (item.visible != false) {
            await program.setLayerVisibility(item.layer);
        }
    }
}