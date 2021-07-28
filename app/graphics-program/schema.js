export const schema = {
    colors: [
        {
            id: "red",
            color: "#ff0000"
        },
        {
            id: "green",
            color: "#00ff00"
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
            id: "green",
            type: "MeshBasicMaterial",
            args: {
                color: "green"
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
                }
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
        },
        {
            id: 2,
            title: "Curves",
            elements: [
                {
                    id: "main-curve",
                    element: "CurveGeometry",
                    material: "green",
                    args: {
                        icon: "arrow_right",
                        transform: "s,10,20,1",
                        gap: 10,
                        data: "l,100,-100,0,200,-100,0,l,200,-100,0,200,-200,0,q,200,-200,0,250,-250,0,300,-200,0,l,300,-200,0,300,-100,0,l,300,-100,0,400,-100,0,c,400,-100,0,400,-400,0,100,-400,0,100,-100,0"
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
            },
            allow_drag: true
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
            },
            {
                id: "layer3",
                element: "layer",
                layer: 2
            }
        ]
    }
}

// program.setColor("primary", "#ff0000");
// program.setMaterialColor(0, "primary");
// program.setMaterialProperty(0, "color", "#ff00ff");

