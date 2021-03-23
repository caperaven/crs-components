    async _populateCache(json) {
        const tWidth = json.common.scaleW;
        const tHeight = json.common.scaleH;

        for (let charItem of json.chars) {
            const char = String.fromCharCode(charItem.id);

            charItem.uv = {
                tx1: charItem.x / tWidth,
                tx2: (charItem.x + charItem.width) / tWidth,
                ty1: 1 - (charItem.y / tHeight),
                ty2: 1 - ((charItem.y + charItem.height) / tHeight)
            }

            this._cache.set(char, charItem);
        }
    }