import {BaseManager} from "./base-manager.js";

export default class ColorsManager extends BaseManager {
    get key() {
        return "colors";
    }

    async processItem(colors, program) {
        if (colors != null) {
            program.colors = {};
            for (let color of colors) {
                program.colors[color.id] = await crs.createColor(color.color);
            }

            await ColorsManager.enable(program);
        }
    }

    static async enable(program) {
        program.setColor = setColor.bind(program);
        program._disposables.push(dispose.bind(program));
    }
}

async function dispose() {
    delete this.setColor;
    this.colors = null;
}

async function setColor(id, value) {
    this.colors[id] = await crs.createColor(value);
}