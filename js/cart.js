const cartBtn = document.querySelector(".cart");
const miniCart = document.querySelector(".mini-cart");

cartBtn.addEventListener("click", () => {
  miniCart.classList.add("active");
});

document.addEventListener("click", (e) => {
  const cart = e.target.closest(".mini-cart");
  const del = e.target.classList.contains("mini-product__delete");
  if (!e.target.classList.contains("cart") && !cart) {
    miniCart.classList.remove("active");
  }
});
