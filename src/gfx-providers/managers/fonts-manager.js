import {BaseManager} from "./base-manager.js";
import {TextRenderer} from "../runtime-classes/text-renderer.js";

export default class FontsManager extends BaseManager {
    get key() {
        return "fonts";
    }

    async processItem(fonts, program) {
        program._fonts = {}
        program._disposables.push(dispose.bind(program));
        program.textRenderer = new TextRenderer();

        for (let font of fonts) {
            const fontItem = await fetch(font.font).then(result => result.json());
            delete fontItem.kernings;
            delete fontItem.pages;
            program._fonts[font.id] = fontItem;
        }
    }
}

async function dispose() {
    this._fonts = null;
    this.textRenderer = null;
}