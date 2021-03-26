import {BaseParser} from "/node_modules/crs-schema/es/base-parser.js";
import MaterialManager from "./managers/material-manager.js";
import ContextManager from "./managers/context-manager.js";
import TextureManager from "./managers/texture-manager.js";
import LocationsManager from "./managers/locations-manager.js";
import ExtensionsManager from "./managers/extensions-manager.js";
import TemplateManager from "./managers/template-manager.js";
import SceneProvider from "./providers/scene-provider.js";
import CameraProvider from "./providers/camera-provider.js";
import LineGeometryProvider from "./providers/geometry/line-geometry-provider.js";
import PlaneGeometryProvider from "./providers/geometry/plane-geometry-provider.js";
import BoxGeometry from "./providers/geometry/box-geometry-provider.js";
import RawMaterialProvider from "./providers/materials/raw-material-provider.js";
import HelpersProvider from "./providers/helpers/helpers-provider.js";

export class GraphicsParser extends BaseParser {
    constructor() {
        super();
        this.processors = new Map();
    }

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

        for (let provider of providers || []) {
            await this.register(provider);
        }
    }

    async parse(srcSchema, parentElement) {
        const schema = JSON.parse(JSON.stringify(srcSchema));

        const ignore = ["scene", "locations"];
        const program = new Program();
        program.parser = this;

        await this.managers.get("locations").processItem(schema.locations, program);
        await this._loadModules(schema, program);

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

    async _loadModules(schema, program) {
        if (schema.requires == null) return;
        program._modules = [];
        program._disposables.push(program._modules);

        for (let require of schema.requires) {
            if (require.trim().indexOf("@locations") == 0) {
                require = await this.processors.get("locations")(require, this.locations);
            }
            program._modules.push(await import(require));
        }
    }
}

class Program {
    constructor() {
        this._disposables = [];
        return this;
    }

    async dispose() {
        this._disposables = await disposeItems(this._disposables);
        this.canvas = null;
        return null;
    }

    async render() {
        this.canvas.render();
    }
}

async function disposeItems(disposables) {
    for (let i = 0; i < disposables.length; i++) {
        const disposable = disposables[i];
        if (Array.isArray(disposable)) {
            disposable.length = 0;
        }
        else if (disposable.constructor.name == "Map") {
            disposable.clear();
        }
        else if (typeof disposable == "function") {
            await disposable();
        }
        else if (disposable.dispose != null) {
            await disposable.dispose();
        }
        disposables[i] = null;
    }
    disposables.length = 0;
    return null;
}