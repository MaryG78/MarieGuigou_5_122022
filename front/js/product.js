// Get the products' ID from the page URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");

/* Get the product informations from the product ID with a fetch method
 ** Display the product informations with the renderProduct function
 ** Creation of the new product options in local storage and addition in the cart with the function onClickAddToCart
 ** If an error occurs, diplay an error message.
 */
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((productInformation) => {
    renderProduct(productInformation);
    onClickAddToCart(productInformation.name);
  })
  .catch((err) => {
    document
      .getElementById("items")
      .insertAdjacentHTML("beforebegin", `Une erreur est survenue(${err})`);
  });

function renderProduct(productInformation) {
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
}

/*Get the datas of the selected product when clicking on the "Add to cart" button.
 ** If no errors, creation of the new product options in local storage
 ** add the product to cart
 */
function onClickAddToCart(name) {
  document
    .querySelector("#addToCart")
    .addEventListener("click", function () // Recovery of form datas onclick
    {
      let quantityStorage = parseInt(document.getElementById("quantity").value); // Get the selected quantity
      let colorStorage = document.getElementById("colors").value; // Get the selected color

      if (setErrors(quantityStorage, colorStorage)) {
        return;
      }

      let productOptions = {
        _id: productId,
        color: colorStorage,
        quantity: quantityStorage,
      };
      addToCart(productOptions, name);
    });
}

function setErrors(quantity, color) {
  //error message if quantity & color is missing
  if ((quantity < 1 || quantity > 100) && (color === null || color === "")) {
    alert("Please select a color and a quantity");
    return true;
  }
  //error message if quantity is missing
  if (quantity < 1 || quantity > 100) {
    alert("Please select a quantity between 1 and 100");
    return true;
  }
  //error message if color is missing
  if (color == null || color === "") {
    alert("Please select a color");
    return true;
  }
  return false;
}

/* Search if the product exists
 ** if a product exists update his quantity
 ** else add a new item to the local storage.
 */
function addToCart(productOptions, name) {
  const productInLocalStorage = getCart();
  const duplicatedItems = productInLocalStorage.find(
    (element) =>
      element._id == productOptions._id && element.color == productOptions.color
  );

  if (duplicatedItems == undefined) {
    productInLocalStorage.push(productOptions);
  } else {
    duplicatedItems.quantity += productOptions.quantity;
  }
  localStorage.setItem("Canape", JSON.stringify(productInLocalStorage));
  setSuccessMessage(name);
}

// display a success message when adding a product to the cart and provide a link to the cart page.
function setSuccessMessage(name) {
  let successMessage = document.getElementById("success_message");

  if (successMessage === null) {
    let p = document.getElementsByClassName("item__content__addButton")[0];
    p.insertAdjacentHTML(
      "afterend",
      `<div id = "success_message"> <p> ${name} a été ajouté au panier. Cliquez <a href = "./cart.html"> ici </a> pour accéder au panier</p></div>`
    );
  }
}

// Get items from local storage or an empty array
function getCart() {
  let cart = localStorage.getItem("Canape");
  if (cart) {
    return JSON.parse(cart);
  } else {
    return [];
  }
}
