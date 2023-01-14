const productInLocalStorage = getCart();
console.log(productInLocalStorage);
sort(); // Grouping of sofas by id in the cart display

//Get datas from the API
function fetchProductsInCart() {
  // Look at the product on the local Storage
  for (const element of productInLocalStorage) {
    fetch("http://localhost:3000/api/products/" + element._id) // Get the informations of this products from the API
      .then((response) => response.json())
      .then((productInCart) => {
        displayProduct(productInCart, element.color, element.quantity); // display of cart items
      })

      .catch((err) => {
        document
          .getElementsByTagName("h1")[0]
          .insertAdjacentHTML("beforebegin", `Une erreur est survenue(${err})`);
      });
  }
}

//empty and full cart management
if (productInLocalStorage === null || productInLocalStorage.length === 0) {
  document.getElementsByTagName("h1")[0].innerHTML = "Votre panier est vide";
} else {
  fetchProductsInCart(); // display of cart items
  getTotalQuantity(); // Insert total quantity of product
  getTotalPrice(); // Insert total price
}

// display of cart items
function displayProduct(product, colors, quantity) {
  document.getElementById("cart__items").innerHTML += `
       <article class="cart__item" data-id="${product._id}" data-color="${colors}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${colors}</p>
                    <p>${product.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
          `;
}
// Cart recovery from the local storage
function getCart() {
  let cart = localStorage.getItem("Canape");
  if (cart) {
    return JSON.parse(cart);
  } else {
    return [];
  }
}

//total price
function getTotalPrice() {
  let totalPrice = 0;
  productInLocalStorage.forEach((e) => {
    fetch("http://localhost:3000/api/products/" + e._id)
      .then((response) => response.json())
      .then((datas) => {
        console.log(datas);
        totalPrice += datas.price * e.quantity;
        document.getElementById("totalPrice").innerHTML = totalPrice;
      });
  });
}

//total quantity
function getTotalQuantity() {
  const totalQuantities = productInLocalStorage.reduce(
    (total, item) => total + item.quantity,
    0
  );
  document.getElementById("totalQuantity").innerHTML = totalQuantities;
}

deleteItem();
//delete items
function deleteItem() {
  let deleteButton = document
    .querySelectorAll(".deleteItem")
    .closest(".cart__item"); // select all the delete buttons
  let clickedItem = deleteButton.closest(".cart__item"); // find the node parent of the delete button clicked
  // let clickedItem = document.querySelector(".cart__item").parentElement.closest(deleteButton);
  deleteButton.forEach((button) => {
    addEventListener("click", () => {
      let clickedItemId = clickedItem.dataset;
      let itemToDelete = productInLocalStorage.find(
        (element) => element._id == dataset.id && element.color == dataset.color
      );
      console.log(itemToDelete);
    });
  });
}

// Change quantity
let quantityToChange = parseInt(
  document.getElementsByClassName("itemQuantity").value
);
let itemQuantity = document.querySelector(".itemQuantity");
itemQuantity.addEventListener("input", () =>
  changeQuantity(productInLocalStorage._id, quantityToChange)
);

function changeQuantity(_id, quantityToChange, productInLocalStorage) {
  newQuantity = productInLocalStorage.find(
    (element) => element._id == productInLocalStorage._id
  );
  if (duplicatedItems != undefined) {
    newQuantity.quantity = quantityToChange;
  }
  if (duplicatedItems.quantity <= 0) {
    deleteItem(duplicatedItems); // fonction de suppression
  }
  localStorage.setItem("Canape", JSON.stringify(productInLocalStorage));
  getTotalQuantity();
  getTotalPrice();
}

//Grouping of sofas by id in the cart display
function sort() {
  productInLocalStorage.sort((a, b) => (a._id < b._id ? -1 : 1));
}
console.log(productInLocalStorage);
