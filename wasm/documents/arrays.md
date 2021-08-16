# Working with arrays

## Vec
https://doc.rust-lang.org/std/vec/struct.Vec.html  
Vec allows you to create a variable length array.

```rust
#[wasm_bindgen]
pub fn array_test2() -> Vec<i32> {
    let mut result = Vec::new();
    result.push(1);
    result.push(2);
    result.push(3);
    return result;
}
```

Note that you still need to define the type.  
Using this approach does not require the use of js_sys.

If you run into a scenario where you do need to use js_sys see the following example.

## js_sys::Array

```rust 
#[wasm_bindgen]
pub fn array_test() -> js_sys::Array {
    let array = js_sys::Array::new();
    array.push(&JsValue::from(1));
    array.push(&JsValue::from(2));
    array.push(&JsValue::from(3));
    return array;
}
```

## Parameters

Arrays can also be used in as parameters.

```rust 
#[wasm_bindgen]
pub fn print_array(array: js_sys::Array) -> js_sys::Array {
    return array;
}
```

```js
print_array([1,2,3,4,5]);
```

```
#[wasm_bindgen]
pub fn print_vec(array: Vec<i32>) -> Vec<i32> {
    return array;
}
```

```js
print_vec([6,7,8,9,10]);
```

## Looping through Vec

```rust
#[wasm_bindgen]
pub fn print_vec(array: Vec<i32>) -> Vec<i32> {
    for item in array.iter() {
        let value = item + 1;
        web_sys::console::log_1(&value.to_string().into());
    }

    return array;
}
```

1. use .iter to get the iterator for the vec.
2. note that in this cas we want to log the value out, so we convert it to string. 