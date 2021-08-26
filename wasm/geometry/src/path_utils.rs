extern crate lyon;

use crate::PolyBuffer;
use lyon::path::Path;
use lyon::path::math::{point};
use lyon::tessellation::geometry_builder::{simple_builder, VertexBuffers};
use lyon::tessellation::{StrokeTessellator, StrokeOptions, LineCap};
use lyon::lyon_tessellation::LineJoin;
use wasm_bindgen::JsValue;

macro_rules! to_point {
    ($list:expr, $index:expr) => ({
        let x = $list[$index + 1].parse().unwrap();
        let y = $list[$index + 2].parse().unwrap();
        point(x, y)
    });
}

pub fn create_path(data: &str) -> Path {
    let value = String::from(data.replace(" ", ""));
    let parts: Vec<&str> = value.split(",").collect();
    let length = parts.len();

    let mut builder = Path::builder();

    let mut close = false;
    let mut i = 0;
    while i < length {
        let char = parts[i];
        match char {
            "m" => {
                builder.begin(to_point!(parts, i));
                i += 4;
            }
            "l" => {
                builder.line_to(to_point!(parts, i));
                i += 4;
            },
            "q" => {
                builder.quadratic_bezier_to(to_point!(parts, i), to_point!(parts, i + 3));
                i += 7;
            },
            "z" => {
                close = true;
                break;
            }
            _ => break
        }
    }

    builder.end(close);
    return builder.build();
}

/*
    lj: line_join, m,r,b, Miter, Round, Bevel
    sc: start_cap b,s,r Butt, Square, Round
    ec: end_cap
 */
pub fn extrude_path(path: Path, line_width: f32, options: JsValue) -> PolyBuffer {
    let mut buffer: PolyBuffer = VertexBuffers::new();
    {
        let mut vertex_builder = simple_builder(&mut buffer);
        let mut tessellator = StrokeTessellator::new();

        let options = create_stroke_options(line_width, options);

        tessellator.tessellate_path (
            &path,
            &options,
            &mut vertex_builder
        ).ok();
    }
    return buffer;
}

fn create_stroke_options(line_width: f32, options: JsValue) -> StrokeOptions {
    let mut result = StrokeOptions::default().with_line_width(line_width);

    if options == JsValue::undefined() {
        return result;
    }

    let str: String = options.as_string().unwrap();

    let parts: Vec<&str> = str.split(",").collect();
    for i in 0..parts.len() {
        let part_parts: Vec<&str> = parts[i].split(":").collect();

        match part_parts[0] {
            "lj" => result.line_join = get_line_join(part_parts[1]),
            "sc" => result.start_cap = get_cap(part_parts[1]),
            "ec" => result.end_cap = get_cap(part_parts[1]),
            _ => {}
        }
    }

    result
}

fn get_line_join(value: &str) -> LineJoin {
    return match value {
        "round" => LineJoin::Round,
        "miter" => LineJoin::Miter,
        "bevel" => LineJoin::Bevel,
        _ => LineJoin::Miter
    }
}

fn get_cap(value: &str) -> LineCap {
    return match value {
        "butt" => LineCap::Butt,
        "square" => LineCap::Square,
        "round" => LineCap::Round,
        _ => LineCap::Butt
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn simple_line() {
        let path = create_path("m,-100,-100,l,100,-100,l,100,100,l,-100,100,z");
        let buffer = extrude_path(path, 10.0, JsValue::undefined());

        assert_eq!(buffer.vertices.len(), 8);
        assert_eq!(buffer.indices.len(), 24);
    }

    #[test]
    fn normal() {
        let path = create_path("m,-199,431,l,184,241,l,-137,205,l,-199,43,z");
        let buffer = extrude_path(path, 10.0, JsValue::undefined());

        println!("{:?}", buffer.vertices);
        println!("{:?}", buffer.indices);

        assert_eq!(buffer.vertices.len(), 10);
        assert_eq!(buffer.indices.len(), 30);
    }

    #[test]
    fn stroke_options() {
        let options = create_stroke_options(10.0, "lj:round,sc:round,ec:round".into());
        assert_eq!(options.line_width, 10.0);
        assert_eq!(options.line_join, LineJoin::Round);
        assert_eq!(options.start_cap, LineCap::Round);
        assert_eq!(options.end_cap, LineCap::Round);

        let options = create_stroke_options(20.0, "lj:bevel,sc:butt,ec:square".into());
        assert_eq!(options.line_width, 20.0);
        assert_eq!(options.line_join, LineJoin::Bevel);
        assert_eq!(options.start_cap, LineCap::Butt);
        assert_eq!(options.end_cap, LineCap::Square);
    }
}