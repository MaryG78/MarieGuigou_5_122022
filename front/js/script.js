// API's request
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((datas) => {
    // insertion of products in the home page
    let display = "";
    datas.forEach((article) => {
      display += `
        <a href="./product.html?id=${article._id}">
            <article>
              <img src="${article.imageUrl}" alt="${article.altTxt}">
              <h3 class="productName">${article.name}</h3>
              <p class="productDescription">${article.description}</p>
            </article>
          </a>
          `;
    });
    document.getElementById("items").innerHTML = display;
  })

  .catch((err) => {
    document.getElementById(
      "items"
    ).innerHTML = `Une erreur est survenue(${err})`;
  });
