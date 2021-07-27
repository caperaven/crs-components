/**
 * This class updates joint positions between to touching LineCurve3 objects
 */
export class LineCurve3Joint {
    constructor(curve, index1, index2) {
        this._curve   = curve;
        this._index1  = index1;
        this._index2  = index2;

        const vector = curve.curvePath.curves[index1].v2;
        this.point = {x: vector.x, y: vector.y, z: vector.z};
    }

    dispose() {
        delete this._curve;
        delete this._index1;
        delete this._index2;
    }

    update(x, y) {
        if (x != null) {
            this.point.x = x;
        }

        if (y != null) {
            this.point.y = y;
        }

        const c1 = this._curve.curvePath.curves[this._index1];
        const c2 = this._curve.curvePath.curves[this._index2];

        c1.v2.x = this.point.x;
        c1.v2.y = this.point.y;

        c2.v1.x = this.point.x;
        c2.v1.y = this.point.y;

        c1.updateArcLengths();
        c2.updateArcLengths();
        this._curve.update();
    }
}