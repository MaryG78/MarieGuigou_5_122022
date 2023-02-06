/* API's request to get the products informations
 ** If the request is successfull => returning a response in JSON format
 ** defining API's response as "datas"
 ** Incrementing product informations in HTML code
 ** display products
 */
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((datas) => {
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

  // If the request fails => returning a response in JSON format
  .catch((err) => {
    document.getElementById(
      "items"
    ).innerHTML = `Une erreur est survenue(${err})`;
  });
