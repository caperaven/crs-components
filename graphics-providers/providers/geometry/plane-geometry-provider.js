import {ShapeBaseProvider} from "./shape-base-provider.js";

export default class PlaneGeometryProvider extends ShapeBaseProvider {
    get key() {
        return "PlaneGeometry";
    }
}