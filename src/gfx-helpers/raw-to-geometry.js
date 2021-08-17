/**
 * Take the raw data and create a geometry from it.
 * If a material is given it will return a mesh else geometry
 * @param def
 * @param material
 * @returns {Promise<*>}
 */
export async function rawToGeometry (def, material) {
    const Float32BufferAttribute = await crs.threeModules.getPrototype("BufferAttribute", "Float32BufferAttribute");

    const geometry = await crs.createThreeObject("BufferGeometry");
    const positions = def.vertices.slice(0);
    const indices = def.indices.slice(0);
    const normals = def.normals?.slice(0);

    geometry.setIndex(indices);
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));

    if (normals != null) {
        geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    }
    else {
        geometry.computeVertexNormals();
    }

    if (material != null) {
        return crs.createThreeObject("Mesh", geometry, material);
    }

    return geometry;
}