import {BaseManager} from "./base-manager.js";
import {LayerParser} from "../layer-parser.js";

export default class layersManager extends BaseManager {
    get key() {
        return "layers";
    }

    async processItem(layers, program) {
        program._layers = layers;
        program._layerParser = new LayerParser();
        program._disposables.push(dispose.bind(program));
        program.setLayerVisibility = setLayerVisibility.bind(program);
        program.toggleLayerVisibility = toggleLayerVisibility.bind(this);
        await program._layerParser.initialize();
    }
}

async function dispose() {
    this._layerParser = this._layerParser.dispose();
    this._layers = null;
    delete this.setLayerVisibility;
    delete this.toggleLayerVisibility;
}

async function setLayerVisibility(id, visible, layer) {
    layer = layer || this._layers.find(item => item.id == id);
    if (layer.group == null && visible == false) return;

    if (layer.group != null) {
        layer.group.visible = visible;
    }
    else {
        layer.group = await this._layerParser.parse(layer, this);
        this.canvas.scene.add(layer.group);
        delete layer.elements;
    }
}

async function toggleLayerVisibility(id) {
    const layer = this._layerParser.find(item => item.id == id);
    if (layer.group != null) {
        layer.group.visible = !layer.group.visible;
    }
    else {
        this.setLayerVisibility(id, true, layer);
    }
}