export async function enableVirtualization(parent) {
    parent.virtualizeBottomCallback = virtualizeBottomCallback;
    parent.virtualizeTopCallback = virtualizeTopCallback;
    parent._renderNextBatchHandler =  parent._renderer.renderNextBatch.bind(parent._renderer);
    parent._renderPreviousBatchHandler = parent._renderer.renderPreviousBatch.bind(parent._renderer);
    parent._returnTopBatchHandler = returnTopBatch.bind(parent);
    parent._returnBottomBatchHandler = returnBottomBatch.bind(parent);
}

export async function disableVirtualization(parent) {
    parent.virtualizeBottomCallback = null;
    parent.virtualizeTopCallback = null;
    parent._renderNextBatchHandler = null;
    parent._returnTopBatchHandler = null;
}

async function virtualizeBottomCallback() {
    // crsbinding.idleTaskManager.add(this._renderNextBatchHandler);
    // crsbinding.idleTaskManager.add(this._returnTopBatchHandler);
    this._renderNextBatchHandler();
    this._returnTopBatchHandler();
}

async function virtualizeTopCallback() {
    // crsbinding.idleTaskManager.add(this._renderPreviousBatchHandler);
    // crsbinding.idleTaskManager.add(this._returnBottomBatchHandler);
    this._renderPreviousBatchHandler();
    this._returnBottomBatchHandler();
}

async function returnTopBatch() {
    const size = this._renderer.batchSize - 5;
    const itemsToRestore = this._renderer.currentRenderBatch.splice(0, size);
    this._renderer.topIndex = this._renderer.currentRenderBatch[0].__index - 1;
    for (let rowItem of itemsToRestore) {
        await this._rowFactory.return(rowItem);
    }
}

async function returnBottomBatch() {
    const size = this._renderer.batchSize + 5;
    const fromIndex = this._renderer.currentRenderBatch.length - size;
    const itemsToRestore = this._renderer.currentRenderBatch.splice(fromIndex, this._renderer.batchSize - 5);
    for (let rowItem of itemsToRestore) {
        await this._rowFactory.return(rowItem);
    }
}