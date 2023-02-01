function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const orderId = urlParams.get("orderId");
  return orderId;
}

document.querySelector("#orderId").innerHTML = getOrderId(); // order number display
