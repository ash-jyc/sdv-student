function createSquares() {
    var num = document.getElementById("num").value;
    for (var i = 0; i < num; i++) {
        var square = document.createElement("div");
        square.id = "square";
        document.getElementById("boxes").appendChild(square);    
        eatSquares(square);
    }
}

function eatSquares(square) {
    square.addEventListener("click", function(event) {
        if (event.target.style.backgroundColor == "black") {
            event.target.style.backgroundColor = "white";
        } else {
            event.target.style.backgroundColor = "black";
        }
    });
}