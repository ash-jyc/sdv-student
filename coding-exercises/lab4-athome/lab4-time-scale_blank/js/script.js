import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;

let viz = d3.select("#container")
  .append("svg")
    .attr("class", "viz")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "#ffb7ff")
;

let timeParse = d3.timeParse("%Y");

function filterFunction(datapoint){
  if(datapoint.Approximate_sales > 30000000){
    return true;
  } else {
    return false;
  }
}

function mapFunction(datapoint){
  datapoint.First_published = timeParse(datapoint.First_published);
  return datapoint;
}

function transformData(dataToTransform){
  // make set smaller
  let smallerSet = dataToTransform.filter(filterFunction)

  // turn js strings into date objects
  let dataWithDataObject = smallerSet.map(mapFunction);

  // clean data
  let cleanData = dataWithDataObject.filter(d => {
      return d.First_published != null;
  });

  return cleanData;
}

function gotData(incomingData){
  console.log(incomingData);

  let transformedData = transformData(incomingData);
  transformedData.sort((a, b) => {
    return a.First_published - b.First_published;
  });

  function getYear(d){
    return d.First_published;
  }

  let earliestYear = d3.min(transformedData, getYear);
  let latestYear = d3.max(transformedData, getYear);
  let timeScale = d3.scaleTime().domain([earliestYear, latestYear]).range([50, w-300]);

  let datagroups = viz.selectAll(".datagroup").data(transformedData).enter()
    .append("g")
      .attr("class", "datagroup")
  ;

  datagroups
    .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 10)
      .attr("fill", "white")
  ;

  function getLabel(d){
    return d.Book + " " + d.First_published.getFullYear();
  }
  datagroups
    .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .text(getLabel)
  ;

  function getGroupPosition(d, i){
    let x = timeScale(d.First_published);
    let y = 100+(h-200)/51*i;
    return "translate("+x+","+y+")";
  }

  datagroups.attr("transform", getGroupPosition);
}


d3.json("Books.json").then(gotData);
