export class WidgetBase {
    get enabled() {
        return this._enabled || false;
    }

    set enabled(newValue) {
        this._enabled = newValue;
    }
}