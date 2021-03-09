export async function enableRowRendering(parent) {
    parent._renderer = new RowRenderer(parent);
}

export async function disableRowRendering(parent) {
    parent._renderer.dispose();
    delete parent._renderer;
}

class RowRenderer {
    constructor(parent) {
        this.grid = parent;
    }

    dispose() {
        delete this.grid;
    }

    async render(startIndex, count) {
        const rowHeight = this.grid._rowFactory.dimensions.rowHeight;
        const leftOffset = Math.round(this.grid._rowFactory.dimensions.rowWidth / 2);
        const top = Math.round(rowHeight / 2);

        for (let i = 0; i < count; i++) {
            const nextTop = top + (i * rowHeight);
            const rowItem = await this.grid._rowFactory.get(this.grid.data[i], i);

            this.grid.canvas.canvasPlace(rowItem, leftOffset, nextTop);
            this.grid.canvas.scene.add(rowItem);
        }

        this.grid.canvas.render();
    }

    async structureChanged() {
        await this.grid._rowFactory.updateRenderFunction(this.grid.columnsDef);

        const leftOffset = Math.round(this.grid._rowFactory.dimensions.rowWidth / 2);

        const rowItems = this.grid.canvas.scene.children.filter(item => item.__type == "data-row");
        for (let rowItem of rowItems) {
            const row = this.grid.data[rowItem.__index];
            await this.grid._rowFactory.update(row, rowItem);
            rowItem.position.x = leftOffset;
        }

        this.grid.canvas.render();
    }
}