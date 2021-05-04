import {BaseManager} from "./base-manager.js";
import {processProperty} from "../helpers/property-processor.js";

const fnMap = new Map([
    ["position", cameraPosition],
    ["background", createColor],
])

export default class ContextManager extends BaseManager {
    get key() {
        return "context";
    }

    async processItem(context, program, parentElement) {
        const canvas = await this.parser.providers.get("camera").process(context);
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        parentElement.appendChild(canvas);

        return new Promise(resolve => {
            const isReady = async () => {
                canvas.removeEventListener("ready", isReady);
                program.canvas = canvas;
                await this._processArgs(canvas, program, context.args);
                resolve();
            }

            canvas.addEventListener("ready", isReady);
        })
    }

    async _processArgs(canvas, program, args) {
        if (args == null) return;
        const keys = Object.keys(args);
        for (let key of keys) {
            if (fnMap.has(key)) {
                await fnMap.get(key)(args, canvas, key, program);
            }
            else {
                canvas[key] = args[key];
            }
        }
    }
}

async function cameraPosition(args, canvas, key, program) {
    if (args == null || args.position == null) return;
    const pos = processProperty(args[key], program);
    canvas.camera.position.set(pos.x || 0, pos.y || 0, pos.z || 0);
}

async function createColor(args, canvas, key, program) {
    if (args[key].indexOf("#") != -1) {
        return canvas[key] = args[key];
    }
    canvas[key] = program.colors[args[key]];
}



