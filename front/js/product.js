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
    //Page's title
    document.getElementsByTagName(
      "title"
    ).textContent = `${productInformation.name}`;
    //Colors
    let optionColors = productInformation.colors;
    optionColors.forEach((element) => {
      let color = document.createElement("option");
      color.value = element;
      color.innerText = element;
      document.getElementById("colors").appendChild(color);
    });

    /*let optionColors = productInformation.colors;
    let item_colors = document.getElementById("colors");
    optionColors.forEach(function(element, key){
        item_colors[key] = new Option(element,);
    })
    console.log(optionColors)*/

    // LOCAL STORAGE
    // Recovery of form datas onclick
    document.querySelector("#addToCart").addEventListener("click", function () {
      let quantityStorage = document.getElementById("quantity").value;
      let colorsStorage = document.getElementById("colors").value;

      let LocalStorageDatas = {
        idKanapStorage: productId,
        colorsKanapStorage: colorsStorage,
        quantityKanapStorage: quantityStorage,
      };
      if (
        colorsStorage == null ||
        colorsStorage === "" ||
        quantityStorage == 0
      ) {
        alert("Please select a color and a quantity");
        return;
      }
      // Get a product from the local storage
      let productStorage = JSON.parse(localStorage.getItem("productBasket"));
      // Add a product in the local storage
      let addProductLocalStorage = () => {
        productStorage.push(LocalStorageDatas);
        localStorage.setItem("productBasket", JSON.stringify(productStorage));
      };
      //confirmation window
      let popupConfirmation = () => {
        if (
          window.confirm(
            `${productInformation.name} a été ajouté au panier. Consulter le panier OK ou revenir à l'accueil ANNULER`
          )
        ) {
          window.location.assign("cart.html");
        } else {
          window.location.assign("index.html");
        }
      };

      // if their is a product in local storage, push it in json format
      if (productStorage) {
        addProductLocalStorage();
        popupConfirmation();
      }
      // if their's no product in local storage, create an array and push it
      else {
        productStorage = [];
        addProductLocalStorage();
        popupConfirmation();
      }
    });
  })

  .catch((err) => {
    document
      .getElementById("items")
      .insertAdjacentHTML("beforebegin", "Une erreur est survenue(${err})");
  });
