import {BaseProvider} from "../base-provider.js";

export default class RawMaterialProvider extends BaseProvider {
    get key() {
        return "RawShaderMaterial";
    }

    async processItem(item, program) {
        const fragmentShader = await this._loadShader(item.args.fragmentShader);
        const vertexShader = item.args.vertexShader == null ? await this._loadDefaultVertex() : await this._loadShader(item.args.vertexShader);
        const uniforms = await this._processUniforms(item.args.uniforms || {}, program);

        const material = await crs.createThreeObject("RawShaderMaterial", {
            fragmentShader: fragmentShader.trim(),
            vertexShader: vertexShader.trim(),
            uniforms: uniforms,
            defines: item.args.defines
        });

        program.materials.set(item.id, material);
    }

    async _loadShader(file) {
        return await fetch(file).then(result => result.text());
    }

    async _loadDefaultVertex() {
        const module = await import("./default-vertex-shader.js");
        return module.defaultVertexShader;
    }

    async _processUniforms(uniforms, program) {
        const keys = Object.keys(uniforms);
        for (let key of keys) {
            if (key.toLowerCase().indexOf("color") != -1) {
                uniforms[key].value =  await crs.createColor(uniforms[key].value);
            }

            if (uniforms[key].type != null) {
                if (uniforms[key].type == "t") {
                    uniforms[key].value = program.textures.get(uniforms[key].value);
                }
            }
        }
        return uniforms;
    }
}