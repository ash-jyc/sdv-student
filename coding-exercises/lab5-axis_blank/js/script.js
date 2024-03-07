import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let paddingX = 40;
let paddingY = 40;

let viz = d3.select("#container")
  .append("svg")
    .attr("class", "viz")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "rgb(104 106 171)")
;

function gotData(incomingData){
  // console.log(incomingData);

  let filteredData = incomingData.filter(d => 
    d.Code=="CHN" || d.Code=="USA"
  );
  // console.log(filteredData);

  let timeParser = d3.timeParse("%Y");

  function mapFunction(d){
    d.Year = timeParser(d.Year);
    let key = "Incidence - HIV/AIDS - Sex: Both - Age: All Ages (Number) (new cases of HIV)";
    d.Incidence = parseFloat(d[key]);
    delete d[key];
    return d; 
  }

  let filteredDataWithTime = filteredData.map(mapFunction);
  console.log(filteredDataWithTime)

  function getYear(d){
    return d.Year;
  }

  // X SCALE
  let yearExtent = d3.extent(filteredDataWithTime, getYear);
  let xScale = d3.scaleTime().domain(yearExtent).range([paddingX, w-paddingX]);

  // Y SCALE
  let incidenceExtent = d3.extent(filteredDataWithTime, d => d.Incidence);
  let yScale = d3.scaleLinear().domain(incidenceExtent).range([h-paddingY, paddingY]);

  let xAxisGroup = viz.append("g").attr("class", "xAxisGroup");
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis);
  xAxisGroup.attr("transform", "translate(0,"+(h-paddingY)+")");

  let yAxisGroup = viz.append("g").attr("class", "yAxisGroup");
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis);
  yAxisGroup.attr("transform", "translate("+paddingX+",0)");

  let vizGroup = viz.append("g").attr("class", "vizGroup");

  let datagroups = vizGroup.selectAll(".datagroup").data(filteredDataWithTime).enter()
    .append("g")
      .attr("class", "datagroup")
  ;
  
  // datagroups.append("circle")
  //   .attr("cx", 0)
  //   .attr("cy", 0)
  //   .attr("r", 10)
  // ;

  datagroups.append("svg:image")
    .attr("x", -20)
    .attr("y", -20)
    .attr("width", 40)
    .attr("height", 40)
    .attr("xlink:href", "flag.png")


  datagroups.attr("transform", function(d,i){
    let x = xScale(d.Year);
    let y = yScale(d.Incidence);
    return "translate("+x+","+y+")";
  });

  // function getFullYear(d){
  //   return d.Year.getFullYear();
  // }

  datagroups.append("text")
    .attr("class", "countryLabel")
    .text(d => d.Code)
    .attr("x", 10)
    .attr("y", 0)
  ;

  // datagroups.append("text")
  //   .attr("class", "yearLabel")
  //   .text(getFullYear)
  //   .attr("x", 10)
  //   .attr("y", 12)
  //   .attr("fill", "white")
  // ;
}


d3.csv("new-cases-of-hiv-infection.csv").then(gotData);
