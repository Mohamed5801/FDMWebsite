class itemPreview {
  constructor(albumId,id,title, url) {
    this.albumId = albumId;
    this.id = id;
    this.title = title;
    this.url;
  }
}

window.onload=createGrid(searchEnable);



function searchEnable() {
  document.getElementById("searchButton").disabled = false;
}

async function loadItems(num) {
  var img = new itemPreview();

  img.url= await (fetch('https://jsonplaceholder.typicode.com/photos')
      .then(response => response.json())
      .then(json => json[num].thumbnailUrl));

  img.albumId= await (fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then(json => json[num].albumId));

  img.id= await (fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then(json => json[num].id));

  img.title= await (fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then(json => json[num].title));

  return img;
}

async function createGrid(callback) {


  var galNum=1;
  const gallery = "gallery";
  for (let i = 0;i < 20;i++) {

    var item = await loadItems(i);
    var src = document.getElementById(gallery.concat("" + galNum));
    if (galNum < 3) {galNum++;}
    else {galNum =1;}

    var itemContainer = document.createElement("div");
    itemContainer.style.cssText = "height:300px"
    src.appendChild(itemContainer);

    var title = document.createElement("h5");
    var textTitle = document.createTextNode(item.title)
    title.appendChild(textTitle);
    itemContainer.appendChild(title);

    var img = document.createElement("img");
    img.src = item.url;
    itemContainer.appendChild(img);

    var albumId = document.createElement("p");
    var text = document.createTextNode(item.albumId)
    albumId.appendChild(text);
    itemContainer.appendChild(albumId);

    var id = document.createElement("p");
    var textId = document.createTextNode(item.id)
    albumId.appendChild(textId);
    itemContainer.appendChild(id);
  }
  callback();
}

function searchTerms(item, searchTerms, galNum) {
  const gallery = "gallery";
  if (item.title.includes(searchTerms)) {

      var src = document.getElementById(gallery.concat("" + galNum));

      if (galNum < 3) {galNum++;}
      else {galNum =1;}

      var itemContainer = document.createElement("div");
      itemContainer.style.cssText = "height:300px"
      src.appendChild(itemContainer);

      var title = document.createElement("h5");
      var textTitle = document.createTextNode(item.title)
      title.appendChild(textTitle);
      itemContainer.appendChild(title);

      var img = document.createElement("img");
      img.src = item.url;
      itemContainer.appendChild(img);

      var albumId = document.createElement("p");
      var text = document.createTextNode(item.albumId)
      albumId.appendChild(text);
      itemContainer.appendChild(albumId);

      var id = document.createElement("p");
      var textId = document.createTextNode(item.id)
      albumId.appendChild(textId);
      itemContainer.appendChild(id);
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
