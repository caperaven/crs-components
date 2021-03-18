import {BaseChart} from "./crs-base-chart.js";

export class VirtualizedBarChart extends BaseChart {
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

        this.dummy = await crs.createThreeObject("Object3D");
        this.geometry = await crs.createThreeObject("PlaneGeometry", 1, 1);
        this.material = await crs.createThreeObject("MeshBasicMaterial");

        this.canvas = this.querySelector("canvas");
        this._mousedownHandler = this._mousedown.bind(this);
        this._mouseupHandler = this._mouseup.bind(this);
        this._mousemoveHandler = this._mousemove.bind(this);
        this.canvas.addEventListener("mousedown", this._mousedownHandler);

        if (this.data.length > 0) {
            await this._dataChanged();
        }
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
        const moveOffsetX = this._startX - event.clientX;
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
        if (this.isReady != true) {
            return;
        }

        this.currentIndex = 0;
        await this.calculateOffsets();
        await this.createUI();
    }

    async createUI() {
        const chartPadding = this.chartPadding;

        this.mesh = await crs.createThreeObject("InstancedMesh", this.geometry, this.material, this.visibleCount);
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
        if (this.mesh == null) return;

        const chartPadding = this.chartPadding;
        let toIndex = Math.round(fromIndex);
        if (toIndex == this._oldIndex) return;

        for (let i = 0; i < this.visibleCount; i++) {
            if (toIndex > this.data.length - 1) {
                break;
            }

            await this.scaleItem(i, toIndex);
            await this.positionItem((i * this.barWidth) + (i * this.barPadding), 0, chartPadding.x, chartPadding.y);
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
            toIndex++;
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
        const clr = await crs.createColor(color);
        this.mesh.setColorAt(index, clr);
        this.mesh.instanceColor.needsUpdate = true;
    }

    async moveData(offset) {
        const indexOffset = ((offset / this.visibleCount) * 0.01);
        this.currentIndex = this.currentIndex + indexOffset;
        if (this.currentIndex > 0 && this.currentIndex < this.data.length - this.visibleCount) {
            await this.updateGraphics(this.currentIndex);
        }
        else {
            this.currentIndex = this.currentIndex < 0 ? 0 : this.data.length - this.visibleCount;
        }
    }
}

customElements.define("virtualized-bar-chart", VirtualizedBarChart);