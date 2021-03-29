import {initializeProviders} from "./providers.js";

export class TemplateParser {
    async initialize() {
        await initializeProviders();
    }

    async parse(template, program, data) {
        console.log(template);
    }
}