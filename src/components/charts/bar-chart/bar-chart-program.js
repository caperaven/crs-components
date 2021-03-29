export const schema = {
    locations: {
        "src": "/src"
    },
    requires: [
        "@locations.src/components/orthographic-canvas/orthographic-canvas.js"
    ],
    context: {
        type: "orthographic",
        attributes: {
            background: "#dadada"
        }
    },
    materials: [
        {
            id: 0,
            type: "MeshBasicMaterial",
            args: {
                color: "#ff0090"
            }
        }
    ],
    templates: [
        {
            id: 0,
            element: "PlaneGeometry",
            material: 0,
            args: {
                transform: {
                    scale: {x: "@item.barWidth", y: "@item.barHeight"},
                    position: {x: "@item.x", y: "@item.y", z:0}
                }
            }
        }
    ]
}