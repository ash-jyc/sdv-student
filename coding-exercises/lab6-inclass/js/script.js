import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

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
    .style("background-color", "rgb(104 106 171)")
;


function gotData(incomingData){
  // console.log(incomingData);

  let filteredData = incomingData.filter(d => 
    d.country=="US"
  );

  // console.log(filteredData)

  let timeParser = d3.timeParse("%Y-%m-%d");
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
  let xScale = d3.scaleTime().domain(snapshotDateExtent).range([paddingX, w-paddingX]);

  let releaseDateExtent = d3.extent(topTenUSBefore2020, d => d.album_release_date);
  let yScale = d3.scaleTime().domain(releaseDateExtent).range([h-paddingY, paddingY]);

  // MAKE A COLOR SCALE FOR RANK
  let rankExtent = [1, 2, 10]
  let colorScale = d3.scaleLinear().domain(rankExtent).range(["red", "purple", "white"]);

  // CREATE AXES
  let xAxisGroup = viz.append("g").attr("class", "xAxisGroup");
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis);
  xAxisGroup.attr("transform", "translate(0,"+(h-paddingY)+")");

  let yAxisGroup = viz.append("g").attr("class", "yAxisGroup");
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis);
  yAxisGroup.attr("transform", "translate("+(paddingX)+",0)");
  
  // CREATE DATAGROUPS
  function getLocation(d) {
    let x = xScale(d.snapshot_date);
    let y = yScale(d.album_release_date);
    return "translate("+x+","+y+")";
  }

  let datagroups = viz.selectAll(".datagroup").data(topTenUSBefore2020).enter()
    .append("g")
      .attr("class", "datagroup")
      .attr("transform", getLocation)
  ;

  datagroups
    .append("circle")
      .attr("class", "songCircle")
      .attr("r", 5)
      .attr("fill", d => colorScale(parseInt(d.daily_rank)))
  ;
}


d3.csv("universal_top_spotify_songs.csv").then(gotData);
