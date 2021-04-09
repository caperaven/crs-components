export async function mergeBufferGeometries (geometries) {
	const isIndexed = geometries[0].index !== null;
	const attributes = {};
	const mergedGeometry = await crs.modules.getInstanceOf("BufferGeometry");

	for (let i = 0; i < geometries.length; ++ i) {
		const geometry = geometries[i];
		let attributesCount = 0;

		// gather attributes, exit early if they're different
		for (let name in geometry.attributes) {
			if (attributes[name] === undefined) attributes[name] = [];
			attributes[name].push(geometry.attributes[name]);
			attributesCount ++;
		}

		// gather .userData
		mergedGeometry.userData.mergedUserData = mergedGeometry.userData.mergedUserData || [];
		mergedGeometry.userData.mergedUserData.push(geometry.userData);
	}

	// merge indices
	if (isIndexed) {
		let indexOffset = 0;
		const mergedIndex = [];

		for (let i = 0; i < geometries.length; ++ i) {
			const index = geometries[i].index;

			for (let j = 0; j < index.count; ++ j) {
				mergedIndex.push(index.getX(j) + indexOffset);
			}

			indexOffset += geometries[i].attributes.position.count;
		}
		mergedGeometry.setIndex(mergedIndex);
	}

	// merge attributes
	for (let name in attributes) {
		const mergedAttribute = await mergeBufferAttributes(attributes[name]);

		mergedGeometry.setAttribute(name, mergedAttribute);
	}

	return mergedGeometry;
};

export async function mergeBufferAttributes (attributes) {
	let TypedArray;
	let itemSize;
	let normalized;
	let arrayLength = 0;

	for (let i = 0; i < attributes.length; ++ i) {
		const attribute = attributes[i];

		TypedArray = TypedArray || attribute.array.constructor;
		itemSize = itemSize || attribute.itemSize;
		normalized = normalized || attribute.normalized;
		arrayLength += attribute.array.length;
	}

	const array = new TypedArray(arrayLength);
	let offset = 0;

	for (let i = 0; i < attributes.length; ++ i) {
		array.set(attributes[i].array, offset);
		offset += attributes[i].array.length;
	}

	return await crs.modules.getInstanceOf("BufferAttribute", "BufferAttribute", array, itemSize, normalized);
};
