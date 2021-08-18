use crate::PolyBuffer;
use lyon::path::Path;
use lyon::tessellation::geometry_builder::{simple_builder, VertexBuffers};
use lyon::tessellation::{FillOptions, FillTessellator};

pub fn create_fill(path: Path) -> PolyBuffer {
    let mut buffer: PolyBuffer = VertexBuffers::new();
    {
        let mut vertex_builder = simple_builder(&mut buffer);
        let mut tessellator = FillTessellator::new();

        tessellator
            .tessellate_path(&path, &FillOptions::default(), &mut vertex_builder)
            .ok();
    }
    return buffer;
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::path_utils::create_path;

    #[test]
    fn simple_shape() {
        let path = create_path("m,-100,-100,l,100,-100,l,100,100,l,-100,100,z");
        let buffer = create_fill(path);

        println!("{:?}", buffer.vertices);
        println!("{:?}", buffer.indices);

        assert_eq!(buffer.vertices.len(), 4);
        assert_eq!(buffer.indices.len(), 6);
    }

    #[test]
    fn normal() {
        let path = create_path("m,-199,431,l,184,241,l,-137,205,l,-199,43,z");
        let buffer = create_fill(path);

        println!("{:?}", buffer.vertices);
        println!("{:?}", buffer.indices);

        assert_eq!(buffer.vertices.len(), 4);
        assert_eq!(buffer.indices.len(), 6);
    }
}
