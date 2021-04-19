import {BaseProvider} from "./base-provider.js";

export default class TextProvider extends BaseProvider {
    get key() {
        return "Text";
    }

    async processItem(item, program) {
        const font = program._fonts[item.font];
        return await program.textRenderer.createWord(font, item.text, item.color, item.size);
    }
}