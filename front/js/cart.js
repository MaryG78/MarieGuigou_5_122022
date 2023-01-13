const productInLocalStorage = getCart();
console.log(productInLocalStorage);

//Get datas

function fetchProductsInCart() {
  for (const element of productInLocalStorage) {
    // Look at the product on the local Storage
    fetch("http://localhost:3000/api/products/" + element._id) // Get the informations of this products from the API
      .then((response) => response.json())
      .then((productInCart) => {
        displayProduct(productInCart, element.color, element.quantity);
        console.log(productInCart)
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
  fetchProductsInCart();
  getTotalQuantity();
  getTotalPrice();
}

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

function getTotalPrice() {
  productInLocalStorage.forEach((e) => {
    fetch("http://localhost:3000/api/products/" + e._id)
      .then((response) => response.json())
      .then((datas) => {
        console.log(datas);
        let totalPrice = 0;
        for (let item in datas) {
          console.log("ici" + e.quantity);
          totalPrice += datas.price * e.quantity;
          document.getElementById("totalPrice").innerHTML = totalPrice;
        }
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


let clickedItem = document.querySelector(".cart__item");
let clickedItemId = clickedItem.dataset
console.log("mon id" + clickedItemId)

// const searchItem = productInLocalStorage.find (
//   (element) => element._id == clickedItem.dataset.id
// );




//delete items
// function deleteItem() {
//   document.querySelector(".deleteItem").addEventListener("click", () => {
//     const itemToDelete = productInLocalStorage.find(
//       (element) => element._id == dataset.id
//     );
//     return itemToDelete;
//   });
// }

function changeQuantity() {
  document
    .querySelector("#itemQuantity")
    .addEventListener("change", function () {
      // Recovery of form datas onclick
      const duplicatedItems = productInLocalStorage.find(
        (element) => element._id == productInLocalStorage._id
      );
      if (duplicatedItems != undefined) {
        duplicatedItems.quantity += productInLocalStorage.quantity;
        if (duplicatedItems.quantity <= 0) {
          deleteItem(duplicatedItems); // fonction de suppression
        }
      }
      productInLocalStorage.push(duplicatedItems);
      localStorage.setItem("Canape", JSON.stringify(productInLocalStorage));
    });
}
