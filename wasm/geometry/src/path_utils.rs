extern crate lyon;

use crate::PolyBuffer;
use wasm_bindgen::JsValue;

use lyon::tessellation::geometry_builder::{simple_builder, VertexBuffers};
use lyon::tessellation::{StrokeTessellator, StrokeOptions, LineCap};
use lyon::lyon_tessellation::LineJoin;

use lyon::path::{Path};
use lyon::path::math::{point, Point};

use lyon::algorithms::walk::{RegularPattern, walk_along_path};
use lyon::algorithms::math::Vector;
use lyon::algorithms::path::path::Builder;
use lyon::algorithms::path::iterator::PathIterator;
use lyon::math::Rect;

macro_rules! to_point {
    ($list:expr, $index:expr) => ({
        let x = $list[$index + 1].parse().unwrap();
        let y = $list[$index + 2].parse().unwrap();
        point(x, y)
    });
}

pub fn create_builder(data: &str) -> Builder {
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
    return builder;
}

pub fn create_path(data: &str) -> Path {
    let builder = create_builder(data);
    return builder.build();
}

/*
    lj: line_join, m,r,b, Miter, Round, Bevel
    sc: start_cap b,s,r Butt, Square, Round
    ec: end_cap
 */
pub fn extrude_path(path: &Path, line_width: f32, options: JsValue) -> PolyBuffer {
    let mut buffer: PolyBuffer = VertexBuffers::new();
    {
        let mut vertex_builder = simple_builder(&mut buffer);
        let mut tessellator = StrokeTessellator::new();

        let options = create_stroke_options(line_width, options);

        tessellator.tessellate_path (
            path,
            &options,
            &mut vertex_builder
        ).ok();
    }
    return buffer;
}

pub fn get_aabb(path: &Path) -> Rect {
    return lyon::algorithms::aabb::bounding_rect(path.iter());
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

pub struct PatternResult {
    pub position: Point,
    pub tangent: Vector,
    pub distance: f32
}

pub fn path_pattern(builder: Builder, interval: f32, tolerance: f32) -> Vec<PatternResult> {
    // https://docs.rs/lyon_algorithms/0.17.4/lyon_algorithms/walk/index.html
    let mut result: Vec<PatternResult> = Vec::new();

    let mut pattern = RegularPattern {
        callback: &mut |position: Point, tangent: Vector, distance: f32| {
            result.push(PatternResult{position, tangent, distance});
            true
        },
        interval
    };

    let path = builder.build();
    let start_offset = 0.0;
    walk_along_path(path.iter().flattened(tolerance), start_offset, &mut pattern);

    return result;
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn simple_line() {
        let builder = create_builder("m,-100,-100,0,l,100,-100,0,l,100,100,0,l,-100,100,0,z");
        let result: Vec<PatternResult> = path_pattern(builder, 3.0, 0.01);
        assert_eq!(result.len(), 267);
    }

    #[test]
    fn curve_line() {
        let builder = create_builder("m,0,0,0,q,100,100,0,200,0,0");
        let result: Vec<PatternResult> = path_pattern(builder, 3.0, 0.01);
        assert_eq!(result.len(), 77);
    }

    #[test]
    fn length() {
        let path: Path = create_path("m,-100,-100,0,l,100,-100,0,l,100,100,0,l,-100,100,0,z");
        let aabb = get_aabb(&path);
        assert_eq!(aabb.size.width, 200.0);
        assert_eq!(aabb.size.height, 200.0);
    }
}