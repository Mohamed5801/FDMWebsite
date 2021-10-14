class itemPreview {
  constructor(albumId,id,title, url) {
    this.albumId = albumId;
    this.id = id;
    this.title = title;
    this.url;
  }
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

async function createGrid() {
  var galNum=1;
  const gallery = "gallery";
  for (let i = 0;i < 20;i++) {

    var item = await loadItems(i);
     var src = document.getElementById(gallery.concat("" + galNum));
    if (galNum < 3) {
      galNum++;
    }
    else {
      galNum =1;
    }
    console.log(galNum);

    var title = document.createElement("h5");
    var textTitle = document.createTextNode(item.title)
    title.appendChild(textTitle);
    src.appendChild(title);

    var img = document.createElement("img");
    img.src = item.url;
    src.appendChild(img);

    var albumId = document.createElement("p");
    var text = document.createTextNode(item.albumId)
    albumId.appendChild(text);
    src.appendChild(albumId);

    var id = document.createElement("p");
    var textId = document.createTextNode(item.id)
    albumId.appendChild(textId);
    src.appendChild(id);


  }
}
createGrid();
