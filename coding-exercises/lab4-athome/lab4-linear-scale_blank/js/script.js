import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "lightblue")
  ;

function gotData(incomingData) {
  console.log(incomingData);

  let datagroups = viz.selectAll(".datagroup").data(incomingData).enter()
    .append("g")
    .attr("class", "datagroup")
  ;

  let yScale = d3.scaleLinear().domain([0, 830]).range([0, h/2-20]);
  let colorScale = d3.scaleLinear().domain([300, 450, 830]).range(["black", "orange", "yellow"]);

  function getHeight(d, i) {
    return yScale(d.height);
  }
  
  function getTowerYpos(d, i) {
    return -yScale(d.height);
  }

  function getColor(d, i) {
    return colorScale(d.height);
  }

  datagroups.append("rect")
    .attr("class", "tower")
    .attr("x", 0)
    .attr("y", getTowerYpos)
    .attr("width", w/100-1)
    .attr("height", getHeight)
    .attr("fill", "black")
    .attr("fill", getColor)
  ;

  function getName(d, i) {
    return d.name;
  }

  datagroups.append("text")
    .attr("class", "name")
    .attr("x", 3)
    .attr("y", -2)
    .text(getName)
    .attr("transform", "rotate(90)")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
  ;

  function getGroupPosition(d, i) {
    let x = w/100*i;
    let y = 550;
    return "translate(" + x + ", " + y + ")";
  }

  datagroups.attr("transform", getGroupPosition);

}


d3.json("buildings.json").then(gotData);
