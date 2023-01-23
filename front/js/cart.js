const productResponses = [];

const fetchDatas = async () => {
  // requete HTTP pour chaque produit du panier / promesse renvoyée dans un tableau
  getSortedCart().forEach((productInCart) => {
    productResponses.push(
      fetch("http://localhost:3000/api/products/" + productInCart._id)
    );
  });
  const products = await Promise.all(productResponses); // creation d'une promesse avec en valeurs les produits du panier trié
  const productResult = await Promise.all(products.map((r) => r.json())); // transformation des données en JSON
  const cartProducts = getSortedCart();

  cartProducts.forEach((productCart) => {
    // pour chaque produit du panier trié
    const product = productResult.find((p) => p._id == productCart._id); // recupère les produits JSOn identiques à ceux du panier
    displayProduct(product, productCart.color, productCart.quantity); // display of cart items
  });
  deleteItem();
  changeQuantity();
};

fetchDatas();
renderMessageIfEmptyCart();
getAndRenderTotalQuantity();
getAndRenderTotalPrice();

//Grouping sofas by id in the cart display
function getSortedCart() {
  let sortedCart = getCart().sort((a, b) => (a._id < b._id ? -1 : 1));
  return sortedCart;
}

// display of cart items
function displayProduct(product, color, quantity) {
  document.getElementById("cart__items").innerHTML += `
       <article class="cart__item" data-id="${product._id}" data-color="${color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${color}</p>
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

function getAndRenderTotalPrice() {
  let totalPrice = 0;
  getCart().forEach((productInCart) => {
    fetch("http://localhost:3000/api/products/" + productInCart._id)
      .then((response) => response.json())
      .then((product) => {
        totalPrice += product.price * productInCart.quantity;
        document.getElementById("totalPrice").innerHTML = totalPrice;
      });
  });
}

function getAndRenderTotalQuantity() {
  const totalQuantities = getCart().reduce(
    (total, product) => total + product.quantity,
    0
  );
  document.getElementById("totalQuantity").innerHTML = totalQuantities;
}

//delete items
function deleteItem() {
  let cart = getCart();
  const deleteButtons = document.querySelectorAll(".deleteItem"); // select all the delete button
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // find the product to delete
      let removeItem = button.closest(".cart__item");
      let removeItemId = removeItem.dataset.id;
      let removeItemColor = removeItem.dataset.color;
      // select the product to delete
      let itemToDelete = cart.find(
        (element) =>
          element._id == removeItemId && element.color == removeItemColor
      );
      if (itemToDelete) {
        //keep all the items of the cart exepted the clicked one
        newCart = cart.filter((i) => i !== itemToDelete);

        // save the new cart in local storage
        localStorage.setItem("Canape", JSON.stringify(newCart));
        removeItem.remove(); // remove the item to delete
        renderMessageIfEmptyCart(); // message if the cart is empty
        getAndRenderTotalQuantity(); // uptade and render new quantity
        getAndRenderTotalPrice(); //uptade and render new total price
        changeQuantity();
      }
    });
  });
}

function changeQuantity() {
  let cart = getCart();
  //Get all ItemQuantity element and set for each of them
  const itemQuantities = document.querySelectorAll(".itemQuantity");

  itemQuantities.forEach((itemQuantity) => {
    //listen to each of itemquanity
    itemQuantity.addEventListener("change", () => {
      // find the product to modify
      let quantityToChange = itemQuantity.closest(".cart__item");
      let itemId = quantityToChange.dataset.id;
      let itemColor = quantityToChange.dataset.color;
      // Select the product to modify
      let productToModify = cart.find(
        (element) => element._id == itemId && element.color == itemColor
      );

      // if it's found in cart, return new number of quantity to value
      if (productToModify) {
        productToModify.quantity = parseInt(itemQuantity.value);
        //Add new info to local storage
        localStorage.setItem("Canape", JSON.stringify(cart));
        //caculate new totalQuantity and new totalPrice
        getAndRenderTotalQuantity();
        getAndRenderTotalPrice();
        renderMessageIfEmptyCart(); // message if the cart is empty
      }
    });
  });
}

//if (productToModify.quantity >= 1 && productToModify.quantity <= 100)

function renderMessageIfEmptyCart() {
  if (getCart() === null || getCart().length === 0) {
    document.getElementById(
      "cartAndFormContainer"
    ).innerHTML = `<h1> Votre panier est vide `;
  }
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
 /********************** FORMULAIRE ***************************************************/
submitForm();

function submitForm() {  
  const form = document.querySelector(".cart__order__form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderMessageIfEmptyCart();
    const contact = createContactObject();
    fetch(`http://localhost:3000/api/products/order`, {
      method: "POST",
      body: JSON.stringify(contact),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  });
}

function createContactObject() {
  const form = document.querySelector(".cart__order__form");
  const idsFromLocalStorage = getIdsFromLocalStorage()
  const bodyContactObject = {
    contact: {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      address: form.address.value,
      city: form.city.value,
      email: form.email.value,
    },
    products: idsFromLocalStorage,
  };
  return bodyContactObject
}
function getIdsFromLocalStorage(){
  let cart = getCart();
  let productsIds = [];
  cart.forEach((product) =>
  {productsIds.push(product._id)})
  return productsIds
}