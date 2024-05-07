import "../../d3.v7.min.js";

let w = 900;
let h = 900;

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "lavender")
  ;

function gotData(incomingDatasets) {
  console.log(incomingDatasets)
  let christmas = incomingDatasets[0]
  let eid = incomingDatasets[1]
  let christmasData = christmas.chart.seriesData[1].data.map(d=>{
    d.season = "xmas";
    return d
  });
  let eidData = eid.chart.seriesData[1].data.map(d=>{
    d[2] = "eid";
    return d
  });
  console.log(christmasData);
  console.log(eidData);
  let groupedByDay = d3.groups(christmasData.concat(eidData), d=>d[0])
  console.log(groupedByDay)


  // format time
  function mapFunction(d, i) {
    let time = new Date(d[0]);
    let value = d[1];
    return { time: time, value: value };
  }

  let mappedDataChristmas = christmasData.map(mapFunction);
  console.log(mappedDataChristmas);
  let mappedDataEid = eidData.map(mapFunction);
  console.log(mappedDataEid)


  // get years
  const christmasGroup = d3.groups(mappedDataChristmas, d => d.time.getFullYear()).slice(1);
  const eidGroup = d3.groups(mappedDataEid, d => d.time.getFullYear()).slice(1);

  console.log("original groups")
  console.log(christmasGroup)
  console.log(eidGroup)
  let years = []
  console.log(christmasGroup[0][1])
  for (let i=0; i<christmasGroup.length; i++) {
    let curYear = christmasGroup[i][0]
    let data1 = christmasGroup[i][1]
    let data2 = eidGroup[i][1]
    let element = [curYear, [data1, data2]]
    years.push(element)
  }
  console.log(years);

  // get min and max values
  let minChristmas = d3.min(mappedDataChristmas, function (d) {
    return d.value;
  });
  let maxChristmas = d3.max(mappedDataChristmas, function (d) {
    return d.value;
  });
  let minEid = d3.min(mappedDataEid, function(d) {
    return d.value;
  })
  let maxEid = d3.max(mappedDataEid, function(d) {
    return d.value
  })

  // helper functions
  const cellSize = 15
  const yearHeight = cellSize * 7 + 25
  const formatDay = d => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getUTCDay()]
  const countDay = d => d.getUTCDay()
  const timeWeek = d3.utcSunday
  const year = viz.selectAll('g')
    .data(years)
    .join('g')
    .attr('transform', (d, i) => `translate(40, ${yearHeight * i + cellSize * 1.5})`);

  // append year
  year.append('text')
    .attr('x', -5)
    .attr('y', -30)
    .attr("text-anchor", "end")
    .attr('font-size', 16)
    .attr('font-weight', 550)
    .attr('transform', 'rotate(270)')
    .text(d => d[0]);

  // append day of week
  year.append('g')
    .attr('text-anchor', 'end')
    .selectAll('text')
    .data(d3.range(7).map(i => new Date(1999, 0, i)))
    .join('text')
    .attr('x', -5)
    .attr('y', d => (countDay(d) + 0.5) * cellSize)
    .attr('dy', '0.31em')
    .text(formatDay);

  const colorFn = d3.scaleSequential(d3.interpolateBuGn).domain([minChristmas, maxChristmas])
  // const colorFnEid = d3.scaleSequential(d3.interpolateOrRd).domain([minEid, maxEid])
  const colorFnEid = d3.scaleLinear().domain([0, 85000, 85000 , maxEid]).range(["white", "white", "red", "red"])

  // append rects
  year.append('g')
    .selectAll('rect')
    .data(d => d[1][0])
    .join('rect')
    .attr("width", cellSize - 1.5)
    .attr("height", cellSize - 1.5)
    .attr("x", d => timeWeek.count(d3.utcYear(d.time), d.time) * cellSize + 10)
    .attr("y", d => countDay(d.time) * cellSize + 0.5)
    .attr("fill", d => colorFn(d.value))
  
  year
    .selectAll('rect')
    .data(d => d[1][1])
    .join('rect')
    .attr("width", cellSize - 1.5)
    .attr("height", cellSize - 1.5)
    .attr("x", d => timeWeek.count(d3.utcYear(d.time), d.time) * cellSize + 10)
    .attr("y", d => countDay(d.time) * cellSize + 0.5)
    .attr("fill", d => colorFnEid(d.value))
    

  

}


Promise.all([
  d3.json("./data/Mariah-Carey-All-I-Want-for-Christmas-Is-You-Spotify.json"),
  d3.json("./data/Umm-Kulthum-Ya-Leilet-El-Eid-Spotify.json")
]).then(gotData);
