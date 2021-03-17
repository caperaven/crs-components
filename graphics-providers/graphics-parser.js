import {BaseParser} from "/node_modules/crs-schema/es/base-parser.js";
import CameraProvider from "./providers/camera-provider.js";
import MaterialManager from "./managers/material-manager.js";
import ContextManager from "./managers/context-manager.js";

export class GraphicsParser extends BaseParser {
    async initialize() {
        await this.register(ContextManager);
        await this.register(MaterialManager);
        await this.register(CameraProvider);
    }

    async parse(schema, parentElement) {
        const program = new Program();
        await program.loadRequired(schema.requires || []);

        await this.managers.get("context").processItem(schema.context, parentElement, program);
        await this.managers.get("materials").processItem(schema.materials, program);

        await program.render();
        return program;
    }
}

class Program {
    constructor() {
        this._modules = [];
        this._materials = new Map();
        return this;
    }

    dispose() {
        this.canvas = null;
        this._modules.length = 0;
        this._materials.clear();
        this._materials = null;
        return null;
    }

    async loadRequired(requires) {
        for (let require of requires) {
            this._modules.push(await import(require));
        }
        return this;
    }

    async render() {
        this.canvas.render();
    }
}