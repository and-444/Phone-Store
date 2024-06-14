class Auth {
  wrapperLogin;

  wrapperRegister;

  constructor() {
    this.wrapperLogin = document.querySelector(".modal-login");
    this.wrapperRegister = document.querySelector(".modal-register");
  }

  async checkAuth() {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/auth/user", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const userName = data.userName;
        const email = data.email;

        this.successLogin(token, userName, email);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async loginUser(form) {
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    const userObj = { email, password };

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      });

      const data = await res.json();

      if (res.ok) {
        this.successLogin(data.token, data.userName, data.email);
      } else {
        this.validateLogin(form, data.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async registerUser(form) {
    const formData = new FormData(form);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const userObj = { username, email, password };

    try {
      const res = await fetch("http://localhost:3000/auth/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      });

      if (res.ok) {
        this.successRegister();
      }
    } catch (e) {
      console.log(e);
    }
  }

  validateLogin(form, error) {
    const password = form.querySelector(".modal-login__password");
    const username = form.querySelector(".modal-login__username");

    if (error === "Пароль не совпадает") {
      password.dataset.error = "true";
    } else {
      password.dataset.error = "false";
    }

    if (error === "Пользователь не найден") {
      username.dataset.error = "true";
    } else {
      username.dataset.error = "false";
    }
  }

  successRegister() {
    this.wrapperRegister.dataset.active = "false";
    document.body.dataset.hidden = "false";
  }

  successLogin(token, username, email) {
    localStorage.setItem("userToken", token);
    this.wrapperLogin.dataset.active = "false";
    document.body.dataset.hidden = "false";

    const inputUserName = document.querySelector(".questions__form-input");
    const orderName = document.querySelector(".cart-modal__input--name");
    const orderEmail = document.querySelector(".cart-modal__input--email");
    orderName.value = username;
    inputUserName.value = username;
    orderEmail.value = email;
  }

  logout() {
    localStorage.removeItem("userToken");
    const userInfo = document.querySelector(".modal-private");

    userInfo.dataset.active = "false";

    const inputs = document.querySelectorAll("input");

    inputs.forEach((input) => {
      const currentInput = input;
      currentInput.value = "";
    });

    location.reload();
  }

  openModalLogin() {
    document.body.dataset.hidden = "true";
    this.wrapperLogin.dataset.active = "true";
  }

  checkAuthClick(e, wrapper) {
    const target = e.target;
    const modal = wrapper;

    if (
      target.classList.contains("modal-authorization") ||
      target.closest(".modal-authorization__exit")
    ) {
      document.body.dataset.hidden = "false";
      modal.dataset.active = "false";
    } else if (target.classList.contains("modal-login__register")) {
      modal.dataset.active = "false";
      this.switchModal("register");
    } else if (target.classList.contains("modal-register__login")) {
      modal.dataset.active = "false";
      this.switchModal("login");
    }
  }

  switchModal(where) {
    if (where === "register") {
      this.wrapperRegister.dataset.active = "true";
    } else if (where === "login") {
      this.wrapperLogin.dataset.active = "true";
    }
  }
}

export default new Auth();
