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
let prodQuantity = 9;
let dataLength = null;
let modal = null;

const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
};

const prodSlider = new Swiper(".modal-slider__container", {
  slidesPerView: 1,
  spaceBetween: 20,
});

if (catalogList) {
  const loadProducts = (quantity = 3) => {
    fetch("./data/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataLength = data.length;

        catalogList.innerHTML = "";
        for (let i = 0; i < dataLength; i++) {
          if (i < quantity) {
            let item = data[i];

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
                            data-id="${item.id}"
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
                            data-id="${item.id}"
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
        }
      })
      .then(() => {
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
      });
  };

  loadProducts(prodQuantity);

  const loadModalData = (id = 1) => {
    fetch("./data/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        prodModalSlider.innerHTML = "";
        prodModalInfo.innerHTML = "";
        prodModalChars.innerHTML = "";

        for (let dataItem of data) {
          if (dataItem.id == id) {
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

  catalogMore.addEventListener("click", (event) => {
    prodQuantity = prodQuantity + 3;

    loadProducts(prodQuantity);
    if (prodQuantity >= dataLength) {
      catalogMore.style.display = "none";
    } else {
      catalogMore.style.display = "block";
    }
  });
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

const loadCartData = (id = 1) => {
  fetch("./data/data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (let dataItem of data) {
        if (dataItem.id == id) {
          console.log(dataItem);
          miniCartList.insertAdjacentHTML(
            "afterbegin",
            `
          <li class="mini-cart__item" data-id="${dataItem.id}">
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
                              <h3 class="mini-product__title">${
                                dataItem.title
                              }</h3>
                              <sapn class="mini-product__price">${normalPrice(
                                dataItem.price
                              )} руб</sapn>
                            </div>
                            <button
                              class="mini-product__delete"
                              aria-label="Удалить товар"
                            >
                              <img
                                class="mini-product__delete__trash"
                                src="./img/basket/trash.svg"
                                alt="удалить товар"
                              />
                            </button>
                          </div>
                        </article>
                      </li>

          `
          );

          return dataItem;
        }
      }
    })
    .then((item) => {
      plusFullPrice(item.price);
      printFullPrice();

      let num = document.querySelectorAll(".mini-cart__item").length;

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
      const id = e.currentTarget.dataset.id;
      loadCartData(id);

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

      let num = document.querySelectorAll(".mini-cart__item").length;

      if (num == 0) {
        cartCount.classList.remove("disabled");
        miniCart.classList.remove("active");
      }

      printQuantity(num);
    }
  });
};
