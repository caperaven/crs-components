use wasm_bindgen::prelude::*;
extern crate lyon;

use lyon::path::Path;
use lyon::path::math::{point, Point};
use lyon::tessellation::geometry_builder::{simple_builder, VertexBuffers};
use lyon::tessellation::{FillTessellator, FillOptions};

fn create_path(points: Vec<f32>) -> Path {
    let mut builder = Path::builder();
    builder.begin(point(points[0], points[1]));

    let length = points.len();
    let mut i = 2;
    while i < length {
        builder.line_to(point(points[i], points[i + 1]));
        i += 2;
    }
    builder.close();
    return builder.build();
}

fn create_buffers(path: Path) -> VertexBuffers<Point, u16> {
    let mut buffers: VertexBuffers<Point, u16> = VertexBuffers::new();
    {
        let mut vertex_builder = simple_builder(&mut buffers);
        let mut tessellator = FillTessellator::new();

        let result = tessellator.tessellate_path(
            &path,
            &FillOptions::default(),
            &mut vertex_builder
        );

        assert!(result.is_ok());
    }

    return buffers;
}

#[wasm_bindgen]
pub fn tessellate_polygon(points: Vec<f32>) -> js_sys::Object {
    let path = create_path(points);
    let buffers = create_buffers(path);

    let vertices = js_sys::Array::new();
    let indices = js_sys::Array::new();

    for point in buffers.vertices.iter() {
        //addToArray!(vertices => point.x, point.y);

        vertices.push(&JsValue::from(point.x));
        vertices.push(&JsValue::from(point.y));
    }

    for &ind in buffers.indices.iter() {
        // addToArray!(indicies => ind);
        indices.push(&JsValue::from(ind));
    }

    // return create_object!(
    //     vertices => &vertices.into(),
    //     indicies => &indicies.into()
    // );

    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &"vertices".into(), &vertices.into()).ok();
    js_sys::Reflect::set(&result, &"indices".into(), &indices.into()).ok();

    return result;
}

// 127k