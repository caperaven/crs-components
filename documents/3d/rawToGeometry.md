# rawToGeometry

## Introduction
This function takes in geometry data and creates a threejs mesh.

It has two parameters

1. def  - geometry data object containing vertices, indices and normals  
1. material - threejs Material class  

If you do not provide a material, it will return a BufferGeometry.  
If a material is defined it will return a Mesh.  

This feature depends on crs-binding being present and [threejs-paths.js](https://github.com/caperaven/crs-components/blob/master/src/threejs-paths.js) loaded.  
You can load threejs-paths.js in the index.html file or when you need it.  

## Location
/threejs-path.js  
/gfx-helpers/raw-to-geometry.js  
