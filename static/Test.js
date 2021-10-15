class itemPreview {
  constructor(colour,description,name, price, userId) {
    this.colour = colour;
    this.description = description;
    this.name = name;
    this.price = price;
    this.userId = userId;
  }
}

createGrid(searchEnable);

function searchEnable() {
  document.getElementById("searchButton").disabled = false;
}

async function loadItems(num) {

  var img = new itemPreview();
//  console.log(fetch('http://127.0.0.1:5000/products')
//        .then(response => response.json())
//        .then(json => json['products']));
//  console.log(fetch('http://127.0.0.1:5000/products')
  //      .then(response => response.json())
  //      .then(json => json['products'].Name));
  //console.log(fetch('http://127.0.0.1:5000/products')
  //      .then(response => response.json())
    //    .then(json => json['products'][0].Name));
    //    console.log(fetch('http://127.0.0.1:5000/products')
    //          .then(response => response.json())
      //        .then(json => json['products'][0]));
      //        console.log(fetch('http://127.0.0.1:5000/products')
      //              .then(response => response.json())
      //              .then(json => json['products'].Name[0]));
        //            console.log(fetch('http://127.0.0.1:5000/products')
        //                  .then(response => response.json())
        //                  .then(json => json.products));





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

console.log(img.colour);
console.log(img.name);
console.log(img.userId);

  return img;
}

async function createGrid(callback) {
  var galNum=1;
  const gallery = "gallery";
  for (let i = 0;i < 10;i++) {

    var item = await loadItems(i);
    var src = document.getElementById(gallery.concat("" + galNum));
    if (galNum < 3) {galNum++;}
    else {galNum =1;}

    var itemContainer = document.createElement("div");
    itemContainer.style.cssText = "height:300px"
    src.appendChild(itemContainer);

    var title = document.createElement("h5");
    var temp0 = ""
    var textTitle = document.createTextNode(item.name)
    title.appendChild(temp0.concat("Name: " , textTitle));
    itemContainer.appendChild(title);

    //var img = document.createElement("img");
  //  img.src = item.url;
  //  itemContainer.appendChild(img);

    var colour = document.createElement("p");
    var text = document.createTextNode(item.colour)
    var temp1 = "";
    colour.appendChild(temp1.concat("\nColour: ", text , "\n"));
    itemContainer.appendChild(colour);

    var description = document.createElement("p");
    var textId = document.createTextNode(item.description)
    var temp2="";
    description.appendChild(temp2.concat("Description: " , textId , "\n"));
    itemContainer.appendChild(description);

    var price = document.createElement("p");
    var priceTag = document.createTextNode(item.price)
    var temp3="";
    price.appendChild(temp3.concat("Price: " , priceTag , "$\n"));
    itemContainer.appendChild(price);

    var userId = document.createElement("p");
    var userID = document.createTextNode(item.userId)
    var temp4 = ""
    userId.appendChild(temp4.concat("Seller ID: " + userID));
    itemContainer.appendChild(userId);
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
      var temp0 = ""
      var textTitle = document.createTextNode(item.name)
      title.appendChild(temp0.concat("Name: " + textTitle + "\n"));
      itemContainer.appendChild(title);

      //var img = document.createElement("img");
    //  img.src = item.url;
    //  itemContainer.appendChild(img);

      var colour = document.createElement("p");
      var text = document.createTextNode(item.colour)
      var temp1 = "";
      colour.appendChild(temp1.concat("Colour: " + text + "\n"));
      itemContainer.appendChild(colour);

      var description = document.createElement("p");
      var textId = document.createTextNode(item.description)
      var temp2="";
      description.appendChild(temp2.concat("Description: " + textId + "\n"));
      itemContainer.appendChild(description);

      var price = document.createElement("p");
      var priceTag = document.createTextNode(item.price)
      var temp3="";
      price.appendChild(temp3.concat("Price: " + priceTag + "$\n"));
      itemContainer.appendChild(price);

      var userId = document.createElement("p");
      var userID = document.createTextNode(item.userId)
      var temp4 = ""
      userId.appendChild(temp4.concat("Seller ID: " + userID));
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
  for (var i=0;i<20;i++) {
    var items = await loadItems(i);
    galNum = searchTerms(items,terms,galNum);
  }

  callback();
}

async function colourCheck(isRed, callback) {
  document.getElementById("searchButton").disabled = true;
  document.getElementById("gallery1").innerHTML = "";
  document.getElementById("gallery2").innerHTML = "";
  document.getElementById("gallery3").innerHTML = "";

  var galNum=1;
  for (var i=0;i<20;i++) {
    var items = await loadItems(i);
    galNum = searchTerms(items,terms,galNum);
  }

  callback();
}
