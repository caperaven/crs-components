import {BaseProvider} from "./base-provider.js";

export default class CameraProvider extends BaseProvider {
    get key() {
        return "camera"
    }

    async process(item) {
        return this[item.type](item);
    }

    async orthographic(item) {
        const element = document.createElement("orthographic-canvas");
        await this.setAttributes(element, item.attributes);
        return element;
    }

    async perspective(item) {
        const element = document.createElement("perspective-canvas");
        await this.setAttributes(element, item.attributes);
        return element;
    }

    async setAttributes(element, attributes) {
        if (attributes == null) return;
        const keys = Object.keys(attributes);
        for (let key of keys) {
            element.setAttribute(key, attributes[key]);
        }
    }
}