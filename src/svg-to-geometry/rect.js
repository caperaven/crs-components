export default async function parse(node) {
    const x = Number(node.getAttribute('x') || 0);
    const y = Number(node.getAttribute('y') || 0);
    const rx = Number(node.getAttribute('rx') || 0);
    const ry = Number(node.getAttribute('ry') || 0);
    const w = Number(node.getAttribute('width'));
    const h = Number(node.getAttribute('height'));

    const path = await crs.modules.getInstanceOf("Shape");
    return rx === 0 ? rect(x, y, w, h, path) : roundRect(x, y, rx, ry, w, h, path);
}

async function rect(x, y, w, h, path) {
    path.moveTo(x, y);
    path.lineTo(x + w, y);
    path.lineTo(x + w, y + h);
    path.lineTo(x, y + h);
    path.lineTo(x, y);
    return path;
}

async function roundRect(x, y, rx, ry, w, h, path) {
    const x1 = x;
    const x2 = x + rx;
    const x3 = x + w -rx;
    const x4 = x3 + rx;
    const y1 = y;
    const y2 = y + ry;
    const y3 = y + h - ry;
    const y4 = y3 + ry;

    path.moveTo(x2, y1);
    path.lineTo(x3, y1);
    path.bezierCurveTo(x4, y1, x4, y1, x4, y2);
    path.lineTo(x4, y3);
    path.bezierCurveTo(x4, y4, x4, y4, x3, y4);
    path.lineTo(x2, y4);
    path.bezierCurveTo(x1, y4,x1, y4, x1, y3);
    path.lineTo(x1, y2);
    path.bezierCurveTo(x1, y1, x1, y1, x2, y1);

    return path;
}