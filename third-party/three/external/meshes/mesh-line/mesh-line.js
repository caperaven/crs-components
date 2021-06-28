import {BufferGeometry} from "../../../src/core/BufferGeometry.js"
import {Vector3} from "../../../src/math/Vector3.js";

export class MeshLine extends BufferGeometry {
    get geometry() {
        return this;
    }

    get geom() {
        return this._geom;
    }

    set geom(newValue) {
        this.setGeometry(newValue, this.widthCallback);
    }

    get points() {
        return this._points;
    }

    set points(newValue) {
        this.setPoints(newValue, this.widthCallback);
    }

    static async new(material) {
        const result          = new MeshLine();
        result.type           = 'MeshLine'
        result.positions      = [];
        result.previous       = [];
        result.next           = [];
        result.side           = [];
        result.width          = [];
        result.indices_array  = [];
        result.uvs            = [];
        result.counters       = [];
        result._points        = [];
        result._geom          = null;
        result.widthCallback  = null;
        result.isMeshLine     = true
        result.material       = material;

        // Used to raycast
        result.matrixWorld = await crs.createThreeObject("Matrix4");
        return result;
    }

    setMatrixWorld = function (matrixWorld) {
        this.matrixWorld = matrixWorld
    }

    async setGeometry (g, c) {
        this._geometry = g;

        if (g instanceof BufferGeometry) {
            await this.setPoints(g.getAttribute("position").array, c);
        }
        else {
            await this.setPoints(g, c);
        }
    }

    async setPoints(points, widthCallback) {
        if (!(points instanceof Float32Array) && !(points instanceof Array)) {
            console.error(
                "ERROR: The BufferArray of points is not instancied correctly."
            );
            return;
        }

        // as the points are mutated we store them
        // for later retreival when necessary (declaritive architectures)
        this._points        = points;
        this.widthCallback  = widthCallback;
        this.positions      = [];
        this.counters       = [];

        if (points.length && points[0] instanceof Vector3) {
            // could transform Vector3 array into the array used below
            // but this approach will only loop through the array once
            // and is more performant
            for (let j = 0; j < points.length; j++) {
                let p = points[j];
                let c = j / points.length;

                this.positions.push(p.x, p.y, p.z);
                this.positions.push(p.x, p.y, p.z);
                this.counters.push(c);
                this.counters.push(c);
            }
        }
        else {
            for (let j = 0; j < points.length; j += 3) {
                let c = j / points.length;
                this.positions.push(points[j], points[j + 1], points[j + 2]);
                this.positions.push(points[j], points[j + 1], points[j + 2]);
                this.counters.push(c);
                this.counters.push(c);
            }
        }
        await this.process();
    }

    async raycast(raycaster, intersects) {
        const LineSegments  = await crs.getThreePrototype("LineSegments");
        const inverseMatrix = await crs.createThreeObject("Matrix4");
        const ray           = await crs.createThreeObject("Ray");
        const sphere        = await crs.createThreeObject("Sphere");
        const interRay      = await crs.createThreeObject("Vector3");
        const geometry      = this.geometry
        // Checking boundingSphere distance to ray

        sphere.copy(geometry.boundingSphere);
        sphere.applyMatrix4(this.matrixWorld);

        if (raycaster.ray.intersectSphere(sphere, interRay) === false) {
            return
        }

        inverseMatrix.getInverse(this.matrixWorld);
        ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

        const vStart        = new Vector3();
        const vEnd          = new Vector3();
        const interSegment  = new Vector3();
        const step          = this instanceof LineSegments ? 2 : 1;
        const index         = geometry.index;
        const attributes    = geometry.attributes;

        if (index !== null) {
            const indices   = index.array
            const positions = attributes.position.array
            const widths    = attributes.width.array

            for (let i = 0, l = indices.length - 1; i < l; i += step) {
                const a = indices[i]
                const b = indices[i + 1]

                vStart.fromArray(positions, a * 3)
                vEnd.fromArray(positions, b * 3)
                const width       = widths[Math.floor(i / 3)] != undefined ? widths[Math.floor(i / 3)] : 1
                const precision   = raycaster.params.Line.threshold + (this.material.lineWidth * width) / 2
                const precisionSq = precision * precision

                const distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);

                if (distSq > precisionSq) continue

                interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

                const distance = raycaster.ray.origin.distanceTo(interRay);

                if (distance < raycaster.near || distance > raycaster.far) continue;

                intersects.push({
                    distance    : distance,
                    point       : interSegment.clone().applyMatrix4(this.matrixWorld),
                    index       : i,
                    face        : null,
                    faceIndex   : null,
                    object      : this,
                })
                // make event only fire once
                i = l;
            }
        }
    }

    compareV3 (a, b) {
        const aa = a * 6;
        const ab = b * 6;
        return (
            this.positions[aa]      === this.positions[ab] &&
            this.positions[aa + 1]  === this.positions[ab + 1] &&
            this.positions[aa + 2]  === this.positions[ab + 2]
        )
    }

    copyV3(a) {
        const aa = a * 6;
        return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
    }

    async process() {
        const BufferAttribute = await crs.getThreePrototype("BufferAttribute");
        const l = this.positions.length / 6;

        this.previous = [];
        this.next = [];
        this.side = [];
        this.width = [];
        this.indices_array = [];
        this.uvs = [];

        let w, v;

        // initial previous points
        if (this.compareV3(0, l - 1)) {
            v = this.copyV3(l - 2);
        } else {
            v = this.copyV3(0);
        }
        this.previous.push(v[0], v[1], v[2]);
        this.previous.push(v[0], v[1], v[2]);

        for (let j = 0; j < l; j++) {
            // sides
            this.side.push(1, -1);

            // widths
            if (this.widthCallback != null) {
                w = this.widthCallback(j / (l - 1));
            }
            else {
                w = 1
            }

            this.width.push(w, w);

            // uvs
            this.uvs.push(j / (l - 1), 0, j / (l - 1), 1);

            if (j < l - 1) {
                // points previous to poisitions
                v = this.copyV3(j)
                this.previous.push(v[0], v[1], v[2])
                this.previous.push(v[0], v[1], v[2])

                // indices
                const n = j * 2
                this.indices_array.push(n, n + 1, n + 2)
                this.indices_array.push(n + 2, n + 1, n + 3)
            }
            if (j > 0) {
                // points after poisitions
                v = this.copyV3(j)
                this.next.push(v[0], v[1], v[2])
                this.next.push(v[0], v[1], v[2])
            }
        }

        // last next point
        if (this.compareV3(l - 1, 0)) {
            v = this.copyV3(1);
        }
        else {
            v = this.copyV3(l - 1);
        }

        this.next.push(v[0], v[1], v[2])
        this.next.push(v[0], v[1], v[2])

        // redefining the attribute seems to prevent range errors
        // if the user sets a differing number of vertices
        if (!this._attributes || this._attributes.position.count !== this.positions.length) {
            this._attributes = {
                position:   new BufferAttribute(new Float32Array(this.positions), 3),
                previous:   new BufferAttribute(new Float32Array(this.previous), 3),
                next:       new BufferAttribute(new Float32Array(this.next), 3),
                side:       new BufferAttribute(new Float32Array(this.side), 1),
                width:      new BufferAttribute(new Float32Array(this.width), 1),
                uv:         new BufferAttribute(new Float32Array(this.uvs), 2),
                index:      new BufferAttribute(new Uint16Array(this.indices_array), 1),
                counters:   new BufferAttribute(new Float32Array(this.counters), 1),
            }
        } else {
            this._attributes.position.copyArray(new Float32Array(this.positions));
            this._attributes.position.needsUpdate = true;
            this._attributes.previous.copyArray(new Float32Array(this.previous));
            this._attributes.previous.needsUpdate = true;
            this._attributes.next.copyArray(new Float32Array(this.next));
            this._attributes.next.needsUpdate = true;
            this._attributes.side.copyArray(new Float32Array(this.side));
            this._attributes.side.needsUpdate = true;
            this._attributes.width.copyArray(new Float32Array(this.width));
            this._attributes.width.needsUpdate = true;
            this._attributes.uv.copyArray(new Float32Array(this.uvs));
            this._attributes.uv.needsUpdate = true;
            this._attributes.index.copyArray(new Uint16Array(this.indices_array));
            this._attributes.index.needsUpdate = true;
        }

        this.setAttribute('position',   this._attributes.position);
        this.setAttribute('previous',   this._attributes.previous);
        this.setAttribute('next',       this._attributes.next);
        this.setAttribute('side',       this._attributes.side);
        this.setAttribute('width',      this._attributes.width);
        this.setAttribute('uv',         this._attributes.uv);
        this.setAttribute('counters',   this._attributes.counters);

        this.setIndex(this._attributes.index);

        this.computeBoundingSphere();
        this.computeBoundingBox();
    }

    memcpy(src, srcOffset, dst, dstOffset, length) {
        let i;

        src = src.subarray || src.slice ? src : src.buffer;
        dst = dst.subarray || dst.slice ? dst : dst.buffer;

        src = srcOffset
            ? src.subarray
                ? src.subarray(srcOffset, length && srcOffset + length)
                : src.slice(srcOffset, length && srcOffset + length)
            : src;

        if (dst.set) {
            dst.set(src, dstOffset);
        } else {
            for (i = 0; i < src.length; i++) {
                dst[i + dstOffset] = src[i];
            }
        }

        return dst;
    }

    advance(position) {
        const positions = this._attributes.position.array;
        const previous = this._attributes.previous.array;
        const next = this._attributes.next.array;
        const l = positions.length;

        // PREVIOUS
        this.memcpy(positions, 0, previous, 0, l)

        // POSITIONS
        this.memcpy(positions, 6, positions, 0, l - 6)

        positions[l - 6] = position.x;
        positions[l - 5] = position.y;
        positions[l - 4] = position.z;
        positions[l - 3] = position.x;
        positions[l - 2] = position.y;
        positions[l - 1] = position.z;

        // NEXT
        this.memcpy(positions, 6, next, 0, l - 6);

        next[l - 6] = position.x;
        next[l - 5] = position.y;
        next[l - 4] = position.z;
        next[l - 3] = position.x;
        next[l - 2] = position.y;
        next[l - 1] = position.z;

        this._attributes.position.needsUpdate   = true;
        this._attributes.previous.needsUpdate   = true;
        this._attributes.next.needsUpdate       = true;
    }
}