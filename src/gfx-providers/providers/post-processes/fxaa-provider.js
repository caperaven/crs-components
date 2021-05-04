import {BaseProvider} from "./../base-provider.js";

export default class FXAAProvider extends BaseProvider {
    get key() {
        return "fxaa"
    }

    async processItem(item, program) {
        await program.canvas.enableRenderPass();
        const pixelRatio = program.canvas.renderer.getPixelRatio();

        const shaderPassModule = await import("./../../../../third-party/three/external/postprocessing/shader-pass.js");
        const fxaaModule = await import("./../../../../third-party/three/external/shaders/FXAA-shader.js");

        const fxaaPass = new shaderPassModule.ShaderPass();
        await fxaaPass.initialize(fxaaModule.FxaaShader);
        fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (program.canvas.width * pixelRatio);
        fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (program.canvas.height * pixelRatio);

        program.canvas.composer.addPass(fxaaPass);
    }
}