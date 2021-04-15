import {initializeProviders} from "./providers.js";

export class TemplateParser {
    async initialize() {
        await initializeProviders();
    }

    async parse(template, program, data) {
        const copy = JSON.parse(JSON.stringify(template));
        if (copy.element != null) {
            return await this.parseElement(copy, program, data);
        }
    }

    async parseElement(element, program, data) {
        const provider = new crs.gfx.providers[element.element]();
        return await provider.processItem(element, program, data);
    }
}