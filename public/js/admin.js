console.log('fuck world')

window.onload = () => {
    initAdminForm()
}

function initAdminForm() {
    document
      .querySelector("#form-login")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const formBody = {
          username: form.username.value,
          password: form.password.value,
        };
        const resp = await fetch("/admin", {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(formBody),
        });
        if (resp.status === 200) {
          window.location = "/adminwork.html";
        } else {
          const data = await resp.json();
          alert(data.message);
        }
      });
  }
