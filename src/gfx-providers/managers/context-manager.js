import {BaseManager} from "./base-manager.js";
import {processProperty} from "../helpers/property-processor.js";

const fnMap = {
    "position": cameraPosition,
    "background": createColor,
    "allow_drag": allowDrag,
    "interactive": makeInteractive,
}

const processModules = {
    "fxaa": "./../providers/post-processes/fxaa-provider.js",
    "smaa": "./../providers/post-processes/smaa-provider.js"
};

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
                await this._processPostProcesses(canvas, program, context.postProcesses);
                resolve();
            }

            canvas.addEventListener("ready", isReady);
        })
    }

    async _processArgs(canvas, program, args) {
        if (args == null) return;
        const keys = Object.keys(args);
        for (let key of keys) {
            if (fnMap[key] != null) {
                await fnMap[key](args, canvas, key, program);
            } else {
                canvas[key] = args[key];
            }
        }
    }

    async _processPostProcesses(canvas, program, postProcesses) {
        if (postProcesses == null) return;
        for (let process of postProcesses) {
            const key = process.process;
            if (processModules[key] != null) {
                let provider = new (await import(processModules[key])).default();
                await provider.processItem(process, program);
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

async function allowDrag(args, canvas, key, program) {
    if (args[key] === true) {
        const DragControl = (await import("./../../../third-party/three/external/controls/DragControls.js")).DragControls;
        program.dragControl = new DragControl([], canvas.camera, canvas.renderer.domElement);
        program.dragControl.addEventListener("drag", canvas.renderHandler);
        program._disposables.push(disposeDragControls.bind(program));
        program.updateDragMeshes = updateDragMeshes.bind(program);
    }
}

async function makeInteractive(args, canvas, key, program) {
    if (args[key] === true) {
        const module = await import("./../../extensions/input-manager/input-manager.js");
        program.inputManager = module.InputManager;
        program.inputStates = module.InputStates;
        await module.InputManager.enable(program.canvas, program);
        program._disposables.push(disposeInputManager.bind(program));

        program.drawing = {
            lineJoinOptions: Object.freeze({
                ROUND: "round",
                MITER: "miter",
                BEVEL: "bevel"
            }),
            capOptions: Object.freeze({
                ROUND: "round",
                SQUARE: "square",
                BEVEL: "bevel"
            }),
            strokeTypeOptions: Object.freeze({
                SOLID: "solid",
                DOTTED: "dotted"
            }),
            penTypeOptions: Object.freeze({
                POLYGON: "polygon",
                PEN: "pen"
            }),
            pen: {
                type: "polygon"
            },
            fill: {
                enabled: true,
                color: "#000000"
            },
            stroke: {
                enabled: false,
                type: "solid",
                color: "#ff0000",
                lineWidth: 10,
                lineJoin: "miter",
                startCap: null,
                endCap: null,
                dotted: {
                    icon: "",
                    xScale: 1,
                    yScale: 1,
                    gap: 0,
                    rotation: 0
                },
                toSoldString() {
                    const values = [];
                    if (this.lineJoin != null) {
                        values.push(`lj:${this.lineJoin}`);
                    }
                    if (this.startCap != null) {
                        value.push(`sc:${this.startCap}`)
                    }
                    if (this.endCap != null) {
                        value.push(`ec:${this.endCap}`)
                    }
                    return values.join(",");
                }
            }
        }
    }
}

async function updateDragMeshes() {
    this.dragControl._objects = this.canvas.scene.children.filter(item => {
        const className = item.constructor.name;
        return (className === "Mesh" || className === "Group") && item.visible === true;
    });
}

async function disposeDragControls() {
    this.dragControl.removeEventListener("drag", this.canvas.renderHandler);
    this.dragControl = this.dragControl.dispose();
    delete this.updateDragMeshes;
}

async function disposeInputManager() {
    await this.inputManager.disable(this.canvas);
    delete this.inputManager;
    delete this.inputStates;
    delete this.drawing;
}