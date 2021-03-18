import {BaseParser} from "/node_modules/crs-schema/es/base-parser.js";
import MaterialManager from "./managers/material-manager.js";
import ContextManager from "./managers/context-manager.js";
import SceneProvider from "./providers/scene-provider.js";
import CameraProvider from "./providers/camera-provider.js";
import LineGeometryProvider from "./providers/geometry/line-geometry-provider.js";
import PlaneGeometryProvider from "./providers/geometry/plane-geometry-provider.js";
import GridHelperProvider from "./providers/geometry/grid-helper-provider.js";
import BoxGeometry from "./providers/geometry/box-geometry-provider.js";

export class GraphicsParser extends BaseParser {
    async initialize() {
        await this.register(ContextManager);
        await this.register(MaterialManager);
        await this.register(CameraProvider);
        await this.register(SceneProvider);
        await this.register(PlaneGeometryProvider);
        await this.register(LineGeometryProvider);
        await this.register(GridHelperProvider);
        await this.register(BoxGeometry);
    }

    async parse(schema, parentElement) {
        const program = new Program();
        await program.loadRequired(schema.requires || []);

        await this.managers.get("context").processItem(schema.context, parentElement, program);
        await this.managers.get("materials").processItem(schema.materials, program);

        await this._processContextGrid(schema, program);
        await this._processCameraPosition(schema, program);

        await this.providers.get("scene").processItem(schema.scene, program);

        await program.render();
        return program;
    }

    async _processContextGrid(schema, program) {
        if (schema.context.grid != null) {
            await this.providers.get("GridHelper").processItem(schema.context.grid, program);
        }
    }

    async _processCameraPosition(schema, program) {
        if (schema.context.parameters == null || schema.context.parameters.position == null) return;
        const pos = schema.context.parameters.position;
        program.canvas.camera.position.set(pos.x || 0, pos.y || 0, pos.z || 0);
    }
}

class Program {
    constructor() {
        this._modules = [];
        this.materials = new Map();
        return this;
    }

    dispose() {
        this.canvas = null;
        this._modules.length = 0;
        this.materials.clear();
        this.materials = null;
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