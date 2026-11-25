import * as d3 from "d3";
import * as Geo from "../geo.json";

function buildMap(
  container,
  {
    width = 1000,
    height = 600,
    margin = { top: 20, right: 20, bottom: 20, left: 100 },
  } = {},
) {
  const svg = d3
    .select(container)
    .append("svg")
    .attr("class", "map-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const marginG = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const zoomG = marginG.append("g");

  const projection = d3
    .geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width / 2 - margin.left, height / 2 - margin.top]);

  zoomG
    .append("g")
    .selectAll("path")
    .data(Geo.features)
    .enter()
    .append("path")
    .attr("class", "topo")
    .attr("d", d3.geoPath().projection(projection))
    .style("opacity", 0.7);

  const zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      zoomG.attr("transform", event.transform);
    });

  svg.call(zoom);

  return { svg, zoomG, projection, zoom };
}

export { buildMap };
