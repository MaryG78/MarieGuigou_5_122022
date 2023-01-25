const getApiProducts = [];

const fetchDatas = async () => {
  // requete HTTP pour chaque produit du panier / promesse renvoyée dans un tableau
  getSortedCart().forEach((productInCart) => {
    getApiProducts.push(
      fetch("http://localhost:3000/api/products/" + productInCart._id)
    );
  });
  const apiProducts = await Promise.all(getApiProducts); // creation d'une promesse avec en valeurs les produits du panier trié
  const apiProductResult = await Promise.all(apiProducts.map((r) => r.json())); // transformation des données en JSON

  const cartProducts = getSortedCart();
  cartProducts.forEach((productCart) => {
    // pour chaque produit du panier trié
    const product = apiProductResult.find((p) => p._id == productCart._id); // recupère les produits JSOn identiques à ceux du panier
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
  deleteItem();
}

function getAndRenderTotalQuantity() {
  const totalQuantities = getCart().reduce(
    (total, product) => total + product.quantity,
    0
  );
  document.getElementById("totalQuantity").innerHTML = totalQuantities;
  deleteItem();
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
      //let lastQuantity = productToModify.quantity;
    

      // if it's found in cart, return new number of quantity to value
      if (productToModify) {
        productToModify.quantity = parseInt(itemQuantity.value);
        if (productToModify.quantity <= 0 || productToModify.quantity <= 100) {
          //Add new info to local storage
          localStorage.setItem("Canape", JSON.stringify(cart));
          //caculate new totalQuantity and new totalPrice
          getAndRenderTotalQuantity();
          getAndRenderTotalPrice();
          renderMessageIfEmptyCart(); // message if the cart is empty
        } else {
          alert("Veuillez entrer une quantité comprise entre 1 et 100");
          window.location.href = window.location.href;
        }
      }
    });
  });
}
//(itemQuantity.value >= 0 || itemQuantity.value <= 100)

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

/********************** FORM ***************************************************/
submitForm();

function submitForm() {
  let cart = getCart();
  const form = document.querySelector(".cart__order__form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formControl();
    const contactObject = createContactObject();
    if (formControl() != true) {
      fetch(`http://localhost:3000/api/products/order`, {
        method: "POST",
        body: JSON.stringify(contactObject),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((orderDatas) => {
          console.log(orderDatas);
          // localStorage.clear();
          // window.location.href = `./confirmation.html?orderId=${orderDatas.orderId}`;
        });
    } else {
      return;
    }
  });
}
let bodyContactObject;
function createContactObject() {
  const form = document.querySelector(".cart__order__form");
  const idsFromLocalStorage = getIdsFromLocalStorage();
  bodyContactObject = {
    contact: {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      address: form.address.value,
      city: form.city.value,
      email: form.email.value,
    },
    products: idsFromLocalStorage,
  };
  return bodyContactObject;
}

function getIdsFromLocalStorage() {
  let cart = getCart();
  let productsIds = [];
  cart.forEach((product) => {
    productsIds.push(product._id);
  });
  return productsIds;
}

// Déclaration des regex
const NamesAndCityRegex = /^[a-zA-ZÀ-ÿ'-\s\]{2,}\s[a-zA-Z'-]{2,}$/; //Any name with a length of 2 characters or more, including name with " - " or " ' " and a space between two names/ no numbers or others specials characters
const adressRegex = /^[A-Za-zÀ-ÿ0-9'-\s]{2,50}$/; //all letters & numbers, characters " - " or " ' " and space. From 0-50 characters
const emailRegex = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/; //email adress in format contact@kanap.fr

function formControl() {
  const firstName = createContactObject().contact.firstName;
  if (NamesAndCityRegex.test(firstName) != true) {
    document.getElementById("firstNameErrorMsg").innerHTML =
      "Veuillez saisir un prénom valide.";
  }
  const name = createContactObject().contact.lastName;
  if (NamesAndCityRegex.test(name) != true) {
    document.getElementById("lastNameErrorMsg").innerHTML =
      "Veuillez saisir un nom valide.";
  }
  const adress = createContactObject().contact.adress;
  if (adressRegex.test(adress) != true) {
    document.getElementById("addressErrorMsg").innerHTML =
      "Veuillez saisir une adresse valide";
  }
  const city = createContactObject().contact.city;
  if (NamesAndCityRegex.test(city) != true) {
    document.getElementById("cityErrorMsg").innerHTML =
      "Veuillez saisir un nom de ville valide";
  }
  const email = createContactObject().contact.email;
  if (emailRegex.test(email) != true) {
    document.getElementById("emailErrorMsg").innerHTML =
      "Veuillez saisir une adresse email de type exemple@kanap.fr";
  }
}
