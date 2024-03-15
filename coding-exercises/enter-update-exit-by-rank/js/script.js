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
  // console.log(c);

  let filteredData = incomingData.filter(d =>
    d.country == "US"
  );

  // console.log(filteredData)
  let timeParser = d3.timeParse("%Y-%m-%d");
  let formatDate = d3.timeFormat("%B %d, %Y");
  let before2020 = timeParser("2021-01-01")

  function mapFunction(d) {
    d.snapshot_date = timeParser(d.snapshot_date);
    d.album_release_date = timeParser(d.album_release_date);
    return d;
  }

  let filteredDataWithTime = filteredData.map(mapFunction);

  let topTenUSBefore2020 = filteredDataWithTime.filter(d =>
    d.album_release_date <= before2020
  );

  // CREATE SCALES
  let snapshotDateExtent = d3.extent(topTenUSBefore2020, d => d.snapshot_date);
  let xScale = d3.scaleTime().domain(snapshotDateExtent).range([paddingX, w - paddingX]);

  // let rankExtent = d3.extent(topTenUSBefore2020, d => parseInt(d.daily_rank)).reverse();
  let rankExtent = [50, 0];
  let yScale = d3.scaleLinear().domain(rankExtent).range([h - paddingY, paddingY]);

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
    let y = yScale(d.daily_rank);
    return "translate(" + x + "," + y + ")";
  }

  function getEnteringPosition(d, i) {
    let x = xScale(d.snapshot_date);
    let y = 0;
    return "translate(" + x + "," + y + ")";
  }

  function getExitingPosition(d, i) {
    let x = xScale(d.snapshot_date);
    let y = h;
    return "translate(" + x + "," + y + ")";
  }

  let vizGroup = viz.append("g").attr("class", "vizGroup");

  function visualizeDate(date) {
    let dataToShow = topTenUSBefore2020.filter(d => 
      formatDate(d.snapshot_date) == formatDate(timeParser(date))
    );

    console.log(dataToShow)

    function assignKeys(d, i) {
      return d.name;
    }

    let datagroups = vizGroup.selectAll(".datagroup").data(dataToShow, assignKeys);
    
    // entering
    let enteringGroups = datagroups.enter()
      .append("g")
      .attr("class", "datagroup")
    ;

    enteringGroups
      .append("circle")
      .attr("class", "songCircle")
      .attr("r", 5)
      .attr("fill", "white")
    ;

    enteringGroups
      .append("text")
      .text(d => d.name)
      .attr("x", 10)
      .attr("y", 5)
      .attr("font-family", "sans-serif")
      .attr("font-size", "1em")
      .attr("fill", "white")
    ;

    enteringGroups
      .attr("transform", getEnteringPosition)
      .transition()
      .attr("transform", getLocation)
    ;
    
    // updating
    datagroups.transition()
      .attr("transform", getLocation)
    ;

    // exiting
    let exitingGroups = datagroups.exit();
    exitingGroups.transition().attr("transform", getExitingPosition).remove();


  }

  document.getElementById("dateSelector").addEventListener("click", function () {
    let currentDate = document.getElementById("dateInput").value;
    visualizeDate(currentDate);
  });
  document.getElementById("date-2023-10-31").addEventListener("click", function () {
    let currentDate = '2023-10-31';
    visualizeDate(currentDate);
  });
  document.getElementById("date-2023-11-30").addEventListener("click", function () {
    let currentDate = '2023-11-30';
    visualizeDate(currentDate);
  });
  document.getElementById("date-2023-12-31").addEventListener("click", function () {
    let currentDate = '2023-12-31';
    visualizeDate(currentDate);
  });
  document.getElementById("date-2024-01-31").addEventListener("click", function () {
    let currentDate = '2024-01-31';
    visualizeDate(currentDate);
  });
}

d3.csv("universal_top_spotify_songs.csv").then(gotData);