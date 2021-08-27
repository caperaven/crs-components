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
    let buffer = fill_utils::create_fill(&path);
    let aabb = path_utils::get_aabb(&path);
    return utils::populate_from_buffer(&buffer, &aabb);
}

#[wasm_bindgen]
pub fn stroke(data: &str, line_width: f32, options: JsValue) -> js_sys::Object {
    let path = path_utils::create_path(data);
    let buffer = path_utils::extrude_path(&path, line_width, options);
    let aabb = path_utils::get_aabb(&path);
    return utils::populate_from_buffer(&buffer, &aabb);
}

#[wasm_bindgen]
pub fn pattern(data: &str, interval: f32, tolerance: f32) -> js_sys::Array {
    let builder = path_utils::create_builder(data);
    let result: Vec<path_utils::PatternResult> = path_utils::path_pattern(builder, interval, tolerance);
    return utils::pattern_to_export(result);
}