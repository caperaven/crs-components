export const schema = {
    textures: [
        {
            id: "font",
            texture: "/fonts/open-sans/OpenSans-Regular.png"
        }
    ],
    materials: [
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
                    distanceFactor: {value: 3}
                }
            }
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
                        scale: {x: 2, y: 1}
                    }
                }
            }
        ]
    }
}

// colors: [
//     {
//         id: "text",
//         color: "#ff0090"
//     }
// ],
//     fonts: [
//     {
//         id: "Open-Sans",
//         font: "/fonts/open-sans/OpenSans-Regular.json",
//         fragment: "/shaders/msdf.frag"
//     }
// ],
//     context: {
//     type: "orthographic",
//         args: {
//         background: "#e8e8e8"
//     }
// },
// scene: {
//     elements: [
//         {
//             element: "Text",
//             font: "Open-Sans",
//             text: "Hello World",
//             color: "text",
//             size: 42
//         }
//     ]
// }

