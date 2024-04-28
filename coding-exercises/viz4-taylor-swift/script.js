import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// keys: "spotify_id","name","artists","daily_rank","daily_movement","weekly_movement","country","snapshot_date","popularity","is_explicit","duration_ms","album_name","album_release_date","danceability","energy","key","loudness","mode","speechiness","acousticness","instrumentalness","liveness","valence","tempo","time_signature"

let w = 900;
let h = 600;
// let xPadding = 50;
// let yPadding = 50;

let viz = d3.select("#viz1")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "lavender")
  ;

// viz.append("line")
//   .attr("x1", w / 2)
//   .attr("y1", 30)
//   .attr("x2", w / 2)
//   .attr("y2", h - 30)
//   .style("stroke", "gray")
//   .style("stroke-width", 2);

let sim = d3.forceSimulation()
  .force("x", d3.forceX(w / 2))
  .force("y", d3.forceY(h / 2))
  .force("collide", d3.forceCollide(9))
  .force("center", d3.forceCenter(w / 2, h / 2)) // offset the center of our system
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

  let taylorsVersionGroup = d3.groups(taylorSwift1989, function (d) {
    return d.album_name.includes("(Taylor's Version)")
  });

  let notTaylorsVer = taylorsVersionGroup[1][1]
  let notTaylorsVerSongs = notTaylorsVer.map(d => d.name);

  let taylorsVer = taylorsVersionGroup[0][1].filter(d => {
    if (notTaylorsVerSongs.includes(d.name.split(" (Taylor's Version)")[0])) {
      return true;
    } else {
      return false;
    }
  });

  let groupBySongTV = d3.groups(taylorsVer, d => d.name);
  let groupBySongNotTV = d3.groups(notTaylorsVer, d => d.name);

  let blankSpace = {
    "song": "Blank Space",
    "songData": [
      {
        data: groupBySongNotTV.filter(d => d[0].includes("Blank Space"))[0][1],
        version: "Original",
      },
      {
        data: groupBySongTV.filter(d => d[0].includes("Blank Space"))[0][1],
        version: "Taylor's Version",
      }
    ],
    step: 0
  }

  let style = {
    "song": "Style",
    "songData": [
      {
        data: groupBySongNotTV.filter(d => d[0].includes("Style"))[0][1],
        version: "Original",
      },
      {
        data: groupBySongTV.filter(d => d[0].includes("Style"))[0][1],
        version: "Taylor's Version",
      }
    ],
    step: 1
  }

  let data = [blankSpace, style]
  console.log("data", data)

  let dataToShow = data.filter(d => d.step == 0)
  console.log("data to show", dataToShow)
  updateGraph(dataToShow)


  enterView({
    selector: '.viz1-step2',
    enter: function (el) {

      let dataToShow = data.filter(d => d.step == 1)
      console.log("enter", dataToShow)
      updateGraph(dataToShow)
    },
    exit: function (el) {
      let dataToShow = data.filter(d => d.step == 0)
      console.log("exit", dataToShow)
      updateGraph(dataToShow)
    },
    offset: 0.5, // enter at middle of viewport
  });


}

function setup() {
  const groupCenters = {
    'song1': { x: w / 2 - w / 4, y: h / 2 },
    'song2': { x: w / 2 + w / 4, y: h / 2 }
  };

  return groupCenters;
}

function updateGraph(dataToShow, step) {
  const song = dataToShow[0].song;
  const songData = dataToShow[0].songData;
  const nodes1 = songData[0].data.map(d => ({...d, group: 'song1'}));
  const nodes2 = songData[1].data.map(d => ({...d, group: 'song2'}));
  const combinedNodes = nodes1.concat(nodes2);

  // add a label for which song
  viz.selectAll(".song-label").remove();
  viz.append("text")
    .attr("class", "song-label")
    .text(song)
    .attr("x", w / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle");
  
  const groupCenters = setup();

  let nodes = viz.selectAll(".seagull")
    .data(combinedNodes, d => d.id + d.group);

  let opacityScale = d3.scaleLinear().domain([50, 25, 1]).range([0.2, 0.2, 1]);
  let sizeScale = d3.scaleLinear().domain([50, 25, 1]).range([30, 30, 50]);

  nodes.enter()
    .append("svg:image")
      .attr("xlink:href", d => d.album_name.includes("(Taylor's Version)") ? "gull-1.svg" : "gull-2.svg")
      .attr("width", d => sizeScale(d.daily_rank))
      .attr("height", d => sizeScale(d.daily_rank))
      .attr("class", "seagull")
      .attr("opacity", d => opacityScale(d.daily_rank))
      .attr("x", d => groupCenters[d.group].x) // Start off-screen left or right
      .attr("y", d => groupCenters[d.group].y) // Start in the middle vertically
    .merge(nodes)
    .transition() // Transition to Step 2 positions
      .attr("x", d => groupCenters[d.group].x)
      .attr("y", d => groupCenters[d.group].y);

  nodes.exit().remove();

  // add labels or taylor's version and original
  viz.selectAll(".version-label").remove();
  viz.append("text")
    .attr("class", "version-label")
    .text("Original")
    .attr("x", groupCenters.song1.x - 20)
    .attr("y", h - 50)

  viz.append("text")
    .attr("class", "version-label")
    .text("Taylor's Version")
    .attr("x", groupCenters.song2.x - 20)
    .attr("y", h - 50)
    .attr("text-anchor", "end");

  sim.nodes(combinedNodes)
    .force("x", d3.forceX(d => groupCenters[d.group].x))
    .force("y", d3.forceY(d => groupCenters[d.group].y))
    .alpha(1)
    .restart()
    .on("tick", ticked);

}


function ticked() {
  viz.selectAll(".seagull")
    .attr("x", d => d.x)
    .attr("y", d => d.y);
}


// load data
d3.csv("taylorSwift1989.csv").then(gotData);