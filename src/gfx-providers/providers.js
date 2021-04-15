export async function initializeProviders() {
    crs.gfx = crs.gfx || {};
    crs.gfx.providers = crs.gfx.providers || {};
    await load(crs.gfx.providers,"BoxGeometry", "./providers/geometry/box-geometry-provider.js");
    await load(crs.gfx.providers,"LineGeometry", "./providers/geometry/line-geometry-provider.js");
    await load(crs.gfx.providers,"PlaneGeometry", "./providers/geometry/plane-geometry-provider.js");
}

async function load(target, name, file) {
    target[name] = target[name] || (await import(file)).default;
}