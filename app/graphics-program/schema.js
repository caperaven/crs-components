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
        },
        {
            id: "custom",
            color: "#0090ff"
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
            id: "custom",
            type: "MeshBasicMaterial",
            args: {
                color: "custom"
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
                        transform: "s,-200,200,1"
                    }
                },
                {
                    element: "PlaneGeometry",
                    material: "red",
                    args: {
                        transform: "p,-200,-100,0,s,100,200,1"
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
                        transform: "p,-300,100,0.1,s,400,200,1"
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
                        icon: "fireExtinguisher",
                        transform: "s,10,10,1",
                        gap: 20,
                        data: "l,100,-100,0,200,-100,0,l,200,-100,0,200,-200,0,q,200,-200,0,250,-250,0,300,-200,0,l,300,-200,0,300,-100,0,l,300,-100,0,400,-100,0,c,400,-100,0,400,-400,0,100,-400,0,100,-100,0"
                    }
                },
                {
                    id: "lines-curve",
                    element: "CurveGeometry",
                    material: "custom",
                    args: {
                        icon: "arrow_top",
                        transform: "s,10,10,1",
                        gap: 20,
                        data: "l,-200,-200,0,0,200,0,l,0,200,0,200,-200,0"
                    }
                }
            ]
        }
    ],
    context: {
        type: "orthographic",
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