class itemPreview {
  constructor(colour,description,name, price, userId) {
    this.colour = colour;
    this.description = description;
    this.name = name;
    this.price = price;
    this.userId = userId;
  }
}

window.onload=createGrid(searchEnable);

function searchEnable() {
  document.getElementById("searchButton").disabled = false;
}

async function loadItems(num) {
  var img = new itemPreview();

  img.colour= await (fetch('http://127.0.0.1:5000/products')
      .then(response => response.json())
      .then(json => json[num].Colour));

  img.description= await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json => json[num].Description));

  img.name= await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json => json[num].Name));

  img.price= await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json => json[num].Price));

  img.userId= await (fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(json => json[num].UserId));

  return img;
}

async function createGrid(callback) {
  var galNum=1;
  const gallery = "gallery";
  for (let i = 0;i < 1;i++) {

    var item = await loadItems(i);
    var src = document.getElementById(gallery.concat("" + galNum));
    if (galNum < 3) {galNum++;}
    else {galNum =1;}

    var itemContainer = document.createElement("div");
    itemContainer.style.cssText = "height:300px"
    src.appendChild(itemContainer);

    var title = document.createElement("h5");
    var textTitle = document.createTextNode(item.Name)
    title.appendChild(textTitle);
    itemContainer.appendChild(title);

    //var img = document.createElement("img");
  //  img.src = item.url;
  //  itemContainer.appendChild(img);

  //  var colour = document.createElement("p");
//    var text = document.createTextNode(item.Colour)
  //  colour.appendChild("Colour: " + text);
  //  itemContainer.appendChild(colour);

    var description = document.createElement("p");
    var textId = document.createTextNode(item.Description)
    description.appendChild("Description: "+textId+"\n");
    itemContainer.appendChild(description);

  //  var price = document.createElement("p");
//    var priceTag = document.createTextNode(item.Price)
//    price.appendChild("Price: "+priceTag+"$\n");
//    itemContainer.appendChild(price);

//    var userId = document.createElement("p");
//    var userID = document.createTextNode(item.Description)
//    userId.appendChild("User ID: "+userID);
//    itemContainer.appendChild(userId);
  }
  callback();
}

async function searchTerms(item, searchTerms, galNum) {
  const gallery = "gallery";
  if (item.title.includes(searchTerms)) {

      var src = document.getElementById(gallery.concat("" + galNum));

      if (galNum < 3) {galNum++;}
      else {galNum =1;}

      var item = await loadItems(i);
      var src = document.getElementById(gallery.concat("" + galNum));
      if (galNum < 3) {galNum++;}
      else {galNum =1;}

      var itemContainer = document.createElement("div");
      itemContainer.style.cssText = "height:300px"
      src.appendChild(itemContainer);

      var title = document.createElement("h5");
      var textTitle = document.createTextNode(item.Name)
      title.appendChild(textTitle);
      itemContainer.appendChild(title);

      //var img = document.createElement("img");
    //  img.src = item.url;
    //  itemContainer.appendChild(img);

//      var colour = document.createElement("p");
//      var text = document.createTextNode(item.Colour)
//      colour.appendChild("Colour: " + text);
//      itemContainer.appendChild(colour);

      var description = document.createElement("p");
      var textId = document.createTextNode(item.Description)
      description.appendChild("Description: "+textId+"\n");
      itemContainer.appendChild(description);

//      var price = document.createElement("p");
//      var priceTag = document.createTextNode(item.Price)
//      price.appendChild("Price: "+priceTag+"$\n");
//      itemContainer.appendChild(price);

      var userId = document.createElement("p");
      var userID = document.createTextNode(item.Description)
      userId.appendChild("User ID: "+userID);
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
  for (var i=0;i<1;i++) {
    var items = await loadItems(i);
    galNum = searchTerms(items,terms,galNum);
  }

  callback();
}
