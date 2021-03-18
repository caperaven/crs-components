import {BaseProvider} from "../base-provider.js";

crs.threePathsObj.GridHelper = crs.threePathsObj.GridHelper || "helpers/GridHelper.js";

export default class GridHelperProvider extends BaseProvider {
    get key() {
        return "GridHelper";
    }

    async processItem(item, program) {
        const size = item.parameters.size || 10;
        const divisions = item.parameters.divisions || 10;
        const colorCenterLine = await crs.createColor(item.parameters.colorCenterLine || "#444444");
        const colorGrid = await crs.createColor(item.parameters.colorGrid || "#888888");

        const grid = await crs.createThreeObject("GridHelper", size, divisions, colorCenterLine, colorGrid);
        program.canvas.scene.add(grid);
    }
}