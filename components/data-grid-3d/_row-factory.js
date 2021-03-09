import {BaseCacheFactory} from "./../lib/base-cache-factory.js";
import {calculateRowWidth, createRowItem, generateRowRenderer} from "./_row-utils.js";

export async function enableRowFactory(parent) {
    parent._rowFactory = new RowFactory(parent);
}

export async function disableRowFactory(parent) {
    parent._rowFactory.dispose();
    delete parent._rowFactory;
}

class RowFactory extends BaseCacheFactory {
    constructor(parent) {
        super();

        this.grid = parent;

        this.setDimensions(0, 48);
    }

    dispose() {
        super.dispose();
        delete this.grid;
        this.canvasInflatorFn = null;
    }

    async createCacheItem() {
        const ctx = crs.canvas.createCanvasForTexture(this.dimensions.rowWidth, this.dimensions.rowHeight);
        return createRowItem(ctx);
    }

    async setDimensions(rowWidth, rowHeight, paddingLeft = 16, paddingRight = 16, minRowWidth = 140) {
        this.padding = {
            left: paddingLeft,
            right: paddingRight
        }

        this.dimensions = {
            rowWidth: rowWidth,
            rowHeight: rowHeight,
            minWidth: minRowWidth
        }

        this.grid.pageSize = Math.round(this.grid.canvas.height / this.dimensions.rowHeight);
    }

    async updateRenderFunction(columnsDef) {
        this.dimensions.rowWidth = calculateRowWidth(columnsDef, this.dimensions.minWidth);

        const args = {
            columnsDef: columnsDef,
            rowWidth: this.dimensions.rowWidth,
            rowHeight: this.dimensions.rowHeight,
            textHeight: 22,
            padding: this.padding.left,
            minWidth: this.dimensions.minWidth
        }

        this.canvasInflatorFn = await generateRowRenderer(args);
    }

    async return(item) {
        delete item.__id;
        delete item.__index;
        return super.return(item);
    }

    async get(row, index) {
        const rowItem = await super.get();
        rowItem.__id = row.id;
        rowItem.__index = index;

        await this.update(row, rowItem);
        return rowItem;
    }

    async update(row, rowItem) {
        crs.canvas.resizeCanvas(rowItem.__ctx, this.dimensions.rowWidth, this.dimensions.rowHeight);
        rowItem.scale.set(this.dimensions.rowWidth, this.dimensions.rowHeight, 1);
        rowItem.material.map.needsUpdate = true;
        await this.canvasInflatorFn(row, rowItem.__ctx);
    }
}