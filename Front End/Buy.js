window.onload = function() {
  makeRows(16, 16);

};





//function loadFunction() {
//  makeImageGrid(5);

//}

const container = document.getElementById("container");

function makeRows(rows, cols) {
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  for (c = 0; c < (rows * cols); c++) {
    let cell = document.createElement("div");
    cell.innerText = (c + 1);
    container.appendChild(cell).className = "grid-item";
  };
};



//function filter() {

//}

//function searchItems() {

//}
