async function fetchProductsInCart() {
  const sortedCart = await getSortedCart();
  for (const productInCart of sortedCart) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/products/" + productInCart._id
      );
      const product = await response.json();
      displayProduct(product, productInCart.color, productInCart.quantity);
      deleteItem();
      changeQuantity();
    } catch (err) {
      document
        .querySelector("h1")
        .insertAdjacentHTML("beforebegin", `Une erreur est survenue(${err})`);
    }
  }
    deleteItem();
    changeQuantity();
}

renderMessageIfEmptyCart();
getAndRenderTotalQuantity();
getAndRenderTotalPrice();
fetchProductsInCart();

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
  changeQuantity();
}

function getAndRenderTotalQuantity() {
  const totalQuantities = getCart().reduce(
    (total, product) => total + product.quantity,
    0
  );
  document.getElementById("totalQuantity").innerHTML = totalQuantities;
  deleteItem();
  changeQuantity;
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
      let itemToChange = itemQuantity.closest(".cart__item");
      let itemId = itemToChange.dataset.id;
      let itemColor = itemToChange.dataset.color;
      // Select the product to modify
      let productToModify = cart.find(
        (element) => element._id == itemId && element.color == itemColor
      );
      let lastQuantity = productToModify.quantity;

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
          itemQuantity.value = lastQuantity;
        }
      }
    });
  });
}

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
  const form = document.querySelector(".cart__order__form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const contactObject = createContactObject();
    let isValid = formControl(contactObject);
    if (isValid) {
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
          localStorage.clear();
          window.location.href = `../html/confirmation.html?orderId=${orderDatas.orderId}`;
        })
        .catch((err) => {
          document
            .getElementById("cart__items")
            .insertAdjacentHTML(
              "beforebegin",
              `Une erreur est survenue(${err})`
            );
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
const namesRegex = /^[a-zA-ZÀ-ÿ'\-\s]{1,}$/; // Any name with a length of 1 characters or more, including name with " - " or " ' " and a space between two names/ no numbers or others specials characters
const cityRegex = /^[a-zA-ZÀ-ÿ'\-\s]*$/; // any single or compound word with letters, characters " - " or " ' " and space.
const addressRegex = /^[A-Za-zÀ-ÿ0-9'\-\s]{6,}$/; //all letters & numbers, characters " - " or " ' " and space. Not less than 6 characters
const emailRegex = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/; //email adress in format contact@kanap.fr

function formControl() {
  const firstName = createContactObject().contact.firstName;
  if (namesRegex.test(firstName) != true) {
    document.getElementById(
      "firstNameErrorMsg"
    ).innerHTML = `Le champ saisie ne doit contenir que des lettres et les caractères spéciaux "'" et "-".`;
    return false;
  }
  const name = createContactObject().contact.lastName;
  if (namesRegex.test(name) != true) {
    document.getElementById(
      "lastNameErrorMsg"
    ).innerHTML = `Le champ saisie ne doit contenir que des lettres et les caractères spéciaux "'" et "-".`;
    return false;
  }
  const address = createContactObject().contact.address;
  if (addressRegex.test(address) != true) {
    document.getElementById("addressErrorMsg").innerHTML =
      "Le champ saisie ne doit contenir que des chiffres et des lettres et au moins 6 caractères";
    return false;
  }
  const city = createContactObject().contact.city;
  if (cityRegex.test(city) != true) {
    document.getElementById(
      "cityErrorMsg"
    ).innerHTML = `Le champ saisie ne doit contenir que des lettres et les caractères spéciaux "'" et "-".`;
    return false;
  }
  const email = createContactObject().contact.email;
  if (emailRegex.test(email) != true) {
    document.getElementById("emailErrorMsg").innerHTML =
      "Veuillez saisir une adresse email de type exemple@kanap.fr";
    return false;
  }
  return true;
}


