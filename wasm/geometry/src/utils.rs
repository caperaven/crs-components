use crate::PolyBuffer;
use wasm_bindgen::prelude::JsValue;
use js_sys::{Object, Array};
use lyon::math::Rect;
use crate::path_utils::PatternResult;

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

pub fn pattern_to_export(pattern: Vec<PatternResult>) -> Array {
    let result = Array::new();

    let iter = pattern.iter();

    for item in iter {
        let obj = Object::new();
        js_sys::Reflect::set(&obj, &"px".into(), &item.position.x.into()).ok();
        js_sys::Reflect::set(&obj, &"py".into(), &item.position.y.into()).ok();
        js_sys::Reflect::set(&obj, &"tx".into(), &item.tangent.x.into()).ok();
        js_sys::Reflect::set(&obj, &"ty".into(), &item.tangent.y.into()).ok();
        js_sys::Reflect::set(&obj, &"distance".into(), &item.distance.into()).ok();
        result.push(&obj);
    }

    return result;
}