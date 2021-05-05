import {BaseProvider} from "../base-provider.js";
import {updateTransform} from "../../helpers/update-transforms.js";
import {rawToGeometry} from "./../../../gfx-helpers/raw-to-geometry.js";

export default class FlowChartProvider extends BaseProvider {
    get key() {
        return "flow-chart";
    }

    async processItem(item, program) {
        const shapeName = `${item.shape}Data`;
        const data = (await import(`./../../../geometry-data/flowchart/${shapeName}.js`))[shapeName];
        const geometry = await rawToGeometry(data);
        const material = await this.getMaterial(item.material, program);
        const mesh = await crs.createThreeObject("Mesh", geometry, material);

        await updateTransform(mesh, item?.args?.transform);

        return mesh;
    }
}