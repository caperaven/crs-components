import {schema} from "./bar-chart-program.js";
import {GraphicsParser} from "./../../../graphics-providers/graphics-parser.js";
import {enableOrthographicDraggable, disableOrthographicDraggable} from "../../../extensions/orthographic-canvas/orthographic-draggable.js";

export class BarChart extends HTMLElement {
    get barWidth() {
        if (this._barWidth == null) {
            this._barWidth = Number(this.getAttribute("bar-width") || 32);
        }
        return this._barWidth;
    }

    set barWidth(newValue) {
        this._barWidth = newValue;
    }

    get barPadding() {
        if (this._barPadding == null) {
            this._barPadding = Number(this.getAttribute("bar-padding") || 4);
        }
        return this._barPadding;
    }

    set barPadding(newValue) {
        this._barPadding = newValue;
    }

    get chartPadding() {
        if (this._chartPadding == null) {
            this._chartPadding = this.getAttribute("chart-padding") || "16,16";
        }

        const parts = this._chartPadding.split(",");
        return {
            x: Number(parts[0]),
            y: Number(parts[1])
        }
    }

    set chartPadding(newValue) {
        this._chartPadding = newValue;
    }

    connectedCallback() {
        this.initialize().catch(e => console.error(e));
    }

    async initialize() {
        const parser = new GraphicsParser();
        await parser.initialize();
        this._program = await parser.parse(schema, this);

        requestAnimationFrame(() => {
            this.width = this.offsetWidth;
            this.height = this.offsetHeight;
            this._offsetX = -Math.round(this.width / 2);
            this._offsetY = -Math.round(this.height / 2);

            enableOrthographicDraggable(this._program.canvas);
            this.dispatchEvent(new CustomEvent("ready"));
        })
    }

    disconnectedCallback() {
        disableOrthographicDraggable(this._program.canvas);
        this._program = this._program.dispose();
    }

    async draw(data) {
        const chartPadding = this.chartPadding;
        const workingWidth = this.width - (chartPadding.x * 2);
        const workingHeight = this.height - (chartPadding.y * 2);
        let barWidth = this.barWidth;

        const maxValue = await this.getMaxValue(data);
        const heightScale = workingHeight / maxValue;
        const maxRowCount = workingWidth / this.barWidth;

        if (data.length < maxRowCount) {
            barWidth = workingWidth / this.data.length - this.barPadding;
        }

        for (let i = 0; i < data.length; i++) {
            const barHeight = data[i].value * heightScale;
            const item = {
                x: this._offsetX + (i * barWidth) + (i * this.barPadding) + (barWidth / 2) + chartPadding.x,
                y: this._offsetY + chartPadding.y + barHeight / 2,
                barWidth: barWidth,
                barHeight: barHeight
            }
            await this._program.addFromTemplate(0, item)
        }

        await this._program.render();
    }

    async getMaxValue(data) {
        return Math.max(...data.map(item => item.value));
    }

    async render() {
        await this._program.render();
    }
}

customElements.define("crs-bar-chart", BarChart);