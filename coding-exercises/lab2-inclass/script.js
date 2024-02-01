import data from "./Wikipedia-World-Statistics-2023.json" assert {type: 'json'}

document.addEventListener("DOMContentLoaded", (event) => {
    const filterButton = document.querySelector('#filterButton');
    filterButton.addEventListener('click', filterDataBy);
});

function filterDataBy() {
    let df = document.getElementById("dataFilter").value;

    let vizContainer = document.querySelector("#vizContainer");

    let title = document.createElement("h1");
    title.className = "title";
    title.innerText = df + " per Population_2023";
    vizContainer.appendChild(title);

    data.forEach(d => {
        let newDiv = document.createElement("div");
        newDiv.className = "bar";

        let widthPercentage = d[df] / d.Population_2023;
        newDiv.style.width = (10 + widthPercentage * 80) + "%";

        let label = document.createElement("p");
        label.className = "label";
        label.innerText = d.Country;
        newDiv.appendChild(label);

        vizContainer.appendChild(newDiv);
    });

    console.log(data);
}