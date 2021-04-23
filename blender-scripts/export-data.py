import bpy

def export_mesh(id, name, folder):
    vertices = []
    indices = []
    normals = []

    get_data(id, vertices, indices, normals)

    vcode = array_code("vertices", vertices)
    icode = array_code("indices", indices)
    ncode = array_code("normals", normals)

    code = ", ".join([vcode, icode, ncode])
    result = "export const " + name + "Data = {" + code + "}"
    save_file(result, name, folder)

def get_data(id, vertices, indices, normals):
    vertices.append(1)
    vertices.append(2)
    vertices.append(3)

    data = bpy.data.objects['action'].data;

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

def array_code(name, collection):
    result = name + ": ["
    for v in collection:
        result += str(v)
        result += ","

    result += "]"
    result = result.replace(",]", "]")
    return result
    
def save_file(code, name, folder):
    file = folder + "\\" + name + "Data.js"
    with open(file, "w") as outfile:
        outfile.write(code)
    

export_mesh("action", "action", "e:\exports")
export_mesh("data", "data", "e:\exports")
export_mesh("decision", "decision", "e:\exports")
export_mesh("delay", "delay", "e:\exports")
export_mesh("display", "display", "e:\exports")
export_mesh("document", "document", "e:\exports")
export_mesh("documents", "documents", "e:\exports")
export_mesh("event", "event", "e:\exports")
export_mesh("inputOutput", "inputOutput", "e:\exports")
export_mesh("loopLimit", "loopLimit", "e:\exports")
export_mesh("manual_Operations", "manual_Operations", "e:\exports")
export_mesh("manualInput", "manualInput", "e:\exports")
export_mesh("merge", "merge", "e:\exports")
export_mesh("offPage", "offPage", "e:\exports")
export_mesh("predefinedProcesses", "predefinedProcesses", "e:\exports")
export_mesh("preparation", "preparation", "e:\exports")
export_mesh("start", "start", "e:\exports")
