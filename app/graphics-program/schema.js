export const schema = {
    colors: [
        {
            id: "red",
            color: "#ff0000"
        },
        {
            id: "blue",
            color: "#0000ff"
        }
    ],
    materials: [
        {
            id: "red",
            type: "MeshBasicMaterial",
            args: {
                color: "red"
            }
        },
        {
            id: "blue",
            type: "MeshBasicMaterial",
            args: {
                color: "blue"
            }
        }
    ],
    layers: [
        {
            id: 0,
            title: "Red Layer",
            elements: [
                {
                    element: "PlaneGeometry",
                    material: "red",
                    args: {
                        transform: {
                            scale: {x: 200, y: 200},
                        }
                    }
                },
                {
                    element: "PlaneGeometry",
                    material: "red",
                    args: {
                        transform: {
                            position: {x: -100, y: -100, z: 0},
                            scale: {x: 100, y: 100},
                        }
                    }
                },

            ]
        },
        {
            id: 1,
            title: "Blue Layer",
            elements: [
                {
                    id: "blue-rect",
                    element: "PlaneGeometry",
                    material: "blue",
                    args: {
                        transform: {
                            position: {x: 100, y: 100, z: 0},
                            scale: {x: 200, y: 200},
                        }
                    }
                }
            ]
        }
    ],
    context: {
        type: "orthographic",
        args: {
            background: "#e8e8e8"
        }
    },
    scene: {
        elements: [
            {
                id: "layer0",
                element: "layer",
                layer: 0
            }
        ]
    }
}

// program.setColor("primary", "#ff0000");
// program.setMaterialColor(0, "primary");
// program.setMaterialProperty(0, "color", "#ff00ff");

