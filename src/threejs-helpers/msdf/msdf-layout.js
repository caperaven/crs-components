export class MsdfLayout {
    constructor(json) {
        this.lineHeight = json.common.lineHeight;
        this.baseLine = json.common.base;
        this.kernings = json.kernings;
    }

    dispose() {
        this.lineHeight = null;
        this.baseLine = null;
        this.kernings = null;
    }

    async layout(group) {
        let lastCharItem;
        let x = 0;

        for (let mesh of group.children) {
            const charItem = mesh.__charItem;
            delete mesh.__charItem;

            const kern = lastCharItem ? this.getKerning(lastCharItem.id, charItem.id) : 0;
            x += kern;

            mesh.position.x = x;

            x += charItem.xadvance;
            lastCharItem = charItem;
        }
    }

    getKerning(left, right) {
        for (let kern of this.kernings) {
            if (kern.left === left && kern.right === right) {
                return kern.amount;
            }
        }
        return 0
    }
}