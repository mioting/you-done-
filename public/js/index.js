console.log('fuck world')

window.onload = () => {
    initLoginForm(); 
}

function initLoginForm() {
    document
      .querySelector("#form-login")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const formBody = {
          username: form.username.value,
          password: form.password.value,
        };
        const resp = await fetch("/login", {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(formBody),
        });
        if (resp.status === 200) {
          const check = await resp.json()
          if (check.role == "manager"){
          window.location = "/manager/dashboard.html";
          } else if (check.role == "worker") {
            window.location = "/worker/dashboard.html"
          }
        } else {
          const data = await resp.json();
          alert(data.message);
        }
      });
  }
