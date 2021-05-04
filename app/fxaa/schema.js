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

    geometry: [
        {
            id: 0,
            vertices: [],
            normals: []
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
                            rotation: {z: 45}
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
                            rotation: {z: 75}
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
                            position: {x: 1, y: 1, z: 0.1},
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
            allowPostProcess: true,
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
