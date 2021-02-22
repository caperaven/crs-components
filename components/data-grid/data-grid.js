import {createScrollBox} from "./scrollbox.js";
import {DataGridBase} from "./data-grid-base.js";

class DataGrid extends DataGridBase {
    async connectedCallback() {
        this.scrollHandler = this.scroll.bind(this);
        this.style.position = "relative";
        this.offsetX = 0;
        this.offsetY = 0;

        requestAnimationFrame(async () => {
            this.rect = this.getBoundingClientRect();
            createScrollBox(this);

            this._ctx = crs.canvas.create(this.rect.width, this.rect.height);
            this.appendChild(this._ctx.canvas);
            this.dispatchEvent(new CustomEvent("ready"));
        });
    }

    async disconnectedCallback() {
        await this._clearBackBuffer();

        this._ctx = null;
        this._columnsDef = null;
    }

    async redrawItem(id) {
        const target = this.rows.get(id);
        this._ctx.drawImage(target.ctx.canvas, -this.offsetX, target.index * this.rowHeight - this.offsetY);
    }

    async _redrawAll() {
        crs.canvas.clear(this._ctx, "#ffffff");

        for (let i = this.startIndex; i < this.endIndex; i++) {
            const row = this.data[i];
            await this.redrawItem(row.id);
        }
    }
}

customElements.define("data-grid", DataGrid)