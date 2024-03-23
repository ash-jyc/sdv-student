import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as d3 from "https://d3js.org/d3.v4.js";

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

let w = 1200;
let h = 800;
let paddingX = 100;
let paddingY = 40;

let christmasSongs = new Set([
  "2EjXfH91m7f8HiJN1yQg97",
  "4PS1e8f2LvuTFgUs1Cn3ON",
  "7vQbuQcyTflfCIOu3Uzzya",
  "1vZKP9XURuqMp1SpXGnoyb",
  "4rp2Hr51C99Nx5AC9GfSeI",
  "0oPdaY4dXtc3ZsaG17V972",
  "2uFaJJtFpPDc5Pa95XzTvg",
  "77khP2fIVhSW23NwxrRluh",
  "46pF1zFimM582ss1PrMy68",
  "5hslUAKq9I9CG2bAulFkHN",
  "5ASM6Qjiav2xPe7gRkQMsQ",
  "030mot3ZKR3oskfMsqDB2R",
  "2pXpURmn6zC5ZYDMms6fwa",
  "5P8Xvy5tzhmfyfA6GplQ8h",
  "75dfH68JDisE8dDaD4KlVY",
  "4HEOgBHRCExyYVeTyrXsnL",
  "4qP2V09IpTct5A1ZSnr1zh",
  "3QiAAp20rPC3dcAtKtMaqQ",
  "25leEEaz1gIpp7o21Fqyjo",
  "04vLj9QUXoKdRlsp3gkURo",
  "12YAgUbl6Uk9E7fzopF4Ji",
  "3QIoEi8Enr9uHffwInGIsC",
  "0jXjTHqZVXhQSGUAvUbCvU",
  "38xhBO2AKrJnjdjVnhJES6",
  "6Uekkm0MOVT4WznQy0ktVR",
  "2QWKbE6GpWhRtlbRwcP7g8",
  "7GNsHkiYPcQQjvhTiILFUL",
  "0rHToGels2lt8Y0mCYoF90",
  "7azp0ySqPkkXHi9M9aeg3T",
  "3bMfUUpzUzqWp9II00yRhE",
  "7n5m8nDAnyXo81tr4B3Bcw",
  "11Z7sdkpC5IaaydoIvDn74",
  "5aDoUmxBsbdpS16alksb5Z",
  "3sDdyBHQ60Cs1opmIyRvhp",
  "0z5HSQGWgnjdNvwbOmhB2w",
  "7ehhnVu3JUWMaSJzY1zC4k",
  "2GapxG7BxK55ihQRAlR39e",
  "6YeDjSHCDmJKgU8foiaruL",
  "4YhY2qHdBmSX33uj8ms0oq",
  "47otoIkhx3fkdivEXL5OB6",
  "1KIJSvzRZzo8ehDTPOXKru",
  "0H1zX27yxoDrsrQA1hk5Uq",
  "2pnPe4pJtq7689i5ydzvJJ",
  "7qLTpTd1Txpo8Vd84yci7u",
  "1DvjCIefxg1YsdG3ETROph",
  "0pAT3JUEjIiqUkwxE0vbBQ",
  "4Fpd1N7fcbRLnHbsk5D4Ye",
  "6Ai7PiAjnb4eIiC05By0i4",
  "33EcmYsTQVIGRGnGPOfTwu",
  "4MrfQL4TYQXJBlZYpAHTuE",
  "1fjOitI0vZ41P63p1MQLcc",
  "1VuAamHM7P3VQQEXYGG3Uu",
  "53cumdNGYE6NFmGL0zHvx7",
  "1dXcUx5gQ8rkHctSsRnZuH",
  "19NdiithlwC8EfytiHVk7a",
  "07QfuFPazJYuzRtcWW0U2y",
  "04DYwFIKeq2Bkn9aqSI9PC",
  "5aJP0MZjb8LtPAT5WicCZm",
  "1Kcy7qSbf6un30zIkxGVew",
  "15sxLiiChE5dCW3Y756oas",
  "2VsCE6ui7N4IRzGIGT7Di8",
  "6OJdXv1Q5OdLgYolFEunJ4",
  "0SD2UtunDGrX7OIElVr87B",
  "0cAhE2iDJApegDnVRx6fCK",
  "3C4JNyv2NAT72xm0cDKl0v",
  "4BgkhT5HythXhIBqU2WvhX",
  "2aQkTUbJUHk3F6nMipZLbz",
  "2Vfm43BaQcTY55P6R9WvRe",
  "6EAu25LT3JAlO585PFkLhB",
  "1PrhnQxWAVYikCHcieRQiy",
  "6s2wpWPFPAgKg2LXxi1Oee",
  "0Xrev0e2wVRSkq84SJiEMg",
  "60xnB0fgmCft0Pqq6zaivb",
  "0bYg9bo50gSsH3LtXe2SQn",
  "2EjXfH91m7f8HiJN1yQg97",
  "2FRnf9qhLbvw8fu4IBXx78",
  "7vQbuQcyTflfCIOu3Uzzya",
  "0lizgQ7Qw35od7CYaoMBZb",
  "5a1iz510sv2W9Dt1MvFd5R",
  "2uFaJJtFpPDc5Pa95XzTvg",
  "1LmkdWSxjCV7wKTPsCvYWN",
  "5hslUAKq9I9CG2bAulFkHN",
  "3YZE5qDV7u1ZD1gZc47ZeR",
  "5ASM6Qjiav2xPe7gRkQMsQ",
  "0oPdaY4dXtc3ZsaG17V972",
  "1SV1fxF65n9NhRHp3KlBuu",
  "27RYrbL6S02LNVhDWVl38b",
  "73ye7F9Ub51dQ3CrnCHFhr",
  "4PS1e8f2LvuTFgUs1Cn3ON",
  "4Yg2w0P29BBBMixyeNjDtj",
  "5xDrO9DEDJGUQGfyoHvgDJ",
  "47ohYW8e7dxCYn9qbUMBCI",
  "7uoFMmxln0GPXQ0AcCBXRq",
  "2O3MQ6H3gjrIWDcpeTrikT",
  "4kKdvXD0ez7jp1296JmAts",
  "18uSfZqFBxQFi8CsXOIbhy",
  "7faDzZnZYqTyYThx2sbHVQ",
  "2IuUMx3uxxJAHcH41aYtn0",
  "32h59T8q2SonUPJ006lyXt",
  "1VuAamHM7P3VQQEXYGG3Uu",
  "777bpngWpsT8TTqrrO0Zde",
  "2pnPe4pJtq7689i5ydzvJJ",
  "7o4HtESXicUqk3oRqngIsS",
  "4uQqahi1iUP35xE2qGdKdo",
  "13XMz3rpVYITzjFIsSYlZ1",
  "3AymrUApW5JKKaNrHQhcBG",
  "6pVW5LRWgeLaHudxauOTJU",
  "24lCPIiEWKg9K7k1Gh1h8q",
  "5aDoUmxBsbdpS16alksb5Z",
  "5DMItYJluCFc7YtFdP4aXo",
  "5wTM2Bm8phDwHAuOsfBwhU",
  "6ImuFqEAZf9dkpuYahSr0K",
]);

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "black")
  ;


function gotData(incomingData) {
  // let timeParser = d3.timeParse("%Y-%m-%d");
  let timeParser = d3.timeParse("%Y");
  let formatDate = d3.timeFormat("%Y");

  function mapFunction(d) {
    d.snapshot_date = formatDate(timeParser(d.snapshot_date));
    d.album_release_date = formatDate(timeParser(d.album_release_date));
    d.time_to_trend = parseInt(d.snapshot_date) - parseInt(d.album_release_date);
    return d;
  }

  let filteredDataWithTime = incomingData.map(mapFunction);

  let filteredDataBefore2000 = filteredDataWithTime.filter(d =>
    parseInt(d.album_release_date) <= parseInt(2000) && parseInt(d.album_release_date) > parseInt(1910) && parseInt(d.daily_rank) <= 20 && (
      // filter out christmas
      !christmasSongs.has(d.spotify_id) &&
      !d.name.includes("Christmas") &&
      !d.name.includes("Navidad") &&
      !d.name == ""
    )
  );

  // GET FIRST INSTANCE OF SONG APPEARING ON DATE
  let filteredDataSongFirstAppearance = filteredDataBefore2000.filter((d, i, arr) => {
    let song = d.name;
    let firstAppearance = arr.findIndex(d => d.name == song);
    return i == firstAppearance;
  });

  console.log(filteredDataSongFirstAppearance)

  // CREATE SCALES
  let minExtent = d3.min(filteredDataSongFirstAppearance, d => d.time_to_trend);
  let maxExtent = d3.max(filteredDataSongFirstAppearance, d => d.time_to_trend);
  let xScale = d3.scaleLinear().domain([0, maxExtent]).range([paddingX - 50, w - paddingX - 300]);

  let rankExtent = [20, 1];
  let yScale = d3.scaleLinear().domain(rankExtent).range([h - paddingY, paddingY]);

  let colorScale = d3.scaleLinear().domain([minExtent, maxExtent * 20]).range(["cyan", "magenta"]);

  // CREATE AXES
  // createAxes(xScale);

  // CREATE DATAGROUPS
  function getLocation(d) {
    let x = xScale(d.time_to_trend);
    let y = yScale(d.daily_rank);
    return "translate(" + x + "," + y + ")";
  }

  let vizGroup = viz.append("g").attr("class", "vizGroup");

  let datagroups = vizGroup.selectAll(".datagroup").data(filteredDataSongFirstAppearance, d => d.name).enter()
    .append("g")
      .attr("class", "datagroup")

  // vizGroup
  //   .append("circle")
  //   .attr("class", "baseCircle")
  //   .attr("r", 2)
  //   .attr("fill", "pink")
  //   .attr("transform", "translate(" + xScale(0) + "," + yScale(10) + ")");
    
  datagroups
    .append("circle")
    .attr("class", "songCircle")
    .attr("r", 5)
    .attr("fill", d => colorScale(d.time_to_trend * d.daily_rank))
    .attr("transform", getLocation);
    ;
  
  let line = d3.line()
    .x(d => xScale(d.time_to_trend))
    .y(d => yScale(d.daily_rank))
    .curve(d3.curveBasis)
  ;
    
  datagroups
    .append("path")
    .attr("d", d => line([
      {time_to_trend: 0, daily_rank: 20}, 
      {time_to_trend: d.time_to_trend / 2, daily_rank: 2 + (d.daily_rank / 2)},
      {time_to_trend: d.time_to_trend, daily_rank: d.daily_rank}]))
    .attr("stroke", d => colorScale(d.time_to_trend * d.daily_rank))
    .attr("stroke-width", 1)
    .attr("fill", "none")
  ;
  
  // create a color scale on the right that has the labels of the songs
  // sort them by time_to_trend * daily_rank
  let sortedData = filteredDataSongFirstAppearance.sort((a, b) => a.time_to_trend * a.daily_rank - b.time_to_trend * b.daily_rank);
  let colorScaleData = sortedData.map(d => d.name);
  let colorScaleY = d3.scaleBand().domain(colorScaleData).range([paddingY, h - paddingY]);
  let colorScaleX = w - paddingX - 250;
  let colorScaleHeight = 10;
  let colorScaleWidth = 20;
  
  let colorScaleGroup = vizGroup.append("g").attr("class", "colorScaleGroup");

  colorScaleGroup.selectAll(".colorScaleRect").data(sortedData).enter()
    .append("rect")
    .attr("class", "colorScaleRect")
    .attr("x", colorScaleX)
    .attr("y", d => colorScaleY(d.name))
    .attr("width", colorScaleWidth)
    .attr("height", colorScaleHeight)
    .attr("fill", d => colorScale(d.time_to_trend * d.daily_rank))

  colorScaleGroup.selectAll(".colorScaleText").data(sortedData).enter()
    .append("text")
    .attr("class", "colorScaleText")
    .text(d => d.name + ", " + d.time_to_trend + " years, " + d.country)
    .attr("x", colorScaleX + colorScaleWidth + 5)
    .attr("y", d => colorScaleY(d.name) + colorScaleHeight)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "white")
    ;
  // datagroups
  //   .append("text")
  //   .text(d => d.name)
  //   .attr("x", 10)
  //   .attr("y", 5)
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", "1em")
  //   .attr("fill", "white")
  //   .attr("transform", getLocation)
  //   ;

}

// function createAxes(xScale) {
//   let xAxisGroup = viz.append("g").attr("class", "xAxisGroup");
//   let xAxis = d3.axisBottom(xScale);
//   xAxisGroup.call(xAxis);
//   xAxisGroup.attr("transform", "translate(0," + (h - paddingY + 10) + ")");

// }

d3.csv("data.csv").then(gotData);