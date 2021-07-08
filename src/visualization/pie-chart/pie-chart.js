import {select} from "./../../../third-party/d3js/d3-selection.js";
import {pie, arc} from "./../../../third-party/d3js/d3-shape.js";

class PieChart extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        if (this.isReady === true) {
            this._update(newValue);
        }
    }

    get summary() {
        return this._summary;
    }

    set summary(newValue) {
        this._summary = newValue;
    }

    async connectedCallback() {
        if (this.id == null) throw new Error("pie chart must have an id");
        const template = this.querySelector("template");
        if (template != null) {
            crsbinding.inflationManager.register(this.id, template);
        }

        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            if (this._data != null) {
                this._update(this._data);
            }

            this.isReady = true;
            this.dispatchEvent(new CustomEvent("isReady"));
        });
    }

    async disconnectedCallback() {
        crsbinding.inflationManager.unregister(this.id);
        this.template = null;
        delete this._data;
        delete this._summary;
    }

    async _clearItems() {
        const ul = this.querySelector("ul");
        while(ul.children.length > 0) {
            ul.removeChild(ul.firstChild);
        }
        return ul;
    }

    async _update(data) {
        await this._updateList(data);
        await this._updateChart(data);
    }

    async _updateChart(data) {
        const width = this.dataset.width || this.dataset.height;
        const height = width;

        const svgElement = this.querySelector("svg");
        svgElement.innerHTML = "";
        const svg = select(svgElement)
            .attr("width", width)
            .attr("height", height);

        await this._buildPie(svg, data, width, height);
        await this._buildSummary(svg, this.summary, width, height);
    }

    async _buildPie(svg, data, width, height) {
        const margin = this.dataset.margin || 16;
        const radius = Math.min(width, height) / 2 - margin;
        const innerRadius = this.dataset.innerradius || radius / 1.5;

        const pieShape = pie().value(d => d[1].value);
        const shapeData = pieShape(Object.entries(data));

        svg
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`)
            .selectAll("path")
            .data(shapeData)
            .enter()
            .append("path")
            .attr("d", arc().innerRadius(innerRadius).outerRadius(radius))
            .attr("fill", d => d.data[1].color || this.dataset.color || "blue")
            .style("opacity", 1)
    }

    async _buildSummary(svg, data, width, height) {
        if (data == null) return;
        const summaryElement = crsbinding.inflationManager.get(this.id, data)?.children[0];
        if (summaryElement == null) return;

        svg
            .append("foreignObject")
            .attr("width", width)
            .attr("height", height)

        this.querySelector("foreignObject").appendChild(summaryElement);
    }

    async _updateList(data) {
        const ul = await this._clearItems();
        const template = this.querySelector("#legened-item");
        const colorField = this.dataset.colorfield || "color";
        const titleField = this.dataset.titlefield || "title";
        const valueField = this.dataset.valuefield || "value";

        const fragment = document.createDocumentFragment();
        for (let record of data) {
            const color = record[colorField] || "cornflowerblue";
            const title = record[titleField];
            const value = record[valueField];
            const instance = template.content.cloneNode(true);
            instance.querySelector(".item-color").style.background = color;
            instance.querySelector(".item-text").textContent = title;
            instance.querySelector(".item-value").textContent = value;
            fragment.appendChild(instance);
        }
        ul.appendChild(fragment);
    }
}

customElements.define("pie-chart", PieChart);