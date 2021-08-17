use wasm_bindgen::prelude::*;
extern crate lyon;

use lyon::path::Path;
use lyon::path::math::{point, Point};
use lyon::tessellation::geometry_builder::{simple_builder, VertexBuffers};
use lyon::tessellation::{FillTessellator, FillOptions, StrokeTessellator, StrokeOptions};
use lyon::lyon_tessellation::{LineJoin, LineCap};

type PolyBuffer = VertexBuffers<Point, u16>;

fn create_path(points: Vec<f32>) -> Path {
    let mut builder = Path::builder();
    builder.begin(point(points[0], points[1]));

    let length = points.len();
    let mut i = 2;
    while i < length {
        builder.line_to(point(points[i], points[i + 1]));
        i += 2;
    }
    builder.end(true);

    return builder.build();
}

fn populate_from_buffer(buffers: &PolyBuffer) -> js_sys::Object {
    let result = js_sys::Object::new();
    let vertices = js_sys::Array::new();
    let indices = js_sys::Array::new();

    for point in buffers.vertices.iter() {
        vertices.push(&JsValue::from(point.x));
        vertices.push(&JsValue::from(point.y));
        vertices.push(&0.into());
    }

    for &ind in buffers.indices.iter() {
        indices.push(&JsValue::from(ind));
    }

    js_sys::Reflect::set(&result, &"vertices".into(), &vertices.into()).ok();
    js_sys::Reflect::set(&result, &"indices".into(), &indices.into()).ok();

    return result;
}

#[wasm_bindgen]
pub fn tessellate_polygon(points: Vec<f32>, fill: bool, stroke: bool, stroke_width: f32) -> js_sys::Object {
    let path = create_path(points);

    let result = js_sys::Object::new();

    if fill {
        let mut buffers: PolyBuffer = VertexBuffers::new();
        {
            let mut vertex_builder = simple_builder(&mut buffers);
            let mut tessellator = FillTessellator::new();

            tessellator.tessellate_path(
                &path,
                &FillOptions::default(),
                &mut vertex_builder
            ).ok();
        }

        let fill = populate_from_buffer(&buffers);
        js_sys::Reflect::set(&result, &"fill".into(), &fill).ok();
    }

    if stroke {
        let mut buffers: PolyBuffer = VertexBuffers::new();
        {
            let mut vertex_builder = simple_builder(&mut buffers);
            let mut tessellator = StrokeTessellator::new();

            tessellator.tessellate_path(
                &path,
                &StrokeOptions::default().with_line_width(stroke_width).with_line_join(LineJoin::Round),
                &mut vertex_builder
            ).ok();
        }

        let stroke = populate_from_buffer(&buffers);
        js_sys::Reflect::set(&result, &"stroke".into(), &stroke).ok();
    }

    return result;
}