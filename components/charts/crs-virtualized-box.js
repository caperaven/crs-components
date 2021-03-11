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
        this.offscreenMesh = null;
        this.geometry = null;
        this.material = null;
        await super.disconnectedCallback();
    }

    async ready() {
        this._offsetX = -Math.round(this.width / 2);
        this._offsetY = -Math.round(this.height / 2);

        this.dummy = new Object3D();
        this.geometry = new PlaneGeometry(1, 1);
        this.material = new MeshBasicMaterial();
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
            await this.scaleItem(i);
            await this.positionItem((i * this.barWidth) + (i * this.barPadding), 0, chartPadding.x, chartPadding.y);
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
            await this.updateColor(i, "#ff0090");
        }

        this.render();
    }

    async updateGraphics(fromIndex) {
        const toIndex = fromIndex + this.visibleCount;

        for (let i = 0; i < toIndex; i++) {
            await this.scaleItem(i);
        }

        this.mesh.instanceMatrix.needsUpdate = true;

        this.render();
    }

    async scaleItem(index) {
        const item = this.data[index];
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
}

// mesh = new THREE.InstancedMesh( geometry, material, count );
// const dummy = new THREE.Object3D();
// dummy.position.set( offset - x, offset - y, offset - z );
// dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
// dummy.rotation.z = dummy.rotation.y * 2;
//
// dummy.updateMatrix();
//
// mesh.setMatrixAt( i ++, dummy.matrix );
// mesh.setColorAt( i, color );

customElements.define("virtualized-bar-chart", VirtualizedBox);