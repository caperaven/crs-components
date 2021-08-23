/**
 * This class provides a way to define curved shapes where you can use instance meshes along a path.
 */
export class LineCurveHelper {
    static async new(xScale, yScale, gapSize, material, scene, name) {
        const curvePath         = await crs.createThreeObject("CurvePath");
        const Vector3           = await crs.getThreePrototype("Vector3");
        const dummy             = await crs.createThreeObject("Object3D");

        const instance  = new LineCurveHelper(curvePath, Vector3, dummy, xScale, yScale, gapSize, material, scene, name);
        return instance;
    }

    constructor(curvePath, Vector3, dummy, xScale, yScale, gapSize, material, scene, name) {
        this.curvePath = curvePath;
        this.Vector3 = Vector3;
        this.dummy = dummy;
        this.xScale = xScale;
        this.yScale = yScale;
        this.gapSize = gapSize;
        this.material = material;
        this.scene = scene;
        this.name = name;
    }

    dispose() {
        this.scene.remove(this.mesh);

        this.mesh?.dispose();
        this.mesh = null;

        delete this.curvePath;
        delete this.Vector3;
        delete this.dummy;
        delete this.xScale;
        delete this.yScale;
        delete this.gapSize;
        delete this.material;
        delete this.scene;
        delete this.name;
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

    async drawDashes(maxDashCount = 300) {
        const length            = this.curvePath.getLength();
        const size              = this.yScale + this.gapSize;
        const count             = Math.round(length / size);
        const up                = new this.Vector3( 0, 1, 0 );
        const axis              = new this.Vector3();
        this.maxDashCount       = maxDashCount;

        await this._rebuildInstanceMesh(maxDashCount);

        for (let i = 0; i <= count; i++) {
            const norm = count > 0 ? i / count : 0;
            const tangent = this.curvePath.getTangent(norm);

            axis.crossVectors(up, tangent).normalize();
            const radians = Math.acos(up.dot(tangent));
            const point = this.curvePath.getPointAt(norm);

            this.dummy.position.copy(point);
            this.dummy.scale.set(this.xScale, this.yScale, 1);
            this.dummy.quaternion.setFromAxisAngle(axis, radians);
            this.dummy.updateMatrix();

            this.mesh.setMatrixAt(i, this.dummy.matrix);
        }
    }

    async _rebuildInstanceMesh(count) {
        if (this.mesh != null) {
            this.scene.remove(this.mesh);
            this.mesh.dispose();
        }

        if (this.maxDashCount < count) {
            this.maxDashCount = count + 100;
        }

        const InstancedMesh     = await crs.getThreePrototype("InstancedMesh");
        const PlaneGeometry     = await crs.getThreePrototype("PlaneGeometry");
        const DynamicDrawUsage  = await crs.getThreeConstant("DynamicDrawUsage");

        this.mesh = new InstancedMesh(new PlaneGeometry(), this.material, this.maxDashCount);
        this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
        this.mesh.name = name;
        this.mesh.instanceMatrix.needsUpdate = true;
        this.scene.add(this.mesh);
    }

    async update() {
        this.curvePath.updateArcLengths();

        const length            = this.curvePath.getLength();

        if (length == 0) return;

        const size              = this.yScale + this.gapSize;
        const count             = Math.round(length / size);
        const up                = new this.Vector3( 0, 1, 0 );
        const axis              = new this.Vector3();

        if (count > this.maxDashCount) {
            await this._rebuildInstanceMesh(count);
        }

        for (let i = 0; i <= count; i++) {
            const norm = count > 0 ? i / count : 0;
            const tangent = this.curvePath.getTangent(norm);

            axis.crossVectors(up, tangent).normalize();
            const radians = Math.acos(up.dot(tangent));
            const point = this.curvePath.getPointAt(norm);

            this.dummy.position.copy(point);
            this.dummy.scale.set(this.xScale, this.yScale, 1);
            this.dummy.quaternion.setFromAxisAngle(axis, radians);
            this.dummy.updateMatrix();

            this.mesh.setMatrixAt(i, this.dummy.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    _createVector(point) {
        const result = new this.Vector3();
        point.z = point.z || 0;
        result.copy(point);
        return result;
    }
}