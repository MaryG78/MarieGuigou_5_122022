const cart= JSON.parse(localStorage.getItem("Canape"));

//empty and full cart management

if (cart == null || cart.length == 0) {
  document.getElementById("cart__title").innerHTML += `Votre panier est vide`;
}

function fetchProductsInCart() {
  for (const element of cart) {
    fetch("http://localhost:3000/api/products/" + cart.idKanapStorage)
      .then((response) => response.json())
      .then((product) => (productInCart) => {
        console.log(product);
      });
  }
}
fetchProductsInCart();

