const cartBtn = document.querySelector(".cart");
const miniCart = document.querySelector(".mini-cart");

cartBtn.addEventListener("click", function (e) {
  if (e.target === this) {
    miniCart.classList.toggle("active");
  }
});

document.addEventListener("click", (e) => {
  const el = e.target;
  if (
    !el.closest(".cart") &&
    !el.closest(".mini-cart") &&
    !el.closest(".mini-product__delete")
  ) {
    miniCart.classList.remove("active");
  }
});
