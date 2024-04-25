import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1000;
let h = 700;
let xPadding = 50;
let yPadding = 50;

let viz = d3.select("#container")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "lavender");

let maxSpotify = 0;
let maxTikTok = 0;

let datasets = ["Arctic-Monkeys-505", "Arctic-Monkeys-I-Wanna-Be-Yours", "Clairo-Sofia", "Laufey-From-The-Start", "TV-Girl-Cigarettes-Out-The-Window", "TV-Girl-Lovers-Rock", "TV-Girl-Not-Allowed"];
let sources = ["Spotify", "TikTok"];
let promises = [];
let dataResults = [];

datasets.forEach(song => {
  sources.forEach(source => {
    let promise = d3.json(`./data/${song}-${source}.json`).then(data => {
      let max = d3.max(data.chart.seriesData[0].data, d => parseInt(d[1]));
      dataResults.push({ song: song, source: source, max: max });
      if (source === "Spotify" && max > maxSpotify) {
        maxSpotify = max;
      } else if (source === "TikTok" && max > maxTikTok) {
        maxTikTok = max;
      }
    });
    promises.push(promise);
  });
});

Promise.all(promises).then(() => {
  let yScaleSpotify = d3.scaleLinear().domain([0, maxSpotify]).range([h - yPadding, yPadding]);
  let yScaleTikTok = d3.scaleLinear().domain([0, maxTikTok]).range([h - yPadding, yPadding]);
  buildXAndYAxis(yScaleSpotify, yScaleTikTok);
  gotData(dataResults, yScaleSpotify, yScaleTikTok);
});

function gotData(dataResults, yScaleSpotify, yScaleTikTok) {
  let barWidth = 40;
  let barOffset = 10;

  // console.log(dataResults)
  let songGroup = viz.selectAll(".song-group")
    .data(datasets)
    .enter()
    .append("g")
    .attr("class", "song-group")
    .attr("transform", (d, i) => `translate(${xPadding + i * (barWidth * 2 + barOffset)}, 0)`);
  // Draw bars for Spotify and TikTok

  console.log(dataResults)
  songGroup.each(function(songName) {
    let group = d3.select(this);
    

    let tikTokData = dataResults.find(d => d.song === songName && d.source === "TikTok");
    if (tikTokData) {
      group.append("rect")
        .attr("class", "tiktok-bar")
        .attr("x", barWidth + barOffset - 10)  // Offset for 3D shadow effect
        .attr("y", yScaleTikTok(tikTokData.max))  // Adding shadow depth
        .attr("width", barWidth)
        .attr("height", h - yPadding - yScaleTikTok(tikTokData.max))
        .attr("fill", "#00F2C3");
    }

    let spotifyData = dataResults.find(d => d.song === songName && d.source === "Spotify");
    if (spotifyData) {
      group.append("rect")
        .attr("class", "spotify-bar")
        .attr("x", 0)
        .attr("y", yScaleSpotify(spotifyData.max))
        .attr("width", barWidth)
        .attr("height", h - yPadding - yScaleSpotify(spotifyData.max))
        .attr("fill", "#1DB954");
    }

    let songLabel = group.append("text")
      .text(songName)
      .attr("x", barWidth / 2 + barOffset + 20)
      .attr("y", h - yPadding + 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#1DB954");
  });

  
  
  // Draw bars for TikTok
  // viz.selectAll(".tiktok-bar")
  //   .data(dataResults.filter(d => d.source === "TikTok"))
  //   .enter()
  //   .append("rect")
  //   .attr("class", "tiktok-bar")
  //   .attr("x", (d, i) => xPadding + i * (barWidth * 2 + barOffset) + barWidth)
  //   .attr("y", d => yScaleTikTok(d.max))
  //   .attr("width", barWidth)
  //   .attr("height", d => h - yPadding - yScaleTikTok(d.max))
  //   .attr("fill", "#00F2C3")
  //   .attr("transform", "translate(10, 10)"); // Offset for the shadow effect

  // viz.selectAll(".song-label")
  //   .attr("class", "song-label")
  //   .data(dataResults.filter(d => d.source === "Spotify")
  //     .map(d => d.song))
  //   .enter()
  //   .append("text")
  //   .text(d => d)
  //   .attr("x", (d, i) => xPadding + i * (barWidth * 2 + barOffset) + barWidth)
  //   .attr("y", h - yPadding + 20)
  //   .attr("transform", "rotate(-180)")
  //   .attr("text-anchor", "middle")
  //   .attr("font-size", "12px")
  //   .attr("fill", "#1DB954");

}

function buildXAndYAxis(yScaleSpotify, yScaleTikTok) {
  let yAxisSpotify = viz.append("g")
    .attr("class", 'yaxis spotify')
    .attr("transform", "translate(" + xPadding + ", 0)")
    .call(d3.axisLeft(yScaleSpotify).ticks(5));

  let yAxisTikTok = viz.append("g")
    .attr("class", 'yaxis tiktok')
    .attr("transform", "translate(" + (w - xPadding) + ", 0)")
    .call(d3.axisRight(yScaleTikTok).ticks(5));
}
