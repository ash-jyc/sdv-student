import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 900;
let h = 400;

let vizContainer = d3.select("#viz4");
let viz = vizContainer
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + w + " " + h)
  ;

// add simulation
let sim = d3.forceSimulation()
  .force("x", d3.forceX(w / 2))
  .force("y", d3.forceY(h / 2))
  .force("collide", d3.forceCollide(9))
  .force("charge", d3.forceManyBody().strength(0.5))
  .alphaDecay(0.01)

// add group centers
const groupCenters = {
  'song1': { x: w / 2 - w / 4, y: h / 2 },
  'song2': { x: w / 2 + w / 4, y: h / 2 }
};

viz.append("text")
    .attr("class", "version-label")
    .text("Original")
    .attr("text-anchor", "middle") // Center the text
    .attr("x", groupCenters.song1.x)
    .attr("y", h - h/50)
    .attr("fill", "white");

viz.append("text")
    .attr("class", "version-label")
    .text("Taylor's Version")
    .attr("text-anchor", "middle") // Center the text
    .attr("x", groupCenters.song2.x)
    .attr("y", h - h/50)
    .attr("fill", "white");


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
    selector: '.viz4-step2',
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

function updateGraph(dataToShow, step) {
  const song = dataToShow[0].song;
  const songData = dataToShow[0].songData;
  const nodes1 = songData[0].data.map(d => ({
    ...d, 
    group: 'song1',
    x: groupCenters.song1.x,
    y: groupCenters.song1.y
  }));
  const nodes2 = songData[1].data.map(d => ({
    ...d, 
    group: 'song2',
    x: groupCenters.song2.x,
    y: groupCenters.song2.y
  }));
  const combinedNodes = nodes1.concat(nodes2);
  console.log("combinedNodes", combinedNodes)

  // add a label for which song
  viz.selectAll(".song-label").remove();
  viz.append("text")
    .attr("class", "song-label")
    .text(song)
    .attr("x", w / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    // color white
    .attr("fill", "white");
  
  // console.log(dataToShow)
  let nodes = viz.selectAll(".seagull")
    .data(combinedNodes, d => d.id + d.group);

  let opacityScale = d3.scaleLinear().domain([50, 25, 1]).range([0.5, 0.5, 1]);
  let sizeScale = d3.scaleLinear().domain([50, 25, 1]).range([7, 7, 20]);


  nodes.enter()
    .append("circle")
      .attr("r", d => sizeScale(d.daily_rank))
      .attr("class", "seagull")
      .attr("fill", d => d.group === "song1" ? "magenta" : "cyan")
      // .attr("fill", d => d.group === "song1" ? "#b88ea2" : "#8eacb8")
      .attr("opacity", d => opacityScale(d.daily_rank));

  let radius = 130;
  viz.append("circle")
    .attr("class", "group-circle")
    .attr("cx", groupCenters.song1.x)
    .attr("cy", groupCenters.song1.y)
    .attr("r", radius)
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-dasharray", "5,5")
    .attr("opacity", 0.5);

  viz.append("circle")
    .attr("class", "group-circle")
    .attr("cx", groupCenters.song2.x)
    .attr("cy", groupCenters.song2.y)
    .attr("r", radius)
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-dasharray", "5,5")
    .attr("opacity", 0.5);
  // remove nodes that are not in the data
  nodes.exit().remove();

  // add labels or taylor's version and original
// Correct text-anchor and alignment

// Assuming groupCenters are correctly calculated to center the nodes
  sim.nodes(combinedNodes)
    .force("x", d3.forceX(d => groupCenters[d.group].x))
    .force("y", d3.forceY(d => groupCenters[d.group].y))
    .on("tick", ticked)
    .alpha(1)
    .restart();

}


function ticked() {
  viz.selectAll(".seagull")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
}


// load data
d3.csv("../viz4-taylor-swift/taylorSwift1989.csv").then(gotData);