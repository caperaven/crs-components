import {BaseProvider} from "../base-provider.js";

crs.threePathsObj.GridHelper = crs.threePathsObj.GridHelper || "helpers/GridHelper.js";

export default class GridHelperProvider extends BaseProvider {
    get key() {
        return "GridHelper";
    }

    async processItem(item, program) {
        const size = item.args.size || 10;
        const divisions = item.args.divisions || 10;
        const colorCenterLine = await crs.createColor(item.args.colorCenterLine || "#444444");
        const colorGrid = await crs.createColor(item.args.colorGrid || "#888888");

        const grid = await crs.createThreeObject("GridHelper", size, divisions, colorCenterLine, colorGrid);
        program.canvas.scene.add(grid);
    }
}