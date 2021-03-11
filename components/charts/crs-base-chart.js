import {OrthographicCanvas} from "../orthographic-canvas/orthographic-canvas.js";

export class BaseChart extends OrthographicCanvas {
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

    async getMaxValue() {
        return Math.max(...this.data.map(item => item.value));
    }
}