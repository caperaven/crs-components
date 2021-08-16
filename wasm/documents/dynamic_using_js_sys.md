## Example

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn remove(a: u32, b: u32) -> js_sys::Array {
    let result = js_sys::Object::new();
    js_sys::Reflect::set(&result, &"value".into(), &JsValue::from(a - b)).ok();

    let arr = js_sys::Array::new();
    arr.push(&JsValue::from(result));
    return arr;
}
```