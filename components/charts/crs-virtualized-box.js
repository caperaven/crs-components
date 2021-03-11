import {BaseChart} from "./crs-base-chart.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {Object3D} from "/node_modules/three/src/core/Object3D.js";
import {InstancedMesh} from "/node_modules/three/src/objects/InstancedMesh.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";

export class VirtualizedBox extends BaseChart {
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
        this.canvas.removeEventListener("mousedown", this._mousedownHandler);

        this.geometry = null;
        this.material = null;
        this.canvas = null;
        this._mousedownHandler = null;
        this._mouseupHandler = null;
        this._mousemoveHandler = null;

        await super.disconnectedCallback();
    }

    async ready() {
        this._offsetX = -Math.round(this.width / 2);
        this._offsetY = -Math.round(this.height / 2);

        this.dummy = new Object3D();
        this.geometry = new PlaneGeometry(1, 1);
        this.material = new MeshBasicMaterial();

        this.canvas = this.querySelector("canvas");
        this._mousedownHandler = this._mousedown.bind(this);
        this._mouseupHandler = this._mouseup.bind(this);
        this._mousemoveHandler = this._mousemove.bind(this);
        this.canvas.addEventListener("mousedown", this._mousedownHandler);
    }

    async _mousedown(event) {
        this._startX = event.clientX;
        this.canvas.addEventListener("mousemove", this._mousemoveHandler);
        this.canvas.addEventListener("mouseup", this._mouseupHandler);
    }

    async _mouseup(event) {
        this.canvas.removeEventListener("mousemove", this._mousemoveHandler);
        this.canvas.removeEventListener("mouseup", this._mouseupHandler);
    }

    async _mousemove(event) {
        const moveOffsetX = event.clientX - this._startX;
        await this.moveData(moveOffsetX);
    }

    async calculateOffsets() {
        const chartPadding = this.chartPadding;
        const workingWidth = this.width - (chartPadding.x * 2);
        const workingHeight = this.height - (chartPadding.y * 2);

        const maxValue = await this.getMaxValue();
        this.heightScale = workingHeight / maxValue;

        this.visibleCount = workingWidth / (this.barWidth + this.barPadding);
    }

    async _dataChanged() {
        this.currentIndex = 0;
        await this.calculateOffsets();
        await this.createUI();
    }

    async createUI() {
        const chartPadding = this.chartPadding;

        this.mesh = new InstancedMesh(this.geometry, this.material, this.visibleCount);
        this.scene.add(this.mesh);

        for (let i = 0; i < this.visibleCount; i++) {
            await this.scaleItem(i, i);
            await this.positionItem((i * this.barWidth) + (i * this.barPadding), 0, chartPadding.x, chartPadding.y);
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
            await this.updateColor(i, "#ff0090");
        }

        this.render();

        this._oldIndex = 0;
    }

    async updateGraphics(fromIndex) {
        let toIndex = Math.round(fromIndex);
        if (toIndex == this._oldIndex) return;

        for (let i = 0; i < this.visibleCount; i++) {
            await this.scaleItem(i, toIndex + i);
            this.mesh.setMatrixAt(i, this.dummy.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;

        this.render();
        this._oldIndex = fromIndex;
    }

    async scaleItem(index, dataIndex) {
        const item = this.data[dataIndex];
        const height = item.value * this.heightScale;
        this.mesh.getMatrixAt(index, this.dummy.matrix);
        this.dummy.scale.set(this.barWidth, height, 1);
    }

    async positionItem(x, y, chartPaddingX, chartPaddingY) {
        x = this._offsetX + x + (this.dummy.scale.x / 2) + chartPaddingX;
        y = this._offsetY + y + (this.dummy.scale.y / 2) + chartPaddingY;
        this.dummy.position.set(x, y, 0);
    }

    async updateColor(index, color) {
        this.mesh.setColorAt(index, new Color(color));
        this.mesh.instanceColor.needsUpdate = true;
    }

    async moveData(offset) {
        this.currentIndex = this.currentIndex - ((offset / this.visibleCount) * 0.01);
        await this.updateGraphics(this.currentIndex);
    }
}

customElements.define("virtualized-bar-chart", VirtualizedBox);