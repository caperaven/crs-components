import {Pass, FullScreenQuad} from './pass.js';

export class ShaderPass extends Pass {
	async initialize(shader, textureId = 'tDiffuse') {
		const ShaderMaterial = await crs.getThreePrototype("ShaderMaterial");
		const UniformsUtils = await crs.getThreePrototype("UniformsUtils");

		this.textureId = textureId;

		if (shader instanceof ShaderMaterial ) {
			this.uniforms = shader.uniforms;
			this.material = shader;
		}
		else if (shader) {
			this.uniforms = UniformsUtils.clone(shader.uniforms);
			this.material = new ShaderMaterial({
				defines: Object.assign({}, shader.defines),
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader
			});
		}

		this.fsQuad = new FullScreenQuad();
		await this.fsQuad.initialize(this.material);
		return this;
	}

	render(renderer, writeBuffer, readBuffer) {
		if (this.uniforms[this.textureId]) {
			this.uniforms[this.textureId ].value = readBuffer.texture;
		}

		this.fsQuad.material = this.material;

		if (this.renderToScreen) {
			renderer.setRenderTarget(null);
			this.fsQuad.render(renderer);
		}
		else {
			renderer.setRenderTarget(writeBuffer);
			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			if (this.clear)
			{
				renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
			}
			this.fsQuad.render(renderer);
		}
	}
}

