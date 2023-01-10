// Cart recovery from the local storage
const cart = JSON.parse(localStorage.getItem("Canape"));
console.log(cart);

let totalPrice = 0;

//empty and full cart management
if (cart === null || cart.length === 0) {
  document.getElementsByTagName("h1")[0].innerHTML = "Votre panier est vide";
} else {
  fetchProductsInCart();
  //total quantity
  const totalQuantities = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  document.getElementById("totalQuantity").innerHTML = totalQuantities;
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

function fetchProductsInCart() {
  for (const element of cart) {
    // Look at the product on the local Storage
    fetch("http://localhost:3000/api/products/" + element._id) // Get the informations of this products from the API
      .then((response) => response.json())
      .then((productInCart) => {
        displayProduct(productInCart, element.color, element.quantity);
        totalPrice += productInCart.price * element.quantity;
        document.getElementById("totalPrice").innerHTML = totalPrice;
      });
  }
}
