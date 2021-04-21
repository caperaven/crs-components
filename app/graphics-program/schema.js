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
    textures: [
        {
            id: "font",
            texture: "/fonts/open-sans/OpenSans-Regular.png"
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
            type: "RawShaderMaterial",
            args: {
                transparent: true,
                fragmentShader: "/shaders/msdf.frag",
                uniforms: {
                    map: {type: "t", value: "font"},
                    fill: {value: "#ff0090"},
                    stroke: {value: "#000000"},
                    strokeWidth: {value: 2},
                    distanceFactor: {value:3}
                }
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
                            scale: {x: 2, y: 2},
                        }
                    }
                },
                {
                    element: "PlaneGeometry",
                    material: "red",
                    args: {
                        transform: {
                            position: {x: -1, y: -1, z: 0},
                            scale: {x: 1, y: 2},
                        }
                    }
                },

            ]
        },
        {
            id: 1,
            title: "MSDF",
            elements: [
                {
                    id: "blue-rect",
                    element: "PlaneGeometry",
                    material: "blue",
                    args: {
                        transform: {
                            position: {x: 1, y: 1, z: 1},
                            scale: {x: 2, y: 1},
                        }
                    }
                }
            ]
        }
    ],
    context: {
        type: "perspective",
        args: {
            background: "#e8e8e8",
            position: {
                z: 5
            }
        }
    },
    scene: {
        elements: [
            {
                id: "layer0",
                element: "layer",
                layer: 0
            },
            {
                id: "layer1",
                element: "layer",
                layer: 1
            }
        ]
    }
}

// program.setColor("primary", "#ff0000");
// program.setMaterialColor(0, "primary");
// program.setMaterialProperty(0, "color", "#ff00ff");

