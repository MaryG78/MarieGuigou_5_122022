// Get the products' ID from the page URL
function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const orderId = urlParams.get("orderId");
  return orderId;
}

// display order number on the confirmation message
document.querySelector("#orderId").innerHTML = getOrderId();
