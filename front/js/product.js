// Get the products' ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");

// Get the products' datas
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((productInformation) => {
    //display image
    document.querySelector(
      ".item__img"
    ).innerHTML = `<img src="${productInformation.imageUrl}" alt="${productInformation.altTxt}"> `;
    //display name
    document.getElementById("title").innerHTML = productInformation.name;
    // display price
    document.getElementById("price").innerHTML = productInformation.price;
    //display description
    document.getElementById("description").innerHTML =
      productInformation.description;
    //display Page's title
    let title = document.querySelector("title");
    title.innerText = productInformation.name;
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

      setErrors(quantityStorage, colorsStorage);

      // Creating new product
      let productOptions = {
        _id: productId,
        colors: colorsStorage,
        quantity: quantityStorage,
      };

      //add to cart confirmation window
      let popupConfirmation = () => {
        if (
          quantityStorage > 0 &&
          quantityStorage <= 100 &&
          colorsStorage !== null &&
          colorsStorage !== ""
        ) {
          window.confirm(`${productInformation.name} a été ajouté au panier.`);
        }
      };
      /*SAVE KEYS AND VALUES OF THE LOCAL STORAGE
       *Send products in the productInLocalStorage array then save in the localStorage
       *Search if a product is already present
       *If a product is already present only the quantity is updated
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
            element._id == productOptions._id &&
            element.colors == productOptions.colors
        );

        if (duplicatedItems == undefined) {
          productInLocalStorage.push(productOptions);
          localStorage.setItem("Canape", JSON.stringify(productInLocalStorage));
          popupConfirmation();
        } else {
          duplicatedItems.quantity += productOptions.quantity;
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

let setErrors = (quantityStorage, colorsStorage) => {
  //error message if quantity is missing
  if (quantityStorage == 0 || quantityStorage > 100) {
    alert("Please select a quantity between 1 and 100");
    return;
  }
  //error message if color is missing
  if (colorsStorage == null || colorsStorage === "") {
    alert("Please select a color");
    return;
  }
};
