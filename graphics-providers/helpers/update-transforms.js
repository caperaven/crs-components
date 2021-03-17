export function updateTransform(mesh, transform) {
    if (mesh == null) return;

    if (transform.scale != null) {
        const cs = mesh.scale.clone();
        mesh.scale.set(transform.scale.x || cs.x, transform.scale.y || cs.y || transform.scale.z || cs.z);
    }

    if (transform.position != null) {
        const cp = mesh.position.clone();
        mesh.position.set(transform.position.x || cp.x, transform.position.y || cp.y || transform.position.z || cp.z);
    }

    if (transform.rotation != null) {
        if (transform.rotation.x != null) {
            mesh.rotateX(transform.rotation.x)
        }
        if (transform.rotation.y != null) {
            mesh.rotateX(transform.rotation.y)
        }
        if (transform.rotation.z != null) {
            mesh.rotateX(transform.rotation.z)
        }
    }
}