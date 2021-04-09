export class SVGLoader {
	async load(url) {
		const text = await fetch(url).then(result => result.text());
		return this._parse(text);
	}

	async _parse(text) {
		const xml = new DOMParser().parseFromString(text, 'image/svg+xml');
		return this._parseNode(xml.documentElement);
		return
	}

	async _parseNode(node) {
		// 1. Create Buffer

		// 2. ParseNodes (node, buffer)
			// 2.1 add shape to buffer

	}
}

Word
	constructor("hello")