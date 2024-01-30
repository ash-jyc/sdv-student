function createSquares() {
    var num = document.getElementById("num").value;
    for (var i = 0; i < num; i++) {
        var square = document.createElement("div");
        square.id = "square";
        document.getElementById("boxes").appendChild(square);    
    }
    eatSquares();
}

function eatSquares() {
    addEventListener("click", function(event) {
        if (event.target.id == "square") {
            event.target.style.backgroundColor = "black";
        }
    });
}