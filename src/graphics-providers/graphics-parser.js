import {BaseParser} from "/node_modules/crs-schema/es/base-parser.js";
import MaterialManager from "./managers/material-manager.js";
import ContextManager from "./managers/context-manager.js";
import TextureManager from "./managers/texture-manager.js";
import LocationsManager from "./managers/locations-manager.js";
import ExtensionsManager from "./managers/extensions-manager.js";
import SceneProvider from "./providers/scene-provider.js";
import CameraProvider from "./providers/camera-provider.js";
import LineGeometryProvider from "./providers/geometry/line-geometry-provider.js";
import PlaneGeometryProvider from "./providers/geometry/plane-geometry-provider.js";
import BoxGeometry from "./providers/geometry/box-geometry-provider.js";
import RawMaterialProvider from "./providers/materials/raw-material-provider.js";
import HelpersProvider from "./providers/helpers/helpers-provider.js";

export class GraphicsParser extends BaseParser {
    async initialize(providers) {
        await this.register(ContextManager);
        await this.register(LocationsManager);
        await this.register(MaterialManager);
        await this.register(TextureManager);
        await this.register(ExtensionsManager);
        await this.register(CameraProvider);
        await this.register(SceneProvider);
        await this.register(PlaneGeometryProvider);
        await this.register(LineGeometryProvider);
        await this.register(BoxGeometry);
        await this.register(HelpersProvider);
        await this.register(RawMaterialProvider);

        for (let provider of providers || {}) {
            await this.register(provider);
        }
    }

    async parse(srcSchema, parentElement) {
        const schema = JSON.parse(JSON.stringify(srcSchema));

        const ignore = ["scene", "locations"];
        const program = new Program();
        program.parser = this;

        await this.managers.get("locations").processItem(schema.locations, program);
        await program.loadRequired(schema.requires || []);

        // register managers
        const keys = Object.keys(schema);
        for (let key of keys) {
            if (ignore.indexOf(key) == -1) {
                const manager = this.managers.get(key);
                if (manager != null) {
                    await manager.processItem(schema[key], program, parentElement);
                }
            }
        }

        // context must be in place for this to continue;
        await this._processHelpers(schema.context.helpers, program);
        await this._processCameraPosition(schema, program);

        await this.providers.get("scene").processItem(schema.scene, program);

        delete program.parser;
        await program.render();
        return program;
    }

    async _processHelpers(helpers, program) {
        if (helpers == null) return;
        await this.providers.get("Helpers").processItem(helpers, program);
    }

    async _processCameraPosition(schema, program) {
        if (schema.context.args == null || schema.context.args.position == null) return;
        const pos = schema.context.args.position;
        program.canvas.camera.position.set(pos.x || 0, pos.y || 0, pos.z || 0);
    }
}

class Program {
    constructor() {
        this._modules = [];
        this._extensions = [];
        this.materials = new Map();
        this.textures = new Map();
        this.processors = new Map();
        return this;
    }

    async dispose() {
        for (let extension of this._extensions) {
            await extension(this.canvas);
        }

        this._extensions = null;

        this.canvas = null;
        this._modules.length = 0;
        this.materials.clear();
        this.materials = null;
        this.textures.clear();
        this.textures = null;
        this.locations = null;
        return null;
    }

    async loadRequired(requires) {
        for (let require of requires) {
            if (require.trim().indexOf("@locations") == 0) {
                require = await this.processors.get("locations")(require, this.locations);
            }
            this._modules.push(await import(require));
        }
        return this;
    }

    async render() {
        this.canvas.render();
    }
}