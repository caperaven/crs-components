export class LineCurveHelper {
    static async new(mesh) {
        const curvePath         = await crs.createThreeObject("CurvePath");
        const Vector3           = await crs.getThreePrototype("Vector3");

        const instance  = new LineCurveHelper(curvePath, Vector3);
        return instance;
    }

    constructor(curvePath, Vector3, CubicBezierCurve3) {
        this.curvePath = curvePath;
        this.Vector3 = Vector3;
    }

    dispose() {
        delete this.curvePath;
        delete this.Vector3;
    }

    async addLine(p1, p2) {
        const v1 = this._createVector(p1);
        const v2 = this._createVector(p2);

        const line = await crs.createThreeObject("LineCurve3", v1, v2);
        this.curvePath.add(line);
    }

    async addCubicBezier(p1, cp1, cp2, p2) {
        const p1v  = this._createVector(p1);
        const cp1v = this._createVector(cp1);
        const cp2v = this._createVector(cp2);
        const p2v  = this._createVector(p2);

        const curve = await crs.createThreeObject("CubicBezierCurve3", p1v, cp1v, cp2v, p2v);
        this.curvePath.add(curve);
    }

    async addQuadraticBezier(p1, cp1, p2) {
        const p1v  = this._createVector(p1);
        const cp1v = this._createVector(cp1);
        const p2v  = this._createVector(p2);

        const curve = await crs.createThreeObject("QuadraticBezierCurve3", p1v, cp1v, p2v);
        this.curvePath.add(curve);
    }

    async getPoints(count) {
        return this.curvePath.curves.reduce((p, d)=> [...p, ...d.getPoints(count)], []);
    }

    async getGeometry(pointCount) {
        const geom = await crs.createThreeObject("BufferGeometry");
        const points = await this.getPoints(pointCount);
        return geom.setFromPoints(points);
    }

    async getLineMesh(material, pointCount = 20) {
        const geometry = await this.getGeometry(pointCount);
        const line = await crs.createThreeObject("Line", geometry, material);
        return line;
    }

    async drawDashes(xScale, yScale, gapSize, material, scene) {
        const PlaneGeometry = await crs.getThreePrototype("PlaneGeometry");
        const Mesh          = await crs.getThreePrototype("Mesh");
        const length        = this.curvePath.getLength();
        const size          = xScale + gapSize;
        const count         = Math.round(length / size);
        const up            = new this.Vector3( 0, 1, 0 );
        const axis          = new this.Vector3();

        for (let i = 0; i <= count; i++) {
            const norm = i / count;
            const tangent = this.curvePath.getTangent(norm);
            axis.crossVectors(up, tangent).normalize();
            const radians = Math.acos(up.dot(tangent));
            const point = this.curvePath.getPointAt(norm);
            const plane = new PlaneGeometry();
            const mesh = new Mesh(plane, material);
            mesh.position.copy(point);
            mesh.scale.set(xScale, yScale, 1);
            mesh.quaternion.setFromAxisAngle(axis, radians);
            scene.add(mesh);
        }
    }

    async drawLine(material, scene) {
        const mesh = await this.getLineMesh(material);
        scene.add(mesh);
    }

    _createVector(point) {
        const result = new this.Vector3();
        point.z = point.z || 0;
        result.copy(point);
        return result;
    }
}