import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

let w = 1000;
let h = 700;
let xPadding = 50;
let yPadding = 50;

let viz = d3.select("#container")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "lavender")
  ;

function gotData(incomingData) {

  /**
   * FILTERING DATA FOR TAYLOR SWIFT OG 1989 AND TAYLOR'S VERSION
   */
  let taylorSwift1989 = incomingData.filter(d => {
    let songArtists = d.artists.split(",")
    return songArtists.includes("Taylor Swift") && d.album_name.includes("1989")
  });

  console.log("original data")
  console.log(taylorSwift1989)

  // console.log(taylorSwiftSongs);

  let taylorsVersionGroup = d3.groups(taylorSwift1989, function (d) {
    return d.album_name.includes("(Taylor's Version)")
  });

  console.log("grouped data")
  console.log(taylorsVersionGroup)

  let notTaylorsVer = taylorsVersionGroup[1][1]
  let notTaylorsVerSongs = notTaylorsVer.map(d => d.name);


  let taylorsVer = taylorsVersionGroup[0][1].filter(d => {
    if (notTaylorsVerSongs.includes(d.name.split(" (Taylor's Version)")[0])) {
      return true;
    } else {
      return false;
    }
  });

  console.log("taylors version")
  let groupBySongTV = d3.groups(taylorsVer, d => d.name);
  let groupBySongNotTV = d3.groups(notTaylorsVer, d => d.name);


  console.log(groupBySongNotTV)
  console.log(groupBySongTV)

  /**
   * FIX TIME
   */
  let timeParser = d3.timeParse("%Y-%m-%d");
  let formatDate = d3.timeFormat("%B %d, %Y");

  function mapFunction(d) {
    d.snapshot_date = timeParser(d.snapshot_date);
    d.album_release_date = timeParser(d.album_release_date);
    return d;
  };

  notTaylorsVer = notTaylorsVer.map(mapFunction);
  taylorsVer = taylorsVer.map(mapFunction)

  let TV_groupByDate = d3.groups(taylorsVer, function (d) {
    // console.log(d.snapshot_date)
    return formatDate(d.snapshot_date)
  })
  let notTV_groupByDate = d3.groups(notTaylorsVer, function (d) {
    return formatDate(d.snapshot_date)
  })


  console.log(TV_groupByDate)
  console.log(notTV_groupByDate)

  // add buttons with names of not TV songs and filter both datasets by song name
  let buttonDiv = d3.select("body").append("div").attr("id", "buttons")
  buttonDiv.selectAll("button")
    .data(groupBySongNotTV)
    .enter()
    .append("button")
    .text(d => d[0])
    .on("click", function (event, d) {
      let songName = d[0];
      let notTV = notTaylorsVer.filter(d => d.name === songName);
      let TV = taylorsVer.filter(d => d.name === songName + " (Taylor's Version)");
      drawChart(notTV, TV)
    })

  function drawChart(notTV, TV) {
    // draw trendlines for each song

    viz.selectAll("*").remove();

    console.log(notTV)
    console.log(TV)

    let allDates = notTV.map(d => d.snapshot_date).concat(TV.map(d => d.snapshot_date))
    let xDomain = d3.extent(allDates)
    xDomain = [xDomain[1], xDomain[0]]
    console.log(xDomain)
    let xScale = d3.scaleTime().domain(xDomain).range([xPadding, w - xPadding]);

    // group by day
    let notTV_groupByDate = d3.groups(notTV, function (d) {
      return d.snapshot_date
    })
    let TV_groupByDate = d3.groups(TV, function (d) {
      return d.snapshot_date
    })

    // map date to length of elements in date
    let notTV_groupByDateLength = notTV_groupByDate.map(d => {
      return [d[0], d[1].length]
    })
    let TV_groupByDateLength = TV_groupByDate.map(d => {
      return [d[0], d[1].length]
    })

    console.log("group by date length")
    console.log(notTV_groupByDateLength)
    console.log(TV_groupByDateLength)

    let yDomain = [d3.max(notTV_groupByDateLength.concat(TV_groupByDateLength), d => d[1]), 0]
    let yScale = d3.scaleLinear().domain(yDomain).range([h - yPadding, yPadding]);

    buildXAndYAxis(xScale, yScale);

    // draw a trendline for each song, TV and not TV
    let lineMaker = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      ;


    // add consistent animation when drawing lines
    let lineGroup = viz.append("g").attr("class", "lineGroup")
    let notTVLine = lineGroup.append("path")
      .attr("d", lineMaker(notTV_groupByDateLength))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", function (d) {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function (d) {
        return this.getTotalLength();
      })
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0)
      ;

    let TVLine = lineGroup.append("path")
      .attr("d", lineMaker(TV_groupByDateLength))
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", function (d) {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function (d) {
        return this.getTotalLength();
      })
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0)
      ;
  }


}


// load data
d3.csv("taylorSwift1989.csv").then(gotData);


// function to build x anc y axis.
// the only reasons these are down here is to make the code above look less polluted

function buildXAndYAxis(xScale, yScale) {
  let xAxisGroup = viz.append("g").attr("class", 'xaxis');
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.call(xAxis)
  xAxisGroup.attr("transform", "translate(0, " + (h - yPadding) + ")")
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
  yAxisGroup.attr("transform", "translate(" + xPadding + ", 0)")

  yAxisGroup.append("g").attr('class', 'xLabel')
    .attr("transform", "translate(-33, " + h / 2 + ") rotate(-90)")
    .append("text")
    .attr("fill", "black")
    .text("Popularity")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1.7em")

    ;
}
