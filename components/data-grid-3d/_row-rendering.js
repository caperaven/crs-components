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
        this.batchSize = Math.round((parent.canvas.height / 2) / parent._rowFactory.dimensions.rowHeight);
        this.currentRenderBatch = [];
    }

    dispose() {
        delete this.grid;
        this.currentRenderBatch = null;
    }

    async initialize(pageSize) {
        this.pageSize = pageSize;
        return this.render(0, this.pageSize * 2);
    }

    async render(startIndex, count, direction = 1) {
        const rowHeight = this.grid._rowFactory.dimensions.rowHeight;
        const leftOffset = Math.round(this.grid._rowFactory.dimensions.rowWidth / 2);
        const top = Math.round(rowHeight / 2);

        if (direction == 1) {
            await this.renderBottomItems(startIndex, count, rowHeight, top, leftOffset);
        }
        else {
            await this.renderTopItems(startIndex, count, rowHeight, top, leftOffset);
        }

        // for (let i = 0; i < count; i++) {
        //     const index = startIndex + i;
        //     if (index > this.grid.data.length - 1) {
        //         break;
        //     }
        //
        //     const nextTop = top + (index * rowHeight);
        //     const rowItem = await this.grid._rowFactory.get(this.grid.data[index], index);
        //
        //     this.grid.canvas.canvasPlace(rowItem, leftOffset, nextTop);
        //     this.grid.canvas.scene.add(rowItem);
        //     this.currentRenderBatch.push(rowItem);
        // }
        //
        // this.bottomIndex = startIndex + count;

        this.grid.canvas.render();
    }

    async renderBottomItems(startIndex, count, rowHeight, top, leftOffset) {
        for (let i = 0; i < count; i++) {
            const index = startIndex + i;
            if (index > this.grid.data.length - 1) {
                break;
            }

            const nextTop = top + (index * rowHeight);
            const rowItem = await this.grid._rowFactory.get(this.grid.data[index], index);

            this.grid.canvas.canvasPlace(rowItem, leftOffset, nextTop);
            this.grid.canvas.scene.add(rowItem);
            this.currentRenderBatch.push(rowItem);
        }
        this.bottomIndex = startIndex + count;
    }

    async renderTopItems(startIndex, count, rowHeight, top, leftOffset) {

    }

    async renderNextBatch() {
        return this.render(this.bottomIndex, this.batchSize);
    }

    async renderPreviousBatch() {
        return this.render(this.topIndex, this.batchSize, -1);
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