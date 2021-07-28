import {BaseParser} from "/node_modules/crs-schema/es/base-parser.js";
import MaterialManager from "./managers/material-manager.js";
import ContextManager from "./managers/context-manager.js";
import TextureManager from "./managers/texture-manager.js";
import LocationsManager from "./managers/locations-manager.js";
import ExtensionsManager from "./managers/extensions-manager.js";
import TemplateManager from "./managers/template-manager.js";
import ColorsManager from "./managers/colors-manager.js";
import LayerManager from "./managers/layers-manager.js";
import FontsManager from "./managers/fonts-manager.js";
import SceneProvider from "./providers/scene-provider.js";
import CameraProvider from "./providers/camera-provider.js";
import LineGeometryProvider from "./providers/geometry/line-geometry-provider.js";
import PlaneGeometryProvider from "./providers/geometry/plane-geometry-provider.js";
import FlowChartProvider from "./providers/geometry/flow-chart-provider.js";
import BoxGeometry from "./providers/geometry/box-geometry-provider.js";
import IconGeometry from "./providers/geometry/icon-geometry-provider.js";
import RawMaterialProvider from "./providers/materials/raw-material-provider.js";
import HelpersProvider from "./providers/helpers/helpers-provider.js";
import LayerProvider from "./providers/layer-provider.js";
import TextProvider from "./providers/text-provider.js";
import CurveProvider from "./providers/geometry/curve-geometry-provider.js";
import {Program} from "./graphics-program.js";

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
        await this.register(TemplateManager);
        await this.register(ColorsManager);
        await this.register(LayerManager);
        await this.register(FontsManager);
        await this.register(CameraProvider);
        await this.register(SceneProvider);
        await this.register(PlaneGeometryProvider);
        await this.register(LineGeometryProvider);
        await this.register(BoxGeometry);
        await this.register(FlowChartProvider);
        await this.register(HelpersProvider);
        await this.register(RawMaterialProvider);
        await this.register(LayerProvider);
        await this.register(TextProvider);
        await this.register(IconGeometry);
        await this.register(CurveProvider);

        for (let provider of providers || []) {
            await this.register(provider);
        }
    }

    async parse(srcSchema, parentElement, properties) {
        const schema = JSON.parse(JSON.stringify(srcSchema));

        const ignore = ["scene", "locations"];
        const program = new Program();

        const propKeys = Object.keys(properties||{});
        for (let property of propKeys || []) {
            program[property] = properties[property];
        }

        program.parser = this;

        await this.managers.get("locations").processItem(schema.locations, program);
        await this._loadModules(schema);

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

        await this.providers.get("scene").processItem(schema.scene, program);

        delete program.parser;
        program.updateDragMeshes && await program.updateDragMeshes();
        await program.render();
        return program;
    }

    async _processHelpers(helpers, program) {
        if (helpers == null) return;
        await this.providers.get("Helpers").processItem(helpers, program);
    }

    async _loadModules(schema) {
        if (schema.requires == null) return;

        for (let require of schema.requires) {
            await crs.modules.get(require);
        }
    }
}