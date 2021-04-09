import {mergeBufferGeometries} from "./../threejs-helpers/buffer-geometry-utils.js";

export class SVGLoader {
	constructor() {
		this._modules = {
			"rect": "./rect.js",
			"circle": "./circle.js",
			"ellipse": "./ellipse.js",
			"group": "./group.js",
			"image": "./image.js",
			"line": "./line.js",
			"path": "./path.js",
			"polyline": "./poly-line.js",
			"polygon": "./polygon.js"
		}
	}

	dispose() {
		this._modules = null;
		this._shapes = null;
	}

	async load(url) {
		const text = await fetch(url).then(result => result.text());
		return this.parse(text);
	}

	async parse(text) {
		this._shapes = [];
		const xml = new DOMParser().parseFromString(text, 'image/svg+xml');
		await this._parseNode(xml.documentElement);

		const geom = await mergeBufferGeometries(this._shapes);
		return geom;
	}

	async _parseNode(node) {
		const tagName = node.tagName.toLowerCase();
		if (tagName == "svg") {
			return await this._parseNodes(node.children);
		}

		await this._parseSvg(node);
	}

	async _parseNodes(nodes) {
		for (let node of nodes) {
			await this._parseNode(node);
		}
	}

	async _parseSvg(node) {
		const tagName = node.tagName.toLowerCase();
		if (typeof this._modules[tagName] == "string") {
			this._modules[tagName] = await import(this._modules[tagName]);
		}
		const fn = this._modules[tagName].default;
		const path = await fn(node);

		const geometry = await crs.modules.getInstanceOf("ShapeGeometry", "ShapeGeometry", path);
		this._shapes.push(geometry);
	}
}