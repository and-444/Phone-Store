import filter from "./filter.js";
import auth from "./modal-auth.js";
import question from "./question-send.js";
import order from "./order-send.js";

const catalogList = document.querySelector(".catalog__items");
const catalogMore = document.querySelector(".catalog__button");
const prodModal = document.querySelector(
  "[data-graph-target='prod-modal'] .graph-modal__content"
);
const prodModalSlider = prodModal.querySelector(
  ".modal-slider .swiper-wrapper"
);
const prodModalInfo = prodModal.querySelector(".modal-info__wrapper");
const prodModalChars = prodModal.querySelector(".prod-chars");

let prodQuantity = 12;
let dataLength = null;
let modal = null;
let products = null;

const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
};

const prodSlider = new Swiper(".modal-slider__container", {
  slidesPerView: 1,
  spaceBetween: 20,
});

function renderProducts(products) {
  for (let i = 0; i < products.length; i++) {
    let item = products[i];

    catalogList.innerHTML += `
              <div class="catalog__items-item">
                <div class="catalog__items-item-img">
                  <img
                    src="${item.mainImage}"
                    alt="${item.title}"
                    class="catalog__items-item-photo"
                  />
                  <div class="catalog__items-item-btns">
                    <button
                      class="catalog__items-item-btn"
                      data-graph-path="prod-modal"
                      data-id="${item._id}"
                      aria-label="Показать информацию о товаре"
                    >
                      <img
                        class="eye"
                        src="./img/catalog/frame.svg"
                        alt="1"
                      />
                    </button>
                    <button
                      class="catalog__items-item-btn add-to-cart-btn"
                      data-id="${item._id}"
                      aria-label="Добавить товар в корзину"
                    >
                      <img
                        class="basket"
                        src="./img/catalog/basket.svg"
                        alt="2"
                      />
                    </button>
                  </div>
                </div>

                <div class="catalog__items-item-info">${item.title}</div>
                <div class="catalog__items-item-price">${normalPrice(
                  item.price
                )}руб.</div>
              </div>
      `;
  }
  authUser();
}

async function authUser() {
  await auth.checkAuth();

  const loginBtn = document.querySelector(".header__login");
  const userInfo = document.querySelector(".modal-private");
  const wrapperLogin = document.querySelector(".modal-login");
  const wrapperRegister = document.querySelector(".modal-register");
  const loginForm = wrapperLogin.querySelector(".modal-login__form");
  const registerForm = wrapperRegister.querySelector(".modal-register__form");

  loginBtn?.addEventListener("click", () => {
    if (!localStorage.getItem("userToken")) {
      auth.openModalLogin();
    } else {
      userProfile(userInfo);
    }
  });

  wrapperLogin?.addEventListener("click", (e) =>
    auth.checkAuthClick(e, wrapperLogin)
  );
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    auth.loginUser(loginForm);
  });

  wrapperRegister?.addEventListener("click", (e) =>
    auth.checkAuthClick(e, wrapperRegister)
  );
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    auth.registerUser(registerForm);
  });

  document.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = e.target;
    if (
      !target.closest(".modal-private") &&
      !target.closest(".header__login")
    ) {
      userInfo.dataset.active = "false";
    } else if (target.classList.contains("modal-private__exit")) {
      auth.logout();
    }
  });
}

function userProfile(userProfile) {
  const currentUser = userProfile;

  if (currentUser.getAttribute("data-active") === "false") {
    currentUser.dataset.active = "true";
  } else {
    currentUser.dataset.active = "false";
  }
}

function productModal() {
  cartLogic();

  modal = new GraphModal({
    isOpen: (modal) => {
      if (modal.modalContainer.classList.contains("prod-modal")) {
        const openBtnId = modal.previousActiveElement.dataset.id;
        loadModalData(openBtnId);
        prodSlider.update();
      }
    },
  });
}

if (catalogList) {
  const loadProducts = (quantity = 3) => {
    fetch("https://phone-store-backend.onrender.com/product/render")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataLength = data.length;
        products = data;
        catalogList.innerHTML = "";
        renderProducts(data);
      })
      .then(() => {
        productModal();
      });
  };

  loadProducts(prodQuantity);
}
const loadModalData = (id = 1) => {
  fetch("https://phone-store-backend.onrender.com/product/render")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      prodModalSlider.innerHTML = "";
      prodModalInfo.innerHTML = "";
      prodModalChars.innerHTML = "";

      for (let dataItem of data) {
        if (dataItem._id == id) {
          const slides = dataItem.gallery.map((image) => {
            return `
            <div class="swiper-slide">
            <img src="${image}" alt="">
            </div>
            `;
          });

          const memory = dataItem.memory.map((memory, idx) => {
            return `
            <li class="modal-memory__item">
                    <button class="modal-memory__btn">${memory}Gb</button>
                  </li>
            `;
          });

          prodModalSlider.innerHTML = slides.join("");

          prodModalInfo.innerHTML = `

          <h3 class="modal-info__title">${dataItem.title}</h3>
              <div class="modal-info__memory">
                <span class="modal-info__subtitle">HDD</span>
                <ul class="modal-info__memory-list modal-memory">
                  ${memory.join("")}
                </ul>
              </div>
              <div class="modal-info__price">
                <span class="modal-info__current-price">${normalPrice(
                  dataItem.price
                )}руб</span>
              </div>

          `;

          prodModalChars.innerHTML = `

          <div class="prod-bottom__descer prod-chars__item">
                <div class="prod-chars__item-title">Экран</div>
                <div class="prod-chars__item-params">
                  ${dataItem.chars.screen}
                </div>
              </div>
              <div class="prod-bottom__descer prod-chars__item">
                <div class="prod-chars__item-title">Камеры</div>
                <div class="prod-chars__item-params">
                ${dataItem.chars.cameras}
                </div>
              </div>
              <div class="prod-bottom__descer prod-chars__item">
                <div class="prod-chars__item-title">Процессор</div>
                <div class="prod-chars__item-params">${dataItem.chars.processor}</div>
              </div>
              <div class="prod-bottom__descer prod-chars__item">
                <div class="prod-chars__item-title">Стандарт связи</div>
                <div class="prod-chars__item-params">${dataItem.chars.communication}</div>
              </div>
              <div class="prod-bottom__descer prod-chars__item">
                <div class="prod-chars__item-title">
                  Тип разъема для зарядки
                </div>
                <div class="prod-chars__item-params">${dataItem.chars.charging}</div>
              </div>

          `;
        }
      }
    });
};

const filterCatalog = document.querySelector(".catalog__filter");

filterCatalog.addEventListener("click", checkClick);

function checkClick(e) {
  const target = e.target;

  if (
    target.classList.contains("catalog__filter-categories-item") ||
    target.classList.contains("catalog__filter-memory-item") ||
    target.closest(".catalog__filter-color-item span")
  ) {
    target.classList.toggle("active");
  } else if (target.closest(".catalog__filter-button-apply")) {
    filterAction();
  } else if (target.closest(".catalog__filter-button-reset")) {
    window.location.reload();
  }
}

async function filterAction() {
  const products = await filter.products;
  let categories = document.querySelectorAll(
    ".catalog__filter-categories-item.active"
  );
  categories = Array.from(categories).map((el) => el.textContent.trim());
  const prices = Array.from(
    document.querySelectorAll(".catalog__filter-input")
  );
  const [min, max] = prices.map((el) => el.value);

  let memory = document.querySelectorAll(".catalog__filter-memory-item.active");

  memory = Array.from(memory).map(
    (el) => +el.textContent.trim().match(/\d/g).join("")
  );

  let colors = document.querySelectorAll(
    ".catalog__filter-color-item span.active"
  );

  colors = Array.from(colors).map((el) => el.classList[0]);

  const productsAccess = products.filter((el) => {
    return (
      filter.checkCategories(categories, el) &&
      filter.checkPrice(min, max, el.price) &&
      filter.checkMemory(memory, el.memory) &&
      filter.checkColor(colors, el.color)
    );
  });

  const currentProducts = document.querySelector(".catalog__items");
  currentProducts.innerHTML = "";
  renderProducts(productsAccess);
  productModal();
}

let price = 0;
const miniCartList = document.querySelector(".mini-cart__list");
const fullPrice = document.querySelector(".mini-cart__summ");
const cartCount = document.querySelector(".header__basket-count");

const priceWithoutSpaces = (str) => {
  return str.replace(/\s/g, "");
};

const plusFullPrice = (currentPrice) => {
  return (price += currentPrice);
};

const minusFullPrice = (currentPrice) => {
  return (price -= currentPrice);
};

const printFullPrice = () => {
  fullPrice.textContent = `${normalPrice(price)} руб`;
};

const printQuantity = (num) => {
  cartCount.textContent = num;
};

function renderOrder(dataItem) {
  return `
  <li class="mini-cart__item" data-id="${dataItem._id}">
                <article class="mini-cart__product mini-product">
                  <div class="mini-product__image">
                    <img
                      class="mini-product__img"
                      src=${dataItem.mainImage}
                      alt=${dataItem.title}
                    />
                  </div>
                  <div class="mini-product__content">
                    <div class="mini-product__text">
                      <h3 class="mini-product__title">${dataItem.title}</h3>
                      <sapn class="mini-product__price">${normalPrice(
                        dataItem.price
                      )} руб</sapn>
                    </div>
                    <button
                      class="mini-product__delete"
                      aria-label="Удалить товар"
                    >Удалить
                      <img
                        class="mini-product__delete__trash"
                        src="./img/basket/trash.svg"
                        alt="удалить товар"
                      />
                    </button>
                  </div>
                </article>
              </li>

  `;
}

const loadCartData = (id = 1, productName) => {
  fetch("https://phone-store-backend.onrender.com/product/render")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (let dataItem of data) {
        if (productName && dataItem.title == productName) {
          miniCartList.insertAdjacentHTML("afterbegin", renderOrder(dataItem));
          return dataItem;
        } else if (dataItem._id == id) {
          miniCartList.insertAdjacentHTML("afterbegin", renderOrder(dataItem));
          return dataItem;
        }
      }
    })
    .then((item) => {
      plusFullPrice(item.price);
      printFullPrice();

      let num = document.querySelectorAll(
        ".mini-cart__list .mini-cart__item"
      ).length;

      if (num > 0) {
        cartCount.classList.add("disabled");
      }

      printQuantity(num);
    });
};

const cartLogic = () => {
  const productBtn = document.querySelectorAll(".add-to-cart-btn");

  productBtn.forEach((el) => {
    el.addEventListener("click", (e) => {
      if (!localStorage.getItem("userToken")) {
        document.body.classList.add("disable-scroll");
        return auth.openModalLogin();
      }
      const id = e.currentTarget.dataset.id;

      loadCartData(id, null);

      document.querySelector(".header__basket").classList.remove("inactive");

      e.currentTarget.classList.add("disabled");
    });
  });

  miniCartList.addEventListener("click", (e) => {
    if (e.target.classList.contains("mini-product__delete")) {
      const self = e.target;
      const parent = self.closest(".mini-cart__item");
      const price = parseInt(
        priceWithoutSpaces(
          parent.querySelector(".mini-product__price").textContent
        )
      );
      const id = parent.dataset.id;

      document
        .querySelector(`.add-to-cart-btn[data-id="${id}"]`)
        .classList.remove("disabled");

      parent.remove();

      minusFullPrice(price);
      printFullPrice();

      let num = document.querySelectorAll(
        ".mini-cart__list .mini-cart__item"
      ).length;

      if (num == 0) {
        cartCount.classList.remove("disabled");
        miniCart.classList.remove("active");
        document.querySelector(".header__basket").classList.add("inactive");
      }

      printQuantity(num);
    }
  });
};

const openOrderModal = document.querySelector(".mini-cart__btn");
const orderModalList = document.querySelector(".cart-modal-order__list");
const orderModalQuantity = document.querySelector(
  ".cart-modal-order__quantity span"
);
const orderModalSumm = document.querySelector(".cart-modal-order__summ span");
const orderModalShow = document.querySelector(".cart-modal-order__show");

openOrderModal.addEventListener("click", () => {
  const productsHTML = document.querySelector(".mini-cart__list").innerHTML;
  orderModalList.innerHTML = productsHTML;

  orderModalQuantity.textContent = `${
    document.querySelectorAll(".mini-cart__list .mini-cart__item").length
  } шт`;

  orderModalSumm.textContent = fullPrice.textContent;
});

orderModalShow.addEventListener("click", () => {
  if (orderModalList.classList.contains("active")) {
    orderModalList.classList.remove("active");
    orderModalShow.classList.remove("active");
  } else {
    orderModalList.classList.add("active");
    orderModalShow.classList.add("active");
  }
});

orderModalList.addEventListener("click", (e) => {
  if (e.target.classList.contains("mini-product__delete")) {
    const self = e.target;
    const parent = self.closest(".mini-cart__item");
    const price = parseInt(
      priceWithoutSpaces(
        parent.querySelector(".mini-product__price").textContent
      )
    );
    const id = parent.dataset.id;

    document
      .querySelector(`.add-to-cart-btn[data-id="${id}"]`)
      .classList.remove("disabled");

    parent.style.display = "none";
    parent.remove();
    document.querySelector(`.mini-cart__item[data-id="${id}"]`).remove();

    minusFullPrice(price);
    printFullPrice();

    let num = document.querySelectorAll(
      ".mini-cart__list .mini-cart__item"
    ).length;

    if (num == 0) {
      cartCount.classList.remove("disabled");
      miniCart.classList.remove("active");
      document.querySelector(".header__basket").classList.add("inactive");

      modal.close();
    }

    printQuantity(num);
  }
});

const questionsForm = document.querySelector(".questions__form");
questionsForm.addEventListener("submit", (e) => question.questionSend(e));

const modalInfoOrder = document.querySelector(".modal-info__order");

modalInfoOrder.addEventListener("click", (e) => {
  const modalWrapper = document.querySelector(".graph-modal");
  const modalInner = document.querySelector(".graph-modal__container");
  if (!localStorage.getItem("userToken")) {
    modalWrapper.classList.remove("is-open");
    modalInner.classList.remove("graph-modal-open", "fade", "animate-open");
    return auth.openModalLogin();
  }
  const modalInfo = e.target.parentElement;
  const productName = modalInfo.querySelector(".modal-info__title");

  loadCartData(null, productName.textContent);
  alert("Товар добавлен в корзину");
  modalWrapper.classList.remove("is-open");
  modalInner.classList.remove("graph-modal-open", "fade", "animate-open");
  document.querySelector(".header__basket").classList.remove("inactive");
  document.body.classList.remove("disable-scroll");
});

const cartModalForm = document.querySelector(".cart-modal__form");
cartModalForm.addEventListener("submit", (e) => order.orderSend(e));

const myOrders = document.querySelector(".modal-private__orders");
const wrapperOrders = document.querySelector(".modal-orders");
myOrders.addEventListener("click", (e) => {
  const parentEl = e.target.closest(".modal-private");
  parentEl.dataset.active = "false";
  order.getOrders(products);
});

wrapperOrders.addEventListener("click", (e) => checkClickOrders(e));

function checkClickOrders(e) {
  const currentTarget = e.target;
  if (currentTarget.classList.contains("modal-orders")) {
    currentTarget.innerHTML = "";
    currentTarget.dataset.active = "false";
    document.body.classList.remove("disable-scroll");
  } else if (currentTarget.closest(".order-content__compound")) {
    const parentEl = currentTarget.parentElement;
    const products = parentEl.querySelector(".order-content__products");
    parentEl.classList.toggle("active");

    if (parentEl.classList.contains("active")) {
      products.style.maxHeight = `200px`;
    } else {
      products.style.maxHeight = `0px`;
    }
  }
}
