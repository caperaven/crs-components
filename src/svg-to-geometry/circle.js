export default async function parse(node) {
    const x = Number(node.getAttribute('x') || 0);
    const y = Number(node.getAttribute('y') || 0);
    const r = Number(node.getAttribute('r') || 0);

    const buffer = await crs.createThreeObject("CircleGeometry", r, 64);
    buffer.translate(x, y, 0);
    return buffer;
}