export async function initializeProviders() {
    crs.gfx = crs.gfx || {};
    crs.gfx.providers = crs.gfx.providers || {};
    await load("BoxGeometry", "./providers/geometry/box-geometry-provider.js");
    await load("LineGeometryProvider", "./providers/geometry/line-geometry-provider.js");
    await load("PlaneGeometryProvider", "./providers/geometry/plane-geometry-provider.js");
}

async function load(name, file) {
    crs.gfx.providers[name] = crs.gfx.providers[name] || (await import(file)).default;
}