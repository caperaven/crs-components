import {initializeProviders} from "../providers.js";

export class LayerParser {
    async initialize() {
        await initializeProviders();
    }

    async parse(layer, program) {
        const copy = JSON.parse(JSON.stringify(layer));
        const group = await crs.createThreeObject("Group");

        if (copy.elements != null) {
            for (let element of copy.elements) {
                const mesh = await this.parseElement(element, program);
                group.add(mesh);
            }
        }

        return group;
    }

    async parseElement(element, program) {
        const provider = new crs.gfx.providers[element.element]();
        return await provider.processItem(element, program);
    }
}