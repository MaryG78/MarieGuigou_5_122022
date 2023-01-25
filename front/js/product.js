// Get the products' ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");

// Get the products' datas
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((productInformation) => {
    renderProduct(productInformation);
    onClickButton(productInformation.name);
  })
  .catch((err) => {
    document
      .getElementById("items")
      .insertAdjacentHTML("beforebegin", `Une erreur est survenue(${err})`);
  });

let setErrors = (quantity, color) => {
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
};

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

function onClickButton(name) {
  document
    .querySelector("#addToCart")
    .addEventListener("click", function () // Recovery of form datas onclick
    {
      let quantityStorage = parseInt(document.getElementById("quantity").value); // Get the selected quantity
      let colorStorage = document.getElementById("colors").value; // Get the selected color

      if (setErrors(quantityStorage, colorStorage)) {
        return;
      }

      // Creating options of new product on local storage
      let productOptions = {
        _id: productId,
        color: colorStorage,
        quantity: quantityStorage,
      };
      addToCart(productOptions, name);
    });
}

function addToCart(productOptions, name) {
  /*SAVE KEYS AND VALUES OF THE LOCAL STORAGE
   *Send products in the productInLocalStorage array then save in the localStorage
   *Search if a product is already present
   *If a product is already present only the quantity is updated
   */
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
function setSuccessMessage(name) {
  let p = document.getElementsByClassName("item__content__addButton")[0];
  p.insertAdjacentHTML("afterend",`<div> ${name} a été ajouté au panier.</div>`);
  
  //document.querySelector(".item__content").lastChild.style.backgroundColor = "red"
}




function getCart() {
  let cart = localStorage.getItem("Canape");
  if (cart) {
    return JSON.parse(cart);
  } else {
    return [];
  }
}
