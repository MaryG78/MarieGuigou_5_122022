/* get the products in the sorted cart
 ** get products informations from the API
 ** Display the product informations with the displayProduct function
 ** allow the user to change quantities or delete a product with the function deletItem and changeQuantity
 */
async function fetchProductsInCart() {
  const sortedCart = await getSortedCart();
  for (const productInCart of sortedCart) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/products/" + productInCart._id
      );
      const product = await response.json();
      displayProduct(product, productInCart.color, productInCart.quantity);
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

/* Get the products from cart
 ** get products informations from the API
 ** calculation of the total price and return it in the HTML element.
 */
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

/* Get the products from cart
 ** calculation of the total quantity by adding the quantity of each product
 ** return it in the HTML element
 */
function getAndRenderTotalQuantity() {
  const totalQuantities = getCart().reduce(
    (total, product) => total + product.quantity,
    0
  );
  document.getElementById("totalQuantity").innerHTML = totalQuantities;
  deleteItem();
  changeQuantity;
}

/* Get the products from cart
 ** select and listen the delete buttons
 ** On click, find the product to be deleted with its id nd its color
 ** delete it from the local storage and the cart page
 ** save the new cart in the local storage
 ** update prices and quantities in the cart page
 */
function deleteItem() {
  let cart = getCart();
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let removeItem = button.closest(".cart__item");
      let removeItemId = removeItem.dataset.id;
      let removeItemColor = removeItem.dataset.color;
      let itemToDelete = cart.find(
        (element) =>
          element._id == removeItemId && element.color == removeItemColor
      );
      if (itemToDelete) {
        newCart = cart.filter((i) => i !== itemToDelete);

        localStorage.setItem("Canape", JSON.stringify(newCart));
        removeItem.remove();
        renderMessageIfEmptyCart();
        getAndRenderTotalQuantity();
        getAndRenderTotalPrice();
      }
    });
  });
}

/* Get the products from cart
 ** get all itemQuantity elements and for each of them listen the change of quantity
 ** find the product to be modified with its id nd its color
 ** convert the new quantity value into an integer and add add it to the local storage
 ** //caculate new totalQuantity and new totalPrice
 */
function changeQuantity() {
  let cart = getCart();
  const itemQuantities = document.querySelectorAll(".itemQuantity");

  itemQuantities.forEach((itemQuantity) => {
    itemQuantity.addEventListener("change", () => {
      let itemToChange = itemQuantity.closest(".cart__item");
      let itemId = itemToChange.dataset.id;
      let itemColor = itemToChange.dataset.color;
      let productToModify = cart.find(
        (element) => element._id == itemId && element.color == itemColor
      );
      let lastQuantity = productToModify.quantity;

      if (productToModify) {
        productToModify.quantity = parseInt(itemQuantity.value);
        if (productToModify.quantity <= 0 || productToModify.quantity <= 100) {
          localStorage.setItem("Canape", JSON.stringify(cart));
          getAndRenderTotalQuantity();
          getAndRenderTotalPrice();
          renderMessageIfEmptyCart();
        } else {
          alert("Veuillez entrer une quantité comprise entre 1 et 100");
          itemQuantity.value = lastQuantity;
        }
      }
    });
  });
}

// Display a message if the cart is empty
function renderMessageIfEmptyCart() {
  if (getCart() === null || getCart().length === 0) {
    document.getElementById(
      "cartAndFormContainer"
    ).innerHTML = `<h1> Votre panier est vide `;
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

/********************** FORM ***************************************************/
/* Get data form to be tested (first name, last name, address, city, email)
 ** if the data doesn't match the regex, display an error message
 ** else return true
 */
function formControl() {
  const firstName = createContactObject().contact.firstName;
  if (namesRegex.test(firstName) != true) {
    document.getElementById(
      "firstNameErrorMsg"
    ).innerHTML = `Le champ saisie ne doit contenir que des lettres et les caractères spéciaux ' et -.`;
    return false;
  }
  const name = createContactObject().contact.lastName;
  if (namesRegex.test(name) != true) {
    document.getElementById(
      "lastNameErrorMsg"
    ).innerHTML = `Le champ saisie ne doit contenir que des lettres et les caractères spéciaux ' et -.`;
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
    ).innerHTML = `Le champ saisie ne doit contenir que des lettres et les caractères spéciaux ' et -.`;
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

// Regex declaration
const namesRegex = /^[a-zA-ZÀ-ÿ'\-\s]{1,}$/; // Any name with a length of 1 characters or more, including name with " - " or " ' " and a space between two names/ no numbers or others specials characters
const cityRegex = /^[a-zA-ZÀ-ÿ'\-\s]*$/; // any single or compound word with letters, characters " - " or " ' " and space.
const addressRegex = /^[A-Za-zÀ-ÿ0-9'\-\s]{6,}$/; //all letters & numbers, characters " - " or " ' " and space. Not less than 6 characters
const emailRegex = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/; //email adress in format contact@kanap.fr

/* Get cart
 ** create an empty array
 ** browse each product in the cart and add its ID to the array
 */
function getIdsFromLocalStorage() {
  let cart = getCart();
  let productsIds = [];
  cart.forEach((product) => {
    productsIds.push(product._id);
  });
  return productsIds;
}

/* Get the form element
 ** get the products ids from the local storage
 ** create a contact object with the form datas
 ** create products with the products ids
 */
function createContactObject() {
  const form = document.querySelector(".cart__order__form");
  const idsFromLocalStorage = getIdsFromLocalStorage();
  let bodyContactObject = {
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

/* Get the form element and listen the submit event
 ** get the contact object (with user datas) and check the validity of its datas
 ** if the datas are valids, send a post request with the contact object elements
 ** clear the local storage
 ** display a confirmation message
 */
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
submitForm();
