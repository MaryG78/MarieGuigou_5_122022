// Get a product from the local storage
let productStorage = JSON.parse(localStorage.getItem("productBasket"));
console.log(productStorage);

// classe où injecter le code HTML
const basketHTMLClass = document.getElementById("cart__items");

// si le panier est vide
if (productStorage === null) {
const panierVide = ``;
// si le panier n'est pas vide
} else {
let basketArray = [];
for(i = 0; i < productStorage.length; i++){
   basketArray = basketArray + `
   `
}

}

