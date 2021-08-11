export async function updateTransform(mesh, transform, data) {
    if (mesh == null || transform == null) return;

    transform = await TransformParser.parse(transform);

    if (transform.scale != null) {
        const cs = mesh.scale.clone();
        mesh.scale.set(getValue(transform.scale.x, cs.x, data), getValue(transform.scale.y, cs.y, data) || getValue(transform.scale.z, cs.z, data));
    }

    if (transform.position != null) {
        const cp = mesh.position.clone();
        mesh.position.set(getValue(transform.position.x, cp.x, data), getValue(transform.position.y, cp.y, data), getValue(transform.position.z, cp.z, data));
    }

    if (transform.rotation != null) {
        if (transform.rotation.x != null) {
            mesh.rotateX(getValue(transform.rotation.x, 0, data));
        }
        if (transform.rotation.y != null) {
            mesh.rotateY(getValue(transform.rotation.y, 0, data));
        }
        if (transform.rotation.z != null) {
            mesh.rotateZ(getValue(transform.rotation.z, 0, data));
        }
    }
}

class TransformParser {
    static async parse(transform) {
        const result = {};
        const parts = transform.split(",");

        let i = 0;
        while (i < parts.length) {
            const char = parts[i];
            switch(char) {
                case "p": {
                    result.position = {};
                    i = await this[char](parts, i, result.position);
                    break;
                }
                case "s": {
                    result.scale = {};
                    i = await this[char](parts, i, result.scale);
                    break;
                }
            }
        }

        return result;
    }

    static async p(transform, i, position) {
        return await this.createVector(transform, i, position);
    }

    static async s(transform, i, scale) {
        return await this.createVector(transform, i, scale);
    }

    static async createVector(transform, i, result) {
        result.x = Number(transform[i + 1]);
        result.y = Number(transform[i + 2]);
        result.z = Number(transform[i + 3]);
        return i + 4;
    }
}


function getValue(value, defaultValue, data) {
    if (value == null) return defaultValue;

    if (typeof value == "string" && value.indexOf("@item") != -1) {
        value = value.replace("@item.", "");
        value = crsbinding.utils.getValueOnPath(data, value);
    }

    return value;
}