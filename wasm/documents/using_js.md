# Introduction

To use javascript features in RUST wasm you need to include the js_sys dependency.  
https://crates.io/crates/js-sys  
https://docs.rs/js-sys/0.3.52/js_sys/

## Example

```rust
pub fn array_test() -> js_sys::Array {
    let array = js_sys::Array::new();
    array.push(&JsValue::from(1));
    array.push(&JsValue::from(2));
    array.push(&JsValue::from(3));
}
```
