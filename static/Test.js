class itemPreview {
  constructor(colour,description,name, price, userId) {
    this.colour = colour;
    this.description = description;
    this.name = name;
    this.price = price;
    this.userId = userId;
  }
}

async function getSize() {
  return await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json =>  Object.keys( json['products']).length));
}
var jsonSize = getSize();
console.log(jsonSize);
createGrid(searchEnable);

function searchEnable() {
  document.getElementById("searchButton").disabled = false;
}

async function loadItems(num) {

  var img = new itemPreview();

  img.description= await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json => json['products'][num].DEscription));

  img.name= await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json => json['products'][num].Name));

  img.price= await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json =>json['products'][num].Price));

  img.userId= await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json => json['products'][num].User_ID));

        img.colour= await (fetch('http://127.0.0.1:5000/products')
            .then(response => response.json())
            .then(json => json['products'][num].Colour));

  return img;
}

async function createGrid(callback) {
  var galNum=1;
  const gallery = "gallery";
  for (let i = 0;i < 30;i++) {

    var item = await loadItems(i);
    var src = document.getElementById(gallery.concat("" + galNum));
    if (galNum < 3) {galNum++;}
    else {galNum =1;}
    var temp0="";
    var temp1="";
    var temp2="";
    var temp3="";
    var temp4="";

    var itemContainer = document.createElement("div");
    itemContainer.style.cssText = "height:300px"
    src.appendChild(itemContainer);

    var title = document.createElement("h5");
    var textTitle = document.createTextNode(temp0.concat("Name: " , item.name));
    title.appendChild(textTitle);
    itemContainer.appendChild(title);

    var colour = document.createElement("p");
    var text = document.createTextNode(temp1.concat("\nColour: ", item.colour , "\n"));
    colour.appendChild(text);
    itemContainer.appendChild(colour);

    var description = document.createElement("p");
    var textId = document.createTextNode(temp1.concat("Description: ", item.description , "\n"));
    description.appendChild(textId);
    itemContainer.appendChild(description);

    var price = document.createElement("p");
    var priceTag = document.createTextNode(temp3.concat("Price: " , item.price , "$\n"));
    price.appendChild(priceTag);
    itemContainer.appendChild(price);

    var userId = document.createElement("p");
    var userID = document.createTextNode(temp4.concat("Seller ID: ", item.userId));
    userId.appendChild(userID);
    itemContainer.appendChild(userId);
  }
  callback();
}

async function searchTerms(item, searchTerms, galNum) {
  const gallery = "gallery";
  if (item.name.includes(searchTerms)||item.useId.includes(searchTerms)||item.description.includes(searchTerms)) {

    var src = document.getElementById(gallery.concat("" + galNum));
    if (galNum < 3) {galNum++;}
    else {galNum =1;}
    var temp0="";
    var temp1="";
    var temp2="";
    var temp3="";
    var temp4="";

    var itemContainer = document.createElement("div");
    itemContainer.style.cssText = "height:300px"
    src.appendChild(itemContainer);

    var title = document.createElement("h5");
    var textTitle = document.createTextNode(temp0.concat("Name: " , item.name));
    title.appendChild(textTitle);
    itemContainer.appendChild(title);

    var colour = document.createElement("p");
    var text = document.createTextNode(temp1.concat("\nColour: ", item.colour , "\n"));
    colour.appendChild(text);
    itemContainer.appendChild(colour);

    var description = document.createElement("p");
    var textId = document.createTextNode(temp1.concat("Description: ", item.description , "\n"));
    description.appendChild(textId);
    itemContainer.appendChild(description);

    var price = document.createElement("p");
    var priceTag = document.createTextNode(temp3.concat("Price: " , item.price , "$\n"));
    price.appendChild(priceTag);
    itemContainer.appendChild(price);

    var userId = document.createElement("p");
    var userID = document.createTextNode(temp4.concat("Seller ID: ", item.userId));
    userId.appendChild(userID);
    itemContainer.appendChild(userId);
    }
    return galNum;
}

async function searchColours(item, colour, galNum) {
  const gallery = "gallery";
  if (colour.includes(item.colour)) {

    var src = document.getElementById(gallery.concat("" + galNum));
    if (galNum < 3) {galNum++;}
    else {galNum =1;}
    var temp0="";
    var temp1="";
    var temp2="";
    var temp3="";
    var temp4="";

    var itemContainer = document.createElement("div");
    itemContainer.style.cssText = "height:300px"
    src.appendChild(itemContainer);

    var title = document.createElement("h5");
    var textTitle = document.createTextNode(temp0.concat("Name: " , item.name));
    title.appendChild(textTitle);
    itemContainer.appendChild(title);

    var colour = document.createElement("p");
    var text = document.createTextNode(temp1.concat("\nColour: ", item.colour , "\n"));
    colour.appendChild(text);
    itemContainer.appendChild(colour);

    var description = document.createElement("p");
    var textId = document.createTextNode(temp1.concat("Description: ", item.description , "\n"));
    description.appendChild(textId);
    itemContainer.appendChild(description);

    var price = document.createElement("p");
    var priceTag = document.createTextNode(temp3.concat("Price: " , item.price , "$\n"));
    price.appendChild(priceTag);
    itemContainer.appendChild(price);

    var userId = document.createElement("p");
    var userID = document.createTextNode(temp4.concat("Seller ID: ", item.userId));
    userId.appendChild(userID);
    itemContainer.appendChild(userId);
    }
    return galNum;
}


async function searchItems(terms, callback) {
  document.getElementById("searchButton").disabled = true;
  document.getElementById("gallery1").innerHTML = "";
  document.getElementById("gallery2").innerHTML = "";
  document.getElementById("gallery3").innerHTML = "";

  var galNum=1;
  for (var i=0;i<30;i++) {
    var items = await loadItems(i);
    galNum = searchTerms(items,terms,galNum);
  }

  callback();
}

async function colourCheck(callback) {
  document.getElementById("searchButton").disabled = true;
  document.getElementById("gallery1").innerHTML = "";
  document.getElementById("gallery2").innerHTML = "";
  document.getElementById("gallery3").innerHTML = "";

  var allColours = "";

  if (document.getElementById('redCheck').checked){
    allColours.concat("red");
  }
  if (document.getElementById('orangeCheck').checked){
    allColours.concat("orange");
  }
  if (document.getElementById('yellowCheck').checked){
    allColours.concat("yellow");
  }
  if (document.getElementById('greenCheck').checked){
    allColours.concat("green");
  }
  if (document.getElementById('blueCheck').checked){
    allColours.concat("blue");
  }
  if (document.getElementById('purpleCheck').checked){
    allColours.concat("purple");
  }


  var galNum=1;
  for (var i=0;i<30;i++) {
    var items = await loadItems(i);
    galNum = searchColours(items,allColours,galNum);
  }

  callback();
}
