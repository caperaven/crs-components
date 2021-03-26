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
            const child = await provider.processItem(element, program);
            program.canvas.scene.add(child);
        }
    }
}