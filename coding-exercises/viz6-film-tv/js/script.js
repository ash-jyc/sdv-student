import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

let w = 900;
let h = 900;
let paddingX = 100;
let paddingY = 40;

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "lavender")
  ;

let currStep = 0;

let currentSong = "Murder On The Dancefloor";
function gotData(incomingData) {
  let songData = incomingData.filter(function(d) {
    return d.name == currentSong;
  });
  console.log(songData);

  const uniqueByDate = new Map();
  songData.forEach(d => {
    if (!uniqueByDate.has(d.snapshot_date)) {
      uniqueByDate.set(d.snapshot_date, d);
    }
  });

  // Convert the Map values back to an array
  let reducedData = Array.from(uniqueByDate.values()).reverse();

  // Continue with your existing code to handle reducedData
  console.log(reducedData);

  // group by date
  let dateParser = d3.timeParse("%Y-%m-%d");
  function mapFunction(d) {
    d.snapshot_date = dateParser(d.snapshot_date);
    return d;
  }
  
  let songDataDate = reducedData.map(mapFunction);  
  console.log(songDataDate)
  // let groupByDate = d3.groups(songData, d => d.snapshot_date);
  // console.log(groupByDate);

  let popularityExtent = d3.extent(songDataDate, d => d.popularity).reverse();
  let popularityScale = d3.scaleLinear().domain(popularityExtent).range([paddingY, h - paddingY]);
  // console.log(popularityExtent)

  let dateExtent = d3.extent(songDataDate, d => d.snapshot_date);
  let dateScale = d3.scaleTime().domain(dateExtent).range([paddingX, w - paddingX])
  console.log(dateExtent)

  buildXAndYAxis(dateScale, popularityScale)

  function drawViz() {
    // Append a new skeleton for the current step
    if(currStep < songDataDate.length) {
      viz.append("image")
        .attr("xlink:href", (currStep % 6) + ".png")
        .attr("x", dateScale(songDataDate[currStep].snapshot_date) - 20)
        .attr("y", popularityScale(songDataDate[currStep].popularity) - 20)
        .attr("width", 40)
        .attr("height", 40)
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);
  
      // Prepare data for the line up to the current step
      let lineData = songDataDate.slice(0, currStep + 1);
  
      // Define the line generator
      let lineMaker = d3.line()
        .x(d => dateScale(d.snapshot_date))
        .y(d => popularityScale(d.popularity));
  
      // If it's the first step, create the line path, else update it
      if (currStep === 0) {
        viz.append("path")
          .attr("class", "line") // Add a class to target later
          .attr("d", lineMaker(lineData))
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 5)
          .attr("stroke-dasharray", function() {
            const length = this.getTotalLength();
            return `${length} ${length}`;
          })
          .attr("stroke-dashoffset", function() {
            return this.getTotalLength();
          })
          .transition()
          .attr("stroke-dashoffset", 0);
      } else {
        // Update the path with new data
        viz.select(".line")
          .transition()
          .duration(1000)
          .attr("d", lineMaker(lineData))
          .attr("stroke-dashoffset", 0);
      }
    }
  
    // Increment the step for the next button press
    currStep++;
  }
  

  document.getElementById("step").addEventListener("click", function () {
    drawViz();
  });
}

function buildXAndYAxis(xScale, yScale) {
  let xAxisGroup = viz.append("g").attr("class", 'xaxis');
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis)
  xAxisGroup.attr("transform", "translate(0, " + (h - paddingY) + ")")
  xAxisGroup.append("g").attr('class', 'xLabel')
    .attr("transform", "translate(" + w / 2 + ", 40)")
    .append("text")
    .attr("fill", "black")
    .text("Date")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1.7em")

    ;

  let yAxisGroup = viz.append("g").attr("class", 'yaxis');
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis)
  yAxisGroup.attr("transform", "translate(" + paddingX + ", 0)")

  yAxisGroup.append("g").attr('class', 'xLabel')
    .attr("transform", "translate(-33, " + h / 2 + ") rotate(-90)")
    .append("text")
    .attr("fill", "black")
    .text("Popularity")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1.7em")

    ;
}



d3.csv("data.csv").then(gotData);