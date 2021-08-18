use crate::PolyBuffer;
use wasm_bindgen::prelude::JsValue;
use js_sys::{Object, Array};

pub fn populate_from_buffer(buffers: &PolyBuffer) -> Object {
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

    js_sys::Reflect::set(&result, &"vertices".into(), &vertices.into()).ok();
    js_sys::Reflect::set(&result, &"indices".into(), &indices.into()).ok();

    return result;
}