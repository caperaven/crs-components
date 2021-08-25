import "./../../src/components/dropdown-button/dropdown-button.js";
import "./../../src/components/lists/unordered-list.js";
import {schema} from "./schema.js";

export default class InteractiveGraphics extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        await this.initialize();
    }

    preLoad() {
        this.setProperty("context", this._dataId);
    }

    async initialize() {
        const parent = document.querySelector(".canvas-parent");
        const parser = await crs.modules.getInstanceOf("GraphicsParser");
        await parser.initialize([]);
        this._program = await parser.parse(schema, parent, {background: "#ff0050"});

        console.log(this._program);

        await this.initProperties();

        await parser.dispose();
    }

    async initProperties() {
        const drawing = this._program.drawing;
        drawing.stroke.dotted.icon = "star";

        this.setProperty("fillEnabled",     drawing.fill.enabled);
        this.setProperty("fillColor",       drawing.fill.color);
        this.setProperty("strokeEnabled",   drawing.stroke.enabled);
        this.setProperty("strokeColor",     drawing.stroke.color);
        this.setProperty("strokeType",      drawing.stroke.type);
        this.setProperty("strokeWidth",     drawing.stroke.lineWidth);
        this.setProperty("strokeJoint",     drawing.stroke.lineJoin);
        this.setProperty("startCap",        drawing.stroke.startCap);
        this.setProperty("endCap",          drawing.stroke.endCap);
        this.setProperty("image",           drawing.stroke.dotted.icon);
        this.setProperty("xScale",          drawing.stroke.dotted.xScale);
        this.setProperty("yScale",          drawing.stroke.dotted.yScale);
        this.setProperty("gap",             drawing.stroke.dotted.gap);
        this.setProperty("rotation",        drawing.stroke.dotted.rotation);
        this.setProperty("penType",         drawing.pen.type);
        this.setProperty("drawOperation",   drawing.pen.drawOperation);
    }

    async disconnectedCallback() {
        this._program = this._program.dispose();
        await super.disconnectedCallback();
    }

    async state_select() {
        this._program.canvas._inputManager.gotoState(this._program.inputStates.SELECT);
        document.querySelector("#properties-panel").view = "none";
    }

    async state_rectangle() {
        this._program.canvas._inputManager.gotoState(this._program.inputStates.DRAW_RECTANGLE);
        document.querySelector("#properties-panel").view = "pen";
    }

    async state_circle() {
        this._program.canvas._inputManager.gotoState(this._program.inputStates.DRAW_CIRCLE);
        document.querySelector("#properties-panel").view = "pen";
    }

    async state_polygon() {
        this._program.canvas._inputManager.gotoState(this._program.inputStates.DRAW_POLYGON);
        document.querySelector("#properties-panel").view = "pen";
    }

    async refresh() {
        this._program.render();
    }

    async fillEnabledChanged(newValue) {
        this._program.drawing.fill.enabled = newValue;
    }

    async fillColorChanged(newValue) {
        this._program.drawing.fill.color = newValue;
    }

    async strokeEnabledChanged(newValue) {
        this._program.drawing.stroke.enabled = newValue;
    }

    async strokeColorChanged(newValue) {
        this._program.drawing.stroke.color = newValue;
    }

    async strokeTypeChanged(newValue) {
        this._program.drawing.stroke.type = newValue;
    }

    async strokeWidthChanged(newValue) {
        this._program.drawing.stroke.lineWidth = newValue;
    }

    async strokeJointChanged(newValue) {
        this._program.drawing.stroke.lineJoin = newValue;
    }

    async startCapChanged(newValue) {
        this._program.drawing.stroke.startCap = newValue;
    }

    async endCapChanged(newValue) {
        this._program.drawing.stroke.endCap = newValue;
    }

    async penTypeChanged(newValue) {
        this._program.drawing.pen.type = newValue;
    }

    async imageChanged(newValue) {
        this._program.drawing.stroke.dotted.icon = newValue;
    }

    async xScaleChanged(newValue) {
        this._program.drawing.stroke.dotted.xScale = newValue;
    }

    async yScaleChanged(newValue) {
        this._program.drawing.stroke.dotted.yScale = newValue;
    }

    async gapChanged(newValue) {
        this._program.drawing.stroke.dotted.gap = newValue;
    }

    async rotationChanged(newValue) {
        this._program.drawing.stroke.dotted.rotation = newValue;
    }

    async drawOperationChanged(newValue) {
        this._program.drawing.pen.drawOperation = newValue;
    }
}