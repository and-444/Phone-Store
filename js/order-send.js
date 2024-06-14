class Order {
  products;

  async orderSend(e) {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    const form = e.target;
    const order = new FormData(form);
    const userName = order.get("name");
    const phone = order.get("tel");
    const email = order.get("email");
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    const productOrder = document.querySelector(".cart-modal-order__list");
    let totalSum = document
      .querySelector(".cart-modal-order__summ span")
      ?.textContent?.replace(/\W/g, "");

    const totalProducts = Array.from(productOrder.children).reduce(
      (acc, product) => {
        const productId = product.getAttribute("data-id");
        const productName = product.querySelector(
          ".mini-product__title"
        )?.textContent;
        const productPrice = product.querySelector(
          ".mini-product__price"
        )?.textContent;

        const infoProduct = { productId, productName, productPrice };
        acc.push(infoProduct);

        return acc;
      },
      []
    );

    totalSum = `${totalSum} ₽`;

    try {
      const res = await fetch(
        "https://phone-store-backend.onrender.com/order/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            userName,
            phone,
            email,
            products: totalProducts,
            totalSum,
            date: formattedDate,
          }),
        }
      );

      if (res.ok) {
        alert("Отправлено");
        form.reset();

        this.successOrder();
      }
    } catch (err) {
      console.log(err);
    }
  }

  successOrder() {
    location.reload();
  }

  async getOrders(products) {
    const token = localStorage.getItem("userToken");
    this.products = products;
    try {
      const res = await fetch(
        "https://phone-store-backend.onrender.com/order/get",
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        this.markingWrapperModal(data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  markingWrapperModal(orders) {
    const modalWrapper = document.querySelector(".modal-orders");
    document.body.classList.add("disable-scroll");
    modalWrapper.dataset.active = "true";
    modalWrapper?.insertAdjacentHTML(
      "beforeend",
      `
      <div class="order-list">
      <div class="order-list__inner">
        <div class="order-list__title">Мои заказы</div>
        <div class="order-list__items">
          ${this.openModalOrders(orders)}
        </div>
      </div>
    </div>
    `
    );
  }

  openModalOrders(orders) {
    const htmlOrders = orders.map((order) => this.markingOrderModal(order));
    return htmlOrders.join(" ");
  }

  markingOrderModal(order) {
    return `
      <div class="modal-order__content order-content">
        <div class="order-content__inner">
          <div class="order-content__top">
            <div class="order-content__total">Номер заказа: <span>${
              order.orderId
            }</span></div>
            <div class="order-content__total">дата заказа: <span>${
              order.date
            }</span></div>
            <div class="order-content__total">Товаров в заказе: <span>${
              order.orderProducts.length
            } шт</span></div>
            <div class="order-content__sum">Общая сумма заказа: <span>${
              order.totalSum
            }</span></div>
          </div>
          <div class="order-content__about">
            <div class="order-content__compound">Состав заказа</div>
            <div class="order-content__products">
              ${this.createModalOrderItem(order.orderProducts)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createModalOrderItem(orderProducts) {
    const totalProducts = orderProducts.map((product) => product.productId);
    const productsOrderToRend = this.products?.filter((product) => {
      if (totalProducts.includes(product._id.toString())) {
        return product;
      }
      return null;
    });

    const htmlProducts = productsOrderToRend?.map((product) =>
      this.createLayoutOrderItem(product)
    );

    return htmlProducts?.join(" ");
  }

  createLayoutOrderItem(product) {
    return `
    <div class="order-content__product" data-id="${product._id}">
      <div class="cart-product__img">
        <img src="${product.mainImage}" alt="">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${product.title}</div>
        <div class="cart-product__price">${product.price} ₽</div>
      </div>
    </div>
    `;
  }
}

export default new Order();
