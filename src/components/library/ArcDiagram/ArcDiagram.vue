<template>
  <div>
    <div class="title"></div>
    <div ref="arcDiagram" class="arc-diagram"></div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import * as d3 from "d3";

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return null;
    },
  },
});

const arcDiagram = ref(null);

const constructArc = (element) => {
  const width_dim = 1200;
  const height_dim = 600;

  // Refer to D3 documentation: https://d3-graph-gallery.com/graph/arc_template.html
  // set the dimensions and margins of the graph
  const margin = { top: 0, right: 30, bottom: 50, left: 60 },
    width = width_dim - margin.left - margin.right,
    height = height_dim - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select(element)
    .append("svg")
    // .attr("viewBox", "0 0 300 600")
    .attr("viewBox", [0, 0, width + 90, height + 80])
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Read dummy data
  const data = props.data;
  // List of node names
  const allNodes = data.nodes.map((d) => d.name);

  // List of groups
  let allGroups = data.nodes.map((d) => d.grp);
  allGroups = [...new Set(allGroups)];

  // A color scale for groups:
  const color = d3.scaleOrdinal().domain(allGroups).range(d3.schemeSet3);

  // A linear scale for node size
  const size = d3.scaleLinear().domain([1, 10]).range([0.5, 8]);

  // A linear scale to position the nodes on the X axis
  const x = d3.scalePoint().range([0, width]).domain(allNodes);

  // In the input data, links are provided between nodes -id-.
  const idToNode = {};
  data.nodes.forEach(function (n) {
    idToNode[n.id] = n;
  });

  // Add the links
  const links = svg
    .selectAll("mylinks")
    .data(data.links)
    .join("path")
    .attr("d", (d) => {
      let start = x(idToNode[d.source].name); // X position of start node on the X axis
      let end = x(idToNode[d.target].name); // X position of end node
      return [
        "M",
        start,
        height - 30, // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
        "A", // This means we're gonna build an elliptical arc
        (start - end) / 2,
        ",", // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
        (start - end) / 2,
        0,
        0,
        ",",
        start < end ? 1 : 0,
        end,
        ",",
        height - 30,
      ] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
        .join(" ");
    })
    .style("fill", "none")
    .attr("stroke", "grey")
    .style("stroke-width", 1);

  // Add the circle for the nodes
  const nodes = svg
    .selectAll("mynodes")
    .data(
      data.nodes.sort((a, b) => {
        +b.n - +a.n;
      })
    )
    .join("circle")
    .attr("cx", (d) => x(d.name))
    .attr("cy", height - 30)
    .attr("r", (d) => size(d.n * 2))
    .style("fill", (d) => color(d.grp))
    .attr("stroke", "white");

  // And give them a label
  const labels = svg
    .selectAll("mylabels")
    .data(data.nodes)
    .join("text")
    .attr("x", 0)
    .attr("y", 0)
    .text((d) => d.name)
    .style("text-anchor", "end")
    .attr("transform", (d) => `translate(${x(d.name)},${height - 15})`)
    .style("font-size", 12);

  // Add the highlighting functionality
  nodes
    .on("mouseover", function (event, d) {
      // Highlight the nodes: every node is green except of him
      nodes.style("opacity", 0.2);
      d3.select(this).style("opacity", 1);

      // Highlight the connections
      links
        .style("stroke", (a) =>
          a.source === d.id || a.target === d.id ? color(d.grp) : "#b8b8b8"
        )
        .style("stroke-opacity", (a) =>
          a.source === d.id || a.target === d.id ? 1 : 0.2
        )
        .style("stroke-width", (a) =>
          a.source === d.id || a.target === d.id ? 4 : 1
        );
      labels
        .style("font-size", (b) => (b.name === d.name ? 16 : 2))
        .attr("y", (b) => (b.name === d.name ? 10 : 0));
    })
    .on("mouseout", () => {
      nodes.style("opacity", 1);
      links
        .style("stroke", "grey")
        .style("stroke-opacity", 0.8)
        .style("stroke-width", "1");
      labels.style("font-size", 12);
    });
};

onMounted(() => {
  constructArc(arcDiagram.value);
});
</script>

<style scoped></style>
