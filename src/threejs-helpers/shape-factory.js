export async function createNormalizedPlane(width = 1, height = 1, material = null) {
    const geometry = await crs.createThreeObject("PlaneGeometry", 1, 1);

    if (material == null) {
        material = await crs.createThreeObject("MeshBasicMaterial");
    }

    const result = await crs.createThreeObject("Mesh", geometry, material);
    result.scale.set(width, height, 1);
    return result;
}

export async function createRegularMesh(material, segments, radius) {
    const buffer = await crs.createThreeObject("CircleGeometry", radius, segments);
    return await crs.createThreeObject("Mesh", buffer, material);
}

export async function createCustomUVPlane(width, height, texture, tx1, tx2, ty1, ty2) {
    const geometry = await crs.createThreeObject("PlaneGeometry", 1, 1);
    const material = await crs.createThreeObject("MeshBasicMaterial", {map: texture});
    const mesh = await crs.createThreeObject("Mesh", geometry, material);
    mesh.scale.set(width, height, 1);

    await updatePlaneUV(mesh, tx1, tx2, ty1, ty2);
    return mesh;
}

export async function updatePlaneUV(mesh, tx1, tx2, ty1, ty2) {
    /*
     *  U = x
     *  V = y
     *
     * 0,1 --------- 1,1
     *  |             |
     *  |             |
     *  |             |
     * 0,0 --------- 1,0
     *
     * 0 = top left;
     * 1 = top right;
     * 2 = bottom left;
     * 3 = bottom right;
     */

    tx1 = Number(tx1.toFixed(2));
    tx2 = Number(tx2.toFixed(2));
    ty1 = Number(ty1.toFixed(2));
    ty2 = Number(ty2.toFixed(2));

    const uvAttribute = mesh.geometry.attributes.uv;

    uvAttribute.setXY(0, tx1, ty1);
    uvAttribute.setXY(1, tx2, ty1);
    uvAttribute.setXY(2, tx1, ty2);
    uvAttribute.setXY(3, tx2, ty2);
}