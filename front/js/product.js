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
    document.getElementById("description").innerHTML = `${productInformation.description}`;
  })

  .catch((err) => {
    document.getElementById("items").innerHTML =
      "Une erreur est survenue(${err})";
  });
