import {BaseProvider} from "./base-provider.js";

export default class SceneProvider extends BaseProvider {
    get key() {
        return "scene"
    }

    async processItem(item, program) {
        if (item == null || item.elements == null) return;
        for (let i = 0; i < item.elements.length; i++) {
            const element = item.elements[i];
            const provider = this.parser.providers.get(element.element);

            if (provider == null) {
                throw new Error(`No provider defined with key "${element.element}"`);
            }

            const child = await provider.processItem(element, program);
            if (child != null) {
                program.canvas.scene.add(child);
            }
        }
    }
}