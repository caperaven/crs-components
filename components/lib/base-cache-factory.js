/**
 * Base class to work with cached factory classes used in other controls where virtualization happens.
 */
export class BaseCacheFactory {
    constructor() {
        this._cache = [];
    }

    dispose() {
        this.clear();
        this._cache = null;
    }

    disposeItem(item) {
        if (item.dispose != null) {
            item.dispose();
        }

        const keys = Object.keys(item).filter(key => key.indexOf("__") != -1);
        for (let key of keys) {
            delete item[key];
        }

        item = null;
    }

    clear() {
        this._cache.forEach(item => this.disposeItem(item));
        this._cache.length = 0;
    }

    async return(item) {
        this._cache.push(item);
    }

    async get() {
        if (this._cache.length == 0) {
            await this.initialize(1);
        }
        return this._cache.pop();
    }

    /**
     * Create a set amount of items and add it to the cache for further use
     * @param count
     */
    async initialize(count) {
        count = await this._resizeCache(count);
        for (let i = 0; i < count; i++) {
            const item = await this.createCacheItem();
            this._cache.push(item);
        }
    }

    /**
     * Resize the cache.
     * If the target is greater than the cache, return how many items must be created.
     * If the target is less than the cache, remove items from the cache so we don't have redundant items in the cache.
     * @param targetCount
     * @returns {Promise<number>}
     */
    async _resizeCache(targetCount) {
        let toCreate = 0;

        if (targetCount > this._cache.length) {
            toCreate = targetCount - this._cache.length;
            return toCreate;
        }
        else if (targetCount < this._cache.length) {
            const count = this._cache.length - targetCount;
            for (let i = 0; i < count; i++) {
                const item = this._cache.pop();
                this.disposeItem(item);
            }
        }

        return toCreate;
    }

    /**
     * Overwrite this for your item creation
     * @returns {Promise<null>}
     */
    async createCacheItem() {
        return null;
    }
}