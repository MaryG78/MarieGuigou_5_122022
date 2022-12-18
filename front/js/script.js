let a = fetch("http://localhost:3000/api/products") // Get API's datas
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    let display = "";
    for (let article of data) {
      display += `
        <a href="./product.html?id=${article._id}">
            <article>
              <img src="${article.imageUrl}" alt="${article.altTxt}">
              <h3 class="productName">${article.name}</h3>
              <p class="productDescription">${article.description}</p>
            </article>
          </a>
          `;
    }
    console.log(display);
    document.querySelector("#items").innerHTML = display;
  })

  .catch((err) => console.log("Une erreur est survenue"));

  console.log(a);
