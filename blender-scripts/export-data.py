import bpy
import json

vertices = []
normals = []
indices = []
uvs = []


data = bpy.context.object.data

for index in range(len(data.vertices)):
    v = data.vertices[index]
    vertices.append(v.co.x)
    vertices.append(v.co.y)
    vertices.append(v.co.z)
    
    normals.append(v.normal.x)
    normals.append(v.normal.y)
    normals.append(v.normal.z)

for face in data.polygons:
    vertices_in_face = face.vertices[:]
    for fi in range(len(vertices_in_face)):
        indices.append(vertices_in_face[fi])

data = {}
data["vertices"] = vertices
data["indices"] = indices
data["normals"] = normals
#data["uvs"] = uvs
#        
with open("E:\exports\export.json", "w") as outfile:
    json.dump(data, outfile)