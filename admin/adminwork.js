window.onload = () => {
    initAdminForm(); 
    editAdminForm();
    deleteAdminForm();
}




function initAdminForm() {
    document
      .querySelector("#new")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const formBody = {
          name: form.name.value,
          username: form.username.value,
          password: form.password.value,
          title: form.title.value,
          is_manager: form.manager.checked
        };
        const resp = await fetch("/adminwork", {
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


  function editAdminForm() {
    document
      .querySelector("#edit")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const formBody = {
            name: form.name.value,
            username: form.username.value,
            password: form.password.value,
            title: form.title.value,
            is_manager: form.manager.checked,
        };
        const resp = await fetch("/adminwork", {
          method: "Put",
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

  function deleteAdminForm() {
    document
      .querySelector("#delete")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const formBody = {
          username: form.username.value
        };
        const resp = await fetch("/adminwork", {
          method: "delete",
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