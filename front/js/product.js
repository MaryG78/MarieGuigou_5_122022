// Get the products' ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");

// Get the products' datas
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((productInformation) => {
    console.log(productInformation);

    //image
    document.querySelector(
      ".item__img"
    ).innerHTML = `<img src="${productInformation.imageUrl}" alt="${productInformation.altTxt}"> `;
    //Name
    document.getElementById("title").innerHTML = `${productInformation.name}`;
    //Price
    document.getElementById("price").innerHTML = `${productInformation.price}`;
    //Description
    document.getElementById(
      "description"
    ).innerHTML = `${productInformation.description}`;
    //Colors
    let optionColors = productInformation.colors;
    optionColors.forEach((element) => {
      let color = document.createElement("option");
      color.value = element;
      color.innerText = element;
      document.getElementById("colors").appendChild(color);
    });
    //Page's title
    document.getElementsByTagName(
      title
    ).innerHTML = `${productInformation.name}`;

    /*let optionColors = productInformation.colors;
    let item_colors = document.getElementById("colors");
    optionColors.forEach(function(element, key){
        item_colors[key] = new Option(element,);
    })
    console.log(optionColors)*/
  })

  .catch((err) => {
    document
      .getElementById("items")
      .insertAdjacentHTML("beforebegin", "Une erreur est survenue(${err})");
  });
