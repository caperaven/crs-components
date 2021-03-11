import {BaseChart} from "./crs-base-chart.js";
import {createNormalizedPlane} from "./../../threejs-helpers/shape-factory.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {enableOrthographicDraggable, disableOrthographicDraggable} from "./../../extensions/orthographic-canvas/orthographic-draggable.js";

export class SimpleBarChart extends BaseChart {
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

    canvasPlace(mesh, x, y) {
        mesh.position.set(x, y, 0);
    }

    async _dataChanged() {
        let index = 0;
        const chartPadding = this.chartPadding;
        await this.calculateOffsets();

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