import {BaseProvider} from "../base-provider.js";
import {createThreeObject, createColor} from "../../threejs-paths.js";

export default class GridHelperProvider extends BaseProvider {
    get key() {
        return "GridHelper";
    }

    async processItem(item, program) {
        const size = item.size || 10;
        const divisions = item.divisions || 10;
        const colorCenterLine = await createColor(item.colorCenterLine || "#444444");
        const colorGrid = await createColor(item.colorGrid || "#888888");

        const grid = await createThreeObject("GridHelper", size, divisions, colorCenterLine, colorGrid);
        program.canvas.scene.add(grid);
    }
}