//Get datas from the API
function fetchProductsInCart() {
  // Look at the product on the local Storage
  getSortedCart().forEach((productInCart) => {
    fetch("http://localhost:3000/api/products/" + productInCart._id) // Get the informations of this products from the API
      .then((response) => response.json())
      .then((product) => {
        displayProduct(product, productInCart.color, productInCart.quantity); // display of cart items
        deleteItem();
        changeQuantity();
      })

      .catch((err) => {
        document
          .querySelector("h1")
          .insertAdjacentHTML("beforebegin", `Une erreur est survenue(${err})`);
      });
  });
}

setEmptyCart(); //empty cart management
fetchProductsInCart(); // display of cart items
getAndRenderTotalQuantity(); // Insert total quantity of product
getAndRenderTotalPrice(); // Insert total price

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

//Grouping sofas by id in the cart display
function getSortedCart() {
  const sortedCart = getCart().sort((a, b) => (a._id < b._id ? -1 : 1));
  return sortedCart;
}

//total price
function getAndRenderTotalPrice() {
  let totalPrice = 0;
  getCart().forEach((product) => {
    fetch("http://localhost:3000/api/products/" + product._id)
      .then((response) => response.json())
      .then((datas) => {
        totalPrice += datas.price * product.quantity;
        document.getElementById("totalPrice").innerHTML = totalPrice;
      });
  });
}

//total quantity
function getAndRenderTotalQuantity() {
  const totalQuantities = getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
  document.getElementById("totalQuantity").innerHTML = totalQuantities;
}

//delete items
function deleteItem() {
  let newCart = getCart();
  const deleteButtons = document.querySelectorAll(".deleteItem"); // select all the delete button
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // find the product to delete
      let removeItem = button.closest(".cart__item");
      let removeItemId = removeItem.dataset.id; 
      let removeItemColor = removeItem.dataset.color; 
      // select the product to delete
      let itemToDelete = newCart.find(
        (element) =>
          element._id == removeItemId && element.color == removeItemColor
      );
      if (itemToDelete) {
        //keep all the items of the cart exepted the clicked one
        newCart = newCart.filter((i) => i !== itemToDelete);
        console.log(newCart);
        // save the new cart in local storage
        localStorage.setItem("Canape", JSON.stringify(newCart));
        removeItem.remove(); // remove the item to delete
        setEmptyCart(); // message if the cart is empty
        getAndRenderTotalQuantity(); // uptade and render new quantity
        getAndRenderTotalPrice(); //uptade and render new total price
      }
    });
  });
}
//message if the cart is empty
function setEmptyCart() {
  if (getCart() === null || getCart().length === 0) {
    document.getElementsByTagName("h1")[0].innerHTML = "Votre panier est vide";
  }
}
// Change quantity
function changeQuantity() {
  //Get all ItemQuantity element and set for each of them
  const itemQuantities = document.querySelectorAll(".itemQuantity");  

  itemQuantities.forEach((itemQuantity) => {
    //listen to each of itemquanity
    itemQuantity.addEventListener("change", (event) => {
      event.preventDefault();
      //find node that match :class cart__item
      
      let quantityToChange = itemQuantity.closest(".cart__item");
      console.log(quantityToChange);

      //Doublecheck if products found in cart and set id & color of modified product to the same one
      const productFound = getCart().find(
        (item) =>
          item._id == quantityToChange.dataset.id &&
          item.color == quantityToChange.dataset.color
      );

      // if it's found in cart, return new number of quantity to value
      if (productFound) {
        productFound.quantity = parseInt(itemQuantity.value);
        //Add new info to local storage
        localStorage.setItem("Canape", JSON.stringify(getCart()));
        //caculate new totalQuantity and new totalPrice
        getAndRenderTotalQuantity();
        getAndRenderTotalPrice();
      }
    });
  });
}
