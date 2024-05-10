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
let prodQuantity = 3;
let dataLength = null;

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
        console.log(data);

        dataLength = data.length;

        catalogList.innerHTML = "";
        for (let i = 0; i < dataLength; i++) {
          if (i < quantity) {
            let item = data[i];
            console.log(item);

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
                            class="catalog__items-item-btn"
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
        const modal = new GraphModal({
          isOpen: (modal) => {
            const openBtnId = modal.previousActiveElement.dataset.id;

            loadModalData(openBtnId);

            prodSlider.update();
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
            console.log(dataItem);

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
