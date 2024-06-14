class Question {
  async questionSend(e) {
    e.preventDefault();
    const form = e.target;
    const question = new FormData(form);
    const userName = question.get("username");
    const phone = question.get("phone");
    const message = question.get("message");
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    console.log(userName);

    try {
      const res = await fetch(
        "https://phone-store-backend.onrender.com/question/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
            phone,
            message,
            date: formattedDate,
          }),
        }
      );

      if (res.ok) {
        // eslint-disable-next-line no-alert
        alert("Отправлено");
        form.reset();
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Question();
