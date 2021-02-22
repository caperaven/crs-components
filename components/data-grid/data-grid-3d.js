import {DataGridBase} from "./data-grid-base.js";
import {initialize} from './3d/initialize.js';
import {addCube, addPlane} from './3d/shapes.js';
import {createScrollBox} from "./scrollbox.js";
import {generateRowRenderer} from "./data-grid-row-utils.js";
import {Texture} from '/node_modules/three/src/textures/Texture.js';

class DataGrid3d extends DataGridBase {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        this.refresh().catch(e => console.error(e));
    }

    async connectedCallback() {
        this.scrollHandler = this.scroll.bind(this);
        this.style.position = "relative";
        this.offsetX = 0;
        this.offsetY = 0;

        requestAnimationFrame(async () => {
            this.rect = this.getBoundingClientRect();
            createScrollBox(this);
            this.dispatchEvent(new CustomEvent("ready"));
        });
    }

    async disconnectedCallback() {
        this._disposing = true;
        await this._clearBackBuffer();
        this._columnsDef = null;
        this.env = null;
    }

    async initialize(columnsDef) {
        this.textHeight = 12;
        this.padding = 16;
        this.rowHeight = this.textHeight = (this.padding * 2);
        this.pageSize = this.rect.height / this.rowHeight;
        this._columnsDef = columnsDef;

        const cameraLocation = {z: 5, viewWidth: this.rect.width, viewHeight: this.rect.height}
        const rendererParameters = {antialias: true} // see WebGLRendererParameters
        const lightProperties = {
            x: 5,
            y: 5,
            z: 7.5,
            color: 0xffffff,
            integrity: 1.0
        }

        this.env = initialize(cameraLocation, rendererParameters, lightProperties, this);

        this._initializeTextures();

        this.env.renderer.render(this.env.scene, this.env.camera);

        const animate = () => {
            if (this._disposing != true) {
                requestAnimationFrame(animate);

                this.env.renderer.render(this.env.scene, this.env.camera);
            }
        }

        animate();
    }

    _initializeTextures() {
        this.textHeight = 12;
        this.rowHeight = 44;

        const args = {
            columnsDef: this._columnsDef,
            rowWidth: this.rect.width,
            rowHeight: this.rowHeight,
            textHeight: this.textHeight,
            padding: this.padding
        }

        this.rowRenderer = generateRowRenderer(args);
    }

    async redrawItem(id) {
        const target = this.rows.get(id);
        if (target.texture == null) {
            target.texture = new Texture(target.ctx.canvas);
        }
        addPlane(this.env.scene, target.texture, this.rect.width, this.rowHeight);
    }

    async _redrawAll() {
        await this.redrawItem(0);

        // for (let i = this.startIndex; i < this.endIndex; i++) {
        //     const row = this.data[i];
        //     await this.redrawItem(row.id);
        // }
    }
}

customElements.define("data-grid-3d", DataGrid3d)