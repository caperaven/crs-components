use crate::PolyBuffer;
use wasm_bindgen::prelude::JsValue;
use js_sys::{Object, Array};
use lyon::math::Rect;

pub fn populate_from_buffer(buffers: &PolyBuffer, aabb: &Rect) -> Object {
    let result = Object::new();
    let vertices = Array::new();
    let indices = Array::new();

    for point in buffers.vertices.iter() {
        vertices.push(&JsValue::from(point.x.floor()));
        vertices.push(&JsValue::from(point.y.floor()));
        vertices.push(&0.into());
    }

    for &ind in buffers.indices.iter() {
        let value = &JsValue::from(ind);
        indices.push(value);
    }

    let aa_result = Object::new();
    js_sys::Reflect::set(&aa_result, &"originX".into(), &aabb.origin.x.into()).ok();
    js_sys::Reflect::set(&aa_result, &"originY".into(), &aabb.origin.y.into()).ok();
    js_sys::Reflect::set(&aa_result, &"width".into(), &aabb.size.width.into()).ok();
    js_sys::Reflect::set(&aa_result, &"height".into(), &aabb.size.height.into()).ok();

    js_sys::Reflect::set(&result, &"vertices".into(), &vertices.into()).ok();
    js_sys::Reflect::set(&result, &"indices".into(), &indices.into()).ok();
    js_sys::Reflect::set(&result, &"aabb".into(), &aa_result.into()).ok();

    return result;
}