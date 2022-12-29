// Get the products' ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");

// Get the products' datas
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((productInformation) => {
    console.log(productInformation);

    //display image
    document.querySelector(
      ".item__img"
    ).innerHTML = `<img src="${productInformation.imageUrl}" alt="${productInformation.altTxt}"> `;
    //display name
    document.getElementById("title").innerHTML = `${productInformation.name}`;
    // display price
    document.getElementById("price").innerHTML = `${productInformation.price}`;
    //display description
    document.getElementById(
      "description"
    ).innerHTML = `${productInformation.description}`;
    //display Page's title
    let title = document.querySelector("title");
    title.innerText = `${productInformation.name}`;
    //display colors
    let optionColors = productInformation.colors;
    optionColors.forEach((element) => {
      let color = document.createElement("option");
      color.value = element;
      color.innerText = element;
      document.getElementById("colors").appendChild(color);
    });

    // Recovery of form datas onclick
    document.querySelector("#addToCart").addEventListener("click", function () {
      let quantityStorage = parseInt(document.getElementById("quantity").value); // Get the selected quantity
      let colorsStorage = document.getElementById("colors").value; // Get the selected color

      // Creating new product
      let productOptions = {
        idKanapStorage: productId,
        colorsKanapStorage: colorsStorage,
        quantityKanapStorage: quantityStorage,
      };
      //error message if quantity or color is missing
      if (
        colorsStorage == null ||
        colorsStorage === "" ||
        quantityStorage == 0
      ) {
        alert("Please select a color and a quantity");
        return;
      }

      //add to cart confirmation window 
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
      /*ENREGISTRER LES CLES ET VALEURS DU LOCAL STORAGE
       *Envoie les produits dans le tableau productInLocalStorage puis enregistre dans le localStorage
       *Recherche si un produit est déjà présent
       *Si un produit est déjà présent seule la quantité est mise à jour
       */
      let productInLocalStorage = JSON.parse(localStorage.getItem("Canape"));
      if (productInLocalStorage == null) {
        productInLocalStorage = [];
        productInLocalStorage.push(productOptions);
        localStorage.setItem("Canape", JSON.stringify(productInLocalStorage));
        popupConfirmation();
      } else {
        const duplicatedItems = productInLocalStorage.find(
          (element) =>
            element.idKanapStorage == productOptions.idKanapStorage &&
            element.colorsKanapStorage == productOptions.colorsKanapStorage
        );

        if (duplicatedItems == undefined) {
          productInLocalStorage.push(productOptions);
          localStorage.setItem("Canape", JSON.stringify(productInLocalStorage));
          popupConfirmation();
        } else {
          duplicatedItems.quantityKanapStorage +=
            productOptions.quantityKanapStorage;
          localStorage.setItem("Canape", JSON.stringify(productInLocalStorage));
          popupConfirmation();
        }
      }
    });
  })
  .catch((err) => {
    document
      .getElementById("items")
      .insertAdjacentHTML("beforebegin", "Une erreur est survenue(${err})");
  });
