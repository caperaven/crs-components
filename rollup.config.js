//import {terser} from "rollup-plugin-terser";
const terser = function() {};
export default[
    {
        input: "node_modules/d3-selection/src/index.js",
        output: [{ file: 'third-party/d3/d3-selection.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-array/src/index.js",
        output: [{ file: 'third-party/d3/d3-array.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-axis/src/index.js",
        output: [{ file: 'third-party/d3/d3-axis.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-brush/src/index.js",
        output: [{ file: 'third-party/d3/d3-brush.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-chord/src/index.js",
        output: [{ file: 'third-party/d3/d3-chord.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-color/src/index.js",
        output: [{ file: 'third-party/d3/d3-color.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-contour/src/index.js",
        output: [{ file: 'third-party/d3/d3-contour.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-contour/src/index.js",
        output: [{ file: 'third-party/d3/d3-contour.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-delaunay/src/index.js",
        output: [{ file: 'third-party/d3/d3-delaunay.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-dispatch/src/index.js",
        output: [{ file: 'third-party/d3/d3-dispatch.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-drag/src/index.js",
        output: [{ file: 'third-party/d3/d3-drag.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-dsv/src/index.js",
        output: [{ file: 'third-party/d3/d3-dsv.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-ease/src/index.js",
        output: [{ file: 'third-party/d3/d3-ease.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-fetch/src/index.js",
        output: [{ file: 'third-party/d3/d3-fetch.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-force/src/index.js",
        output: [{ file: 'third-party/d3/d3-force.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-format/src/index.js",
        output: [{ file: 'third-party/d3/d3-format.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-geo/src/index.js",
        output: [{ file: 'third-party/d3/d3-geo.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-hierarchy/src/index.js",
        output: [{ file: 'third-party/d3/d3-hierarchy.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-interpolate/src/index.js",
        output: [{ file: 'third-party/d3/d3-interpolate.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-path/src/index.js",
        output: [{ file: 'third-party/d3/d3-path.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-polygon/src/index.js",
        output: [{ file: 'third-party/d3/d3-polygon.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-quadtree/src/index.js",
        output: [{ file: 'third-party/d3/d3-quadtree.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-random/src/index.js",
        output: [{ file: 'third-party/d3/d3-random.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-scale/src/index.js",
        output: [{ file: 'third-party/d3/d3-scale.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-scale-chromatic/src/index.js",
        output: [{ file: 'third-party/d3/d3-scale-chromatic.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-shape/src/index.js",
        output: [{ file: 'third-party/d3/d3-shape.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-time/src/index.js",
        output: [{ file: 'third-party/d3/d3-time.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-timer/src/index.js",
        output: [{ file: 'third-party/d3/d3-timer.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-time-format/src/index.js",
        output: [{ file: 'third-party/d3/d3-time-format.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-transition/src/index.js",
        output: [{ file: 'third-party/d3/d3-transition.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/d3-zoom/src/index.js",
        output: [{ file: 'third-party/d3/d3-zoom.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/internmap/src/index.js",
        output: [{ file: 'third-party/d3/internmap.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    },
    {
        input: "node_modules/delaunator/delaunator.js",
        output: [{ file: 'third-party/d3/delaunator.js', format: 'es', sourcemap: false }],
        plugins: [terser()]
    }
]