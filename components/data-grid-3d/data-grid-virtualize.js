export async function enableVirtualization(parent) {
    parent.virtualizeBottomCallback = virtualizeBottomCallback;
    parent.virtualizeTopCallback = virtualizeTopCallback;
}

export async function disableVirtualization(parent) {
    parent.virtualizeBottomCallback = null;
    parent.virtualizeTopCallback = null;
}


async function virtualizeBottomCallback() {
    const top = this.rowHeight / 2;
    const leftOffset = this.rowWidth / 2;
    const start = this.bottomIndex;
    const end = this.bottomIndex + this.virtualSize;
    await this._createBackBuffer(this.bottomIndex, this.bottomIndex + this.virtualSize);
    for (let i = start; i < end; i++) {
        if (i > this._lastDataIndex) break;
        await this._renderRowById(this.data[i].id, top, leftOffset);
    }
    this.bottomIndex = end;
}

async function virtualizeTopCallback() {
    console.log("virtualize top");
}
