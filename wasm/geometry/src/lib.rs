extern crate lyon;

mod path_utils;
mod fill_utils;
mod utils;

use wasm_bindgen::prelude::*;
use lyon::path::math::{Point};
use lyon::tessellation::geometry_builder::{VertexBuffers};

type PolyBuffer = VertexBuffers<Point, u16>;

#[wasm_bindgen]
pub fn fill(data: &str) -> js_sys::Object {
    let path = path_utils::create_path(data);
    let buffer = fill_utils::create_fill(path);
    return utils::populate_from_buffer(&buffer);
}

#[wasm_bindgen]
pub fn stroke(data: &str, line_width: f32, options: JsValue) -> js_sys::Object {
    let path = path_utils::create_path(data);
    let buffer = path_utils::extrude_path(path, line_width, options);
    return utils::populate_from_buffer(&buffer);
}