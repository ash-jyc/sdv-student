/**
 * Manga with more than 20000 members with scores
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

let viz = d3.select("#viz-container")
            .append("svg")
                .attr("id", "viz")
                .attr("width", 1000)
                .attr("height", 1000)
;

let maxScore = 0;
let minScore = 10;
let scoreRange = 0;

function location(d, i) {
    return Math.random() * 1000;
}

function gotData(myData) {
    // console.log(myData); // by score

    let membersData = myData.filter((d) => {
        return d["Members"] >= 20000;
    });

    membersData.forEach(element => {
        console.log(element.Score)
        if (element.Score > maxScore) {
            maxScore = element.Score;
        }

        if (element.Score < minScore) {
            minScore = element.Score
        }

        scoreRange = maxScore - minScore;
    });

    console.log(scoreRange);
    viz.selectAll("circle").data(membersData).enter().append("circle")
                                                    .attr("cx", location)
                                                    .attr("cy", location)
                                                    .attr("r", (d) => {
                                                        return 2 + ((d["Score"] - minScore) / scoreRange * 30);
                                                    })
                                                    .attr("fill", () => {
                                                        let color1 = Math.random() * 255
                                                        let color2 = Math.random() * 255
                                                        let color3 = Math.random() * 255
                                                        return "rgb(" + color1 + ", " + color2 + ", " + color3 + ")"
                                                    });
    ;
}

d3.json("manga.json").then(gotData);