import {CopyShader} from "./../shaders/copy-shader.js";
import {ShaderPass} from "./shader-pass.js";
import {ClearMaskPass, MaskPass} from "./mask-pass.js";

let Vector2;

export class EffectComposer {
	async initialize(renderer, renderTarget) {
		const LinearFilter = await crs.getThreeConstant("LinearFilter");
		const RGBAFormat = await crs.getThreeConstant("RGBAFormat");
		const WebGLRenderTarget = await crs.getThreePrototype("WebGLRenderTarget");
		const Clock = await crs.getThreePrototype("Clock");
		Vector2 = await crs.getThreePrototype("Vector2");

		this.renderer = renderer;

		if (renderTarget == null) {
			const parameters = {
				minFilter: LinearFilter,
				magFilter: LinearFilter,
				format: RGBAFormat
			};

			const size = renderer.getSize(new Vector2());
			this._pixelRatio = renderer.getPixelRatio();
			this._width = size.width;
			this._height = size.height;

			renderTarget = new WebGLRenderTarget(this._width * this._pixelRatio, this._height * this._pixelRatio, parameters);
			renderTarget.texture.name = 'EffectComposer.rt1';
		}
		else {
			this._pixelRatio = 1;
			this._width = renderTarget.width;
			this._height = renderTarget.height;
		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();
		this.renderTarget2.texture.name = 'EffectComposer.rt2';

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;
		this.renderToScreen = true;
		this.passes = [];

		this.copyPass = new ShaderPass();
		await this.copyPass.initialize(CopyShader);
		this.clock = new Clock();
	}

	dispose() {
		this.renderer = null;

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();

		this.renderTarget1 = null;
		this.renderTarget2 = null;
		this.copyPass = this.addPass.dispose();
		this.readBuffer = null;
		this.writeBuffer = null;
	}

	swapBuffers () {
		const tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;
	}

	addPass (pass) {
		this.passes.push(pass);
		pass.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
	}

	insertPass (pass, index) {
		this.passes.splice(index, 0, pass);
		pass.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
	}

	removePass (pass) {
		const index = this.passes.indexOf(pass);

		if (index !== -1) {
			this.passes.splice(index, 1);
		}
	}

	isLastEnabledPass (passIndex) {
		for (let i = passIndex + 1; i < this.passes.length; i++) {
			if (this.passes[i].enabled) {
				return false;
			}
		}
		return true;
	}

	render (deltaTime) {
		// deltaTime value is in seconds
		if (deltaTime == null) {
			deltaTime = this.clock.getDelta();
		}

		const currentRenderTarget = this.renderer.getRenderTarget();
		let maskActive = false;
		let pass, i, il = this.passes.length;

		for (i = 0; i < il; i++) {
			pass = this.passes[i];

			if (pass.enabled === false) continue;

			pass.renderToScreen = ( this.renderToScreen && this.isLastEnabledPass( i ) );
			pass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive);

			if (pass.needsSwap) {
				if (maskActive) {
					const context = this.renderer.getContext();
					const stencil = this.renderer.state.buffers.stencil;
					stencil.setFunc(context.NOTEQUAL, 1, 0xffffffff );
					this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime);
					stencil.setFunc(context.EQUAL, 1, 0xffffffff);
				}

				this.swapBuffers();
			}

			if ( MaskPass !== undefined ) {
				if ( pass instanceof MaskPass ) {
					maskActive = true;
				}
				else if ( pass instanceof ClearMaskPass ) {
					maskActive = false;
				}
			}
		}

		this.renderer.setRenderTarget( currentRenderTarget );
	}

	reset (renderTarget) {
		if (renderTarget == null) {
			const size = this.renderer.getSize(new Vector2());
			this._pixelRatio = this.renderer.getPixelRatio();
			this._width = size.width;
			this._height = size.height;

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;
	}

	setSize(width, height) {
		this._width = width;
		this._height = height;

		const effectiveWidth = this._width * this._pixelRatio;
		const effectiveHeight = this._height * this._pixelRatio;

		this.renderTarget1.setSize(effectiveWidth, effectiveHeight);
		this.renderTarget2.setSize(effectiveWidth, effectiveHeight);

		for (let i = 0; i < this.passes.length; i++) {
			this.passes[i].setSize(effectiveWidth, effectiveHeight);
		}
	}

	setPixelRatio(pixelRatio) {
		this._pixelRatio = pixelRatio;
		this.setSize(this._width, this._height);
	}
}