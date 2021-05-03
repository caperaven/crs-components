1. objects must be mesh
2. ensure that objects are triangulated (edit mode, ctrl t)
3. make sure you apply position and scale (object mode, ctrl a)

## Viewport navigation

Numbpad
7: top      -- when doing 2d work from this view
3: side
1: from

middle mouse to rotate
shift + middle mouse to move viewport

change edit and obj mode -> tab key

left click to select
box select "B"
shift d to duplicate

## Simple process

1. import svg
1. scale
1. move into place and refine scale
1. convert to mesh
1. remove doubles
1. cleanup
   
set geometry to origin (obj mode, right click, "set origion" => "geometry to origin");
convert to mesh (obj mode, right click, "convert to mesh").
scale to size (obj mode, "s" key and move mouse, click to apply)
move into place (obj mode, "g" key, move mouse click to place. to move on axis "g" then "x" for x axis...)
add new object (obj mode, shift a)

## Things to know in blender

1. mirror
1. sub divide   right click after 2 vertice selection
1. merge        ("m", or "gg")
1. desolve      right click after 2 or more vertice selection
1. create edge or face ("f" after vertice selection)
1. edge select  (alt click on edge)
1. remove doubles (right click in edit mode -> merge vertices -> by distance)
1. join meshes into on (ctrl j)

## Problem solving

If you don't see all or any of your mesh
1. mesh is not triangulated
1. check your normals (overlays gizo in edit mode -> face orientation)
