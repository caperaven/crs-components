export function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.font = getFont(dpr);
    ctx.scale(dpr, dpr);
    ctx.bounds = {x: 0, y: 0, width: width, height: height};

    return ctx;
}

export function createCanvasForTexture(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.font = '16px Open Sans';

    return ctx;
}

export function clearCanvas(ctx, color = "#ffffff") {
    if (ctx == null) return;

    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
}

export function resizeCanvas(ctx, width, height) {
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.font = '16px Open Sans';
}