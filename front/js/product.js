// Get the products' ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");

// Get the products' datas
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((productInformation) => {
    console.log(productInformation);

    // Implementing product datas
    let itemImg = "";
    for (let article of productInformation) {
      itemImg = `
      <img src="${article.imageUrl}" alt="${article.altTxt}"> `;
    }

    console.log(itemImg);
    document.querySelector(".item_img").innerHTML = productInformation;
  })

  .catch((err) => console.log("Une erreur est survenue"));
