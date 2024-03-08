import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as d3 from "https://d3js.org/d3.v4.js";


// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

let w = 1200;
let h = 800;
let paddingX = 100;
let paddingY = 40;

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "rgb(189, 175, 220)")
  ;


function gotData(incomingData) {
  // console.log(incomingData);
  viz.selectAll("*").remove();

  let country = document.getElementById("chooseCountry").value;

  let filteredData = incomingData.filter(d =>
    d.country == country
  );

  // console.log(filteredData)

  let timeParser = d3.timeParse("%Y-%m-%d");
  let formatDate = d3.timeFormat("%B %d, %Y");
  let threshDate = timeParser("2020-12-31");

  function mapFunction(d) {
    d.snapshot_date = timeParser(d.snapshot_date);
    d.album_release_date = timeParser(d.album_release_date);
    return d;
  }

  let filteredDataWithTime = filteredData.map(mapFunction);
  console.log(filteredDataWithTime);

  let filteredDataBefore2020 = filteredDataWithTime.filter(d =>
    d.album_release_date <= threshDate
  );

  // console.log(filteredDataBefore2020);

  let topTenUSBefore2020 = filteredDataBefore2020.filter(d =>
    parseInt(d.daily_rank) <= 10
  );

  console.log(topTenUSBefore2020);

  // CREATE SCALES
  let snapshotDateExtent = d3.extent(topTenUSBefore2020, d => d.snapshot_date);
  let xScale = d3.scaleTime().domain(snapshotDateExtent).range([paddingX, w - paddingX]);

  let releaseDateExtent = d3.extent(topTenUSBefore2020, d => d.album_release_date);
  let yScale = d3.scaleTime().domain(releaseDateExtent).range([h - paddingY, paddingY]);

  // MAKE A COLOR SCALE FOR RANK
  let rankExtent = [1, 2, 10]
  let colorScale = d3.scaleLinear().domain(rankExtent).range(["red", "purple", "blue"]);

  // CREATE AXES
  let xAxisGroup = viz.append("g").attr("class", "xAxisGroup");
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis);
  xAxisGroup.attr("transform", "translate(0," + (h - paddingY) + ")");

  let yAxisGroup = viz.append("g").attr("class", "yAxisGroup");
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis);
  yAxisGroup.attr("transform", "translate(" + (paddingX) + ",0)");

  // CREATE DATAGROUPS
  function getLocation(d) {
    let x = xScale(d.snapshot_date);
    let y = yScale(d.album_release_date);
    return "translate(" + x + "," + y + ")";
  }

  let datagroups = viz.selectAll(".datagroup").data(topTenUSBefore2020).enter()
    .append("g")
    .attr("class", "datagroup")
    .attr("transform", getLocation)
    ;

  // ADD MOUSEOVER
  var tooltip = d3.select("#tooltip")
    .style("opacity", 2)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  var mouseover = function (event, d) {
    tooltip
      .style("opacity", 1);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  }
  var mousemove = function (event, d) {
    // var [x, y] = d3.pointer(event)
    // console.log(x, y)
    tooltip
      .html("Song: " + d.name + "<br/>Artist: " + d.artists + "<br/>Release date: " + formatDate(d.album_release_date))
      .style("left", (event.pageX+10) + "px")
      .style("top", (event.pageY) + "px")
  }
  var mouseleave = function (event, d) {
    tooltip
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8);
  }

  datagroups.selectAll(".songCircle").data(d => [d]).enter()
    .append("circle")
      .attr("class", "songCircle")
      .attr("r", 5)
      .attr("fill", d => colorScale(parseInt(d.daily_rank)))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseleave);
  ;
}

function byCountry() {
  d3.csv("universal_top_spotify_songs.csv").then(gotData);
}

window.byCountry = byCountry;