import {BaseManager} from "./base-manager.js";

export default class ContextManager extends BaseManager {
    get key() {
        return "context";
    }

    async processItem(context, parentElement, program) {
        const canvas = await this.parser.providers.get("camera").process(context);
        parentElement.appendChild(canvas);

        return new Promise(resolve => {
            const isReady = async () => {
                canvas.removeEventListener("ready", isReady);
                program.canvas = canvas;
                resolve();
            }

            canvas.addEventListener("ready", isReady);
        })
    }

}