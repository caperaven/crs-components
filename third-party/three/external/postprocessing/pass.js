export class Pass {
	constructor() {
		// if set to true, the pass is processed by the composer
		this.enabled = true;

		// if set to true, the pass indicates to swap read and write buffer after rendering
		this.needsSwap = true;

		// if set to true, the pass clears its buffer before rendering
		this.clear = false;

		// if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
		this.renderToScreen = false;
	}

	setSize( /* width, height */ ) {};

	render( /* renderer, writeBuffer, readBuffer, deltaTime, maskActive */ ) {
		console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );
	}
}

export class FullScreenQuad {
	get material() {
		return this._mesh.material;
	}

	set material(newValue) {
		this._mesh.material = newValue;
	}

	async initialize(material) {
		this._camera = await crs.createThreeObject("OrthographicCamera", -1, 1, 1, -1, 0, 1);
		this._geometry = await crs.createThreeObject("PlaneGeometry", 2, 2);
		this._mesh = await crs.createThreeObject("Mesh", this._geometry, material);
	}

	dispose() {
		this._disposing = true;
		this._geometry.dispose();
		this._geometry = null;
		this._mesh = null;
		this._camera = null;
	}

	render(renderer) {
		if (this._disposing) return;
		renderer.render(this._mesh, this._camera);
	}
}