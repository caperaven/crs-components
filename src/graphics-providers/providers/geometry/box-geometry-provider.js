import {ShapeBaseProvider} from "./shape-base-provider.js";

export default class BoxGeometryProvider extends ShapeBaseProvider {
    get key() {
        return "BoxGeometry";
    }
}