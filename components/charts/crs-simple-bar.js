import {OrthographicCanvas} from "./../orthographic-canvas/orthographic-canvas.js";
import {createNormalizedPlane} from "./../../threejs-helpers/shape-factory.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {enableOrthographicDraggable, disableOrthographicDraggable} from "./../../extensions/orthographic-canvas/orthographic-draggable.js";

export class SimpleBarChart extends OrthographicCanvas {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        this._dataChanged();
    }

    get color() {
        if (this._color == null) {
            this._color = this.getAttribute("color") || "#2A7FCD";
        }
        return Number(this._color.replace("#", "0x"));
    }

    set color(newValue) {
        this._color = newValue;
    }

    get disabledColor() {
        if (this._disabledColor == null) {
            this._disabledColor = this.getAttribute("disabled-color") || "#BEC0C3";
        }
        return Number(this._disabledColor.replace("#", "0x"));
    }

    set disabledColor(newValue) {
        this._disabledColor = newValue;
    }

    get selectedColor() {
        if (this._selectedColor == null) {
            this._selectedColor = this.getAttribute("selected-color") || "#1C568A"
        }
        return Number(this._selectedColor.replace("#", "0x"));
    }

    set selectedColor(newValue) {
        this._selectedColor = newValue;
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

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await disableOrthographicDraggable(this);
    }

    async ready() {
        this._offsetX = -Math.round(this.width / 2);
        this._offsetY = -Math.round(this.height / 2);
        await enableOrthographicDraggable(this, false, true);
    }

    async calculateOffsets() {
        const chartPadding = this.chartPadding;
        const workingWidth = this.width - (chartPadding.x * 2);
        const workingHeight = this.height - (chartPadding.y * 2);

        const maxValue = await this.getMaxValue();
        this.heightScale = workingHeight / maxValue;

        const maxRowCount = workingWidth / this.barWidth;
        if (this.data.length < maxRowCount) {
            this.barWidth = workingWidth / this.data.length - this.barPadding;
            this._draggable.enabled = false;
        }
        else {
            this._draggable.enabled = true;
        }
    }

    async getMaxValue() {
        return Math.max(...this.data.map(item => item.value));
    }

    canvasPlace(mesh, x, y) {
        mesh.position.set(x, y, 0);
    }

    async _dataChanged() {
        let index = 0;
        const chartPadding = this.chartPadding;
        await this.calculateOffsets();

        /**
         * JHR: TODO we need to make this instanced so that it lessons the draw calls
         */
        for (let item of this.data) {
            const plane = createNormalizedPlane(this.barWidth, item.value * this.heightScale);
            plane.material.color = new Color(this.color);
            this.scene.add(plane);
            this.canvasPlace(plane, (index * this.barWidth) + (index * this.barPadding), 0, chartPadding.x, chartPadding.y);
            index ++;
        }

        this.render();
    }

    canvasPlace(mesh, x, y, chartPaddingX, chartPaddingY) {
        x = this._offsetX + x + (mesh.scale.x / 2) + chartPaddingX;
        y = this._offsetY + y + (mesh.scale.y / 2) + chartPaddingY;
        mesh.position.set(x, y, 0);
    }
}

customElements.define("simple-bar-chart", SimpleBarChart);