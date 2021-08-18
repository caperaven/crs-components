extern crate lyon;

use crate::PolyBuffer;
use lyon::path::Path;
use lyon::path::math::{point};
use lyon::tessellation::geometry_builder::{simple_builder, VertexBuffers};
use lyon::tessellation::{StrokeTessellator, StrokeOptions};

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
                i += 3;
            }
            "l" => {
                builder.line_to(to_point!(parts, i));
                i += 3;
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

pub fn extrude_path(path: Path, stroke_width: f32) -> PolyBuffer {
    let mut buffer: PolyBuffer = VertexBuffers::new();
    {
        let mut vertex_builder = simple_builder(&mut buffer);
        let mut tessellator = StrokeTessellator::new();

        tessellator.tessellate_path (
            &path,
            &StrokeOptions::default().with_line_width(stroke_width),
            &mut vertex_builder
        ).ok();
    }
    return buffer;
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn simple_line() {
        let path = create_path("m,-100,-100,l,100,-100,l,100,100,l,-100,100,z");
        let buffer = extrude_path(path, 10.0);

        assert_eq!(buffer.vertices.len(), 8);
        assert_eq!(buffer.indices.len(), 24);
    }

    #[test]
    fn normal() {
        let path = create_path("m,-199,431,l,184,241,l,-137,205,l,-199,43,z");
        let buffer = extrude_path(path, 10.0);

        println!("{:?}", buffer.vertices);
        println!("{:?}", buffer.indices);

        assert_eq!(buffer.vertices.len(), 10);
        assert_eq!(buffer.indices.len(), 30);
    }

}