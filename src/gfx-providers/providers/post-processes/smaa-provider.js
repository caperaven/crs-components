import {BaseProvider} from "./../base-provider.js";

export default class SMAAProvider extends BaseProvider {
    get key() {
        return "smaa"
    }

    async processItem(item, program) {
        await program.canvas.enableRenderPass();
        const pixelRatio = program.canvas.renderer.getPixelRatio();
        const smaaModule = await import("./../../../../third-party/three/external/postprocessing/smaa-pass.js");

        const smaaPass = new smaaModule.SMAAPass();
        await smaaPass.initialize(program.canvas.width * pixelRatio, program.canvas.height * pixelRatio);

        program.canvas.composer.addPass(smaaPass);
    }
}