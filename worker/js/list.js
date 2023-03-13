let url = "http://localhost:8080/";
let selectedProject
let selectedTask
let selectedSubtask
let selectedComment
window.onload = () => {
  loadProjects()
  // addProjectForm();
  // editProjectForm();
  // deleteProjectForm();
  // addTaskForm();
  // assignPjt()
  // assignTask()
  // editTaskForm();
  // loadEditTasksSelection();
  // loadDeleteTasksSelection()
  // deleteTaskForm();
  // loadUsers()
  // // loadTUsers()
  // addSubtask()
  // editSubtask()
  // deleteSubtaskForm()
  // taskWorkers()
  loadUserName()
}


async function loadProjects() {
  const resp = await fetch("/workerProject");
  const projects = await resp.json();
  const projectBoardEle = document.querySelector(".project");
  projectBoardEle.innerHTML = "";
  for (const project of projects) {
    const pjtName = document.createElement("div")
    pjtName.className = "clickPrj"
    pjtName.textContent = project.name
    projectBoardEle.appendChild(pjtName);


    pjtName.addEventListener('click', function () {
      selectedProject = project.id
      document.querySelector("#tables").innerHTML = ""
      console.log(project.id)
      loadTasks()
      loadHead()
      userProjectHead()
      projectBoardEle.querySelectorAll("div").forEach(element => {
        element.style.color = ("black");
      });
       this.style.color = ("#178ca4")
  })}}


async function loadHead() {
  const resp = await fetch("/workerProject");
  const projects = await resp.json();
  const prjHead = document.querySelector("#prjName")
  prjHead.innerHTML = "";
  for (const project of projects) {
    if (project.id == selectedProject) {
      const prjName = document.createElement("div")
      prjName.textContent = project.name
      prjHead.appendChild(prjName)
      const prjStartDate = document.createElement("div")
      prjStartDate.textContent = "Start Date: " + new Date(project.start_date).toString("d-MMM-yyyy")
      prjHead.appendChild(prjStartDate)
      const prjDead = document.createElement("div")
      prjDead.textContent = "End Date: " + new Date(project.deadline).toString("d-MMM-yyyy")
      prjHead.appendChild(prjDead)
    }
  }
}



async function loadTasks() {
  const resp = await fetch("/workerTask");
  const tasks = await resp.json();
  const taskBoardEle = document.querySelector("#tablet");
  taskBoardEle.innerHTML = `<tr>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>End Date</th>
                        <th>Workers</th>
                    </tr>`;
  for (const task of tasks) {

    if (task.project_id == selectedProject) {
      const dataRow = document.createElement('tr')
      dataRow.className = ("taskRow")
      const linkBag = document.createElement('td')
      const taskName = document.createElement("div")
      taskName.className = "clickTask"
      taskName.textContent = task.name
      // const taskDesEle = document.createElement("td");
      // taskDesEle.className = "des";
      // taskDesEle.textContent = task.description;
      const taskStaEle = document.createElement("td");
      taskStaEle.className = "sta";
      taskStaEle.textContent = task.status;
      if(task.status == "Done") {
        taskStaEle.style.backgroundColor = ("#bacec1")
        taskStaEle.style.color = ("white")
      } else if (task.status == "Working on it") {
        taskStaEle.style.backgroundColor = ("#ede599")
        taskStaEle.style.color = ("white")
      } else {
        taskStaEle.style.backgroundColor = ("#f76566")
        taskStaEle.style.color = ("white")
      }
      const taskDateEle = document.createElement("td");
      taskDateEle.className = "date";
      taskDateEle.textContent = new Date(task.start_date).toString("d-MMM-yyyy")
      const taskDeadEle = document.createElement("td");
      taskDeadEle.className = "dead";
      taskDeadEle.textContent = new Date(task.deadline).toString("d-MMM-yyyy")


      linkBag.appendChild(taskName)
      dataRow.appendChild(linkBag);
      dataRow.appendChild(taskStaEle);
      // dataRow.appendChild(taskDesEle);
      dataRow.appendChild(taskDateEle);
      dataRow.appendChild(taskDeadEle);
      for (const user of task.users) {
        const taskWorkerEle = document.createElement("td");
        const taskWorkerInsideEle = document.createElement("div");
        taskWorkerInsideEle.className = "iconHead";
        taskWorkerInsideEle.textContent = (user.name.split(''))[0]
        dataRow.appendChild(taskWorkerEle)
        taskWorkerEle.appendChild(taskWorkerInsideEle);}
      // dataRow.appendChild(taskWorkerEle);
      taskBoardEle.appendChild(dataRow);
      taskName.addEventListener('click', function () {
        selectedTask = task.id
        loadSubtasks()
        taskBoardEle.querySelectorAll("div").forEach(element => {
          element.style.color = ("black");
        });
         this.style.color = ("#178ca4")
      })
        taskName.addEventListener('dblclick', function () {
        document.querySelector("#dllm").click()
        initCommentDiv();
        loadCommentArea()
        addCommentForm()
      })
    }}}




function addTaskForm() {
  document
    .querySelector("#form-task")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formBody = {
        name: form.name.value,
        description: form.description.value,
        start_date: form.start_date.value,
        deadline: form.deadline.value,
        project_id: selectedProject
      };
      const resp = await fetch("/task", {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        loadTasks()
        $("#newTaskModal").modal('hide');
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}

function editTaskForm() {
  document
    .querySelector("#form-edit-task")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formBody = {
        id: selectedTask,
        name: form.taskName.value || undefined,
        status: form.status.value || undefined,
        description: form.description.value || undefined,
        start_date: form.start_date.value || undefined,
        deadline: form.deadline.value || undefined,
      };
      const resp = await fetch("/task", {
        method: "Put",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        loadTasks()
        $("#editTask").modal('hide');
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}


// async function loadEditTasksSelection() {
//   const resp = await fetch("/task");
//   const tasks = await resp.json();


//     for (const task of tasks) {
//       let optEle = document.createElement("option"); // <option></option>

//       if (task.project_id == selectedProject){
//       optEle.value = task.id; // <option value="${brand.id}"></option>
//       optEle.textContent = task.name; // <option value="${brand.id}">${brand.name}</option>
//       optEle.dataset.abc = task.id;
//       document.querySelector("#editTasks").appendChild(optEle);
//   } 
// }}

// document.querySelector("#try").addEventListener('click', loadEditTasksSelection, {once:true})
function deleteTaskForm() {
  document
    .querySelector("#deletetasksss")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formBody = {
        id: selectedTask,
        is_completed: form.completeboxtask.checked
      };
      const resp = await fetch("/task", {
        method: "delete",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        loadTasks()
        $("#deleteTask").modal('hide');
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}

// async function loadDeleteTasksSelection() {
//   const resp = await fetch("/task");
//   const tasks = await resp.json();


//   for (const task of tasks) {
//     let optEle = document.createElement("option"); // <option></option>
//     if (task.project_id == selectedProject){
//     optEle.value = task.id; // <option value="${brand.id}"></option>
//     optEle.textContent = task.name; // <option value="${brand.id}">${brand.name}</option>
//     optEle.dataset.abc = task.id;
//     document.querySelector("#deleteTasks").appendChild(optEle);
// } 

// }}
// document.querySelector("#try2").addEventListener('click', loadDeleteTasksSelection, {once:true})



async function assignPjt() {
  document
    .querySelector("#assignPjt")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formBody = {
        project_id: selectedProject,
        user_id: form.users.value
      };
      const resp = await fetch("/userproject", {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        loadTasks()
        userProjectHead()
        $("#addMembers").modal('hide');
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}
async function assignTask() {
  document
    .querySelector("#assignTask")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formBody = {
        task_id: selectedTask,
        user_id: form.users.value
      };
      const resp = await fetch("/usertask", {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        loadTasks()
        $("#assignTask").modal('hide');
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}


async function loadUsers() {
  const resp = await fetch("/user");
  const users = await resp.json();


  for (const user of users) {
    let optEle = document.createElement("option"); // <option></option>
    optEle.value = user.id; // <option value="${brand.id}"></option>
    optEle.textContent = user.name; // <option value="${brand.id}">${brand.name}</option>
    optEle.dataset.abc = user.id;
    document.querySelector("#selectUsers").appendChild(optEle);
  }
}


async function loadTUsers() {
  const resp = await fetch("/userproject");
  const users = await resp.json();

  for (const user of users) {
    if (user.project_id == selectedProject) {
      let optEle = document.createElement("option"); // <option></option>
      optEle.value = user.user_id; // <option value="${brand.id}"></option>
      optEle.textContent = user.user_name; // <option value="${brand.id}">${brand.name}</option>
      optEle.dataset.abc = user.user_id;
      document.querySelector("#selectTUsers").appendChild(optEle);
    }
  }
}


// document.querySelector("#loadTUsers").addEventListener('click', loadTUsers, { once: true })

async function loadSubtasks() {
  const resp = await fetch("/subtask");
  const subtasks = await resp.json();


  const subtaskBoardEle = document.querySelector("#tables");
  subtaskBoardEle.innerHTML = `<tr>
                        <th>Subtask</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Workers</th>
                    </tr>`;
                    
  for (const subtask of subtasks) {
    if (subtask.task_id == selectedTask) {
      const dataRow = document.createElement('tr')
      const linkBag = document.createElement('td')
      const link3 = document.createElement("div")
      link3.className = "clickSubtask"
      link3.textContent = subtask.name
      const subtaskDesEle = document.createElement("td");
      subtaskDesEle.className = "des";
      subtaskDesEle.textContent = subtask.description;
      const subtaskStaEle = document.createElement("td");
      subtaskStaEle.className = "sta";
      subtaskStaEle.textContent = subtask.status;
      if(subtask.status == "Done") {
        subtaskStaEle.style.backgroundColor = ("#bacec1")
        subtaskStaEle.style.color = ("white")
      } else if (subtask.status == "Working on it") {
        subtaskStaEle.style.backgroundColor = ("#ede599")
        subtaskStaEle.style.color = ("white")
      } else {
        subtaskStaEle.style.backgroundColor = ("#f76566")
        subtaskStaEle.style.color = ("white")
      }
      const subtaskWorkerEle = document.createElement("td");
      const subtaskWorkerInsideEle = document.createElement("div");
      subtaskWorkerInsideEle.className = "iconHead";
      
      // subtaskWorkerEle.textContent = (subtask.name.split(""))[0]
      subtaskWorkerInsideEle.textContent = (subtask.username.split(''))[0]

      linkBag.appendChild(link3)
      dataRow.appendChild(linkBag);
      dataRow.appendChild(subtaskStaEle);
      dataRow.appendChild(subtaskDesEle);
      dataRow.appendChild(subtaskWorkerEle);
      subtaskWorkerEle.appendChild(subtaskWorkerInsideEle)

      subtaskBoardEle.appendChild(dataRow);
      link3.addEventListener('click', changeTask)
      function changeTask() {
        selectedSubtask = subtask.id
        subtaskBoardEle.querySelectorAll("div").forEach(element => {
          element.style.color = ("black");
        });
         this.style.color = ("#178ca4")
      }
    }
  }
}

async function addSubtask() {
  document
    .querySelector("#form-subtask")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formBody = {
        name: form.name.value,
        description: form.description.value,
        task_id: selectedTask,
        user_id: form.users.value
      };
      const resp = await fetch("/subtask", {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        loadSubtasks()
        $("#newsubTask").modal('hide');
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}

async function editSubtask() {
  document
    .querySelector("#form-editsubtask")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formBody = {
        id: selectedSubtask,
        name: form.name.value || undefined,
        status: form.status.value || undefined,
        description: form.description.value || undefined,
      };
      const resp = await fetch("/subtask", {
        method: "PUT",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        loadSubtasks()
        $("#editsubTask").modal('hide');
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}

function deleteSubtaskForm() {
  document
    .querySelector("#deletesubTasks")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formBody = {
        id: selectedSubtask,
        is_completed: form.completeboxsubtask.checked
      };
      const resp = await fetch("/subtask", {
        method: "delete",
        headers: {
          "content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formBody),
      });
      if (resp.status === 200) {
        loadSubtasks()
        $("#deletesubTask").modal('hide');
      } else {
        const data = await resp.json();
        alert(data.message);
      }
    });
}

async function userProjectHead() {
  const resp = await fetch("/userproject");
  const projects = await resp.json();
  const userProjectHead = document.querySelector("#prjUser");
  userProjectHead.innerHTML = "";
  for (const project of projects) {
    if (project.project_id == selectedProject) {
      const head = document.createElement("div")
      head.className = ("iconHead")
      head.textContent = (project.user_name.split(''))[0]
      userProjectHead.appendChild(head);
    }
  }
}


async function loadSubtasksUser() {
  const resp = await fetch("/usertask");
  const users = await resp.json();

  for (const user of users) {
    console.log(selectedTask)
    console.log(user)
    if (user.task_id == selectedTask) {
      let optEle = document.createElement("option"); // <option></option>
      optEle.value = user.user_id; // <option value="${brand.id}"></option>
      optEle.textContent = user.user_name; // <option value="${brand.id}">${brand.name}</option>
      optEle.dataset.abc = user.user_id;
      document.querySelector("#selectSUsers").appendChild(optEle);
    }
  }
}










async function initCommentDiv() {
  const resp = await fetch("/comment");
  const data = await resp.json();
  const respPhoto = await fetch("/file");
  const fileNameData = await respPhoto.json();

  console.log("check data", data);
  console.log("check photos", fileNameData);

  const commentArea = document.querySelector("#allContent");
  commentArea.innerHTML = ``;

  const uploadDiv = document.createElement("div");
  uploadDiv.id = "drop_zone";
  uploadDiv.ondrop = "dropHandler(event)";
  uploadDiv.ondragover = "dragOverHandler(event)";

  for (const userCom of data) {
    const userComment = document.createElement("div");
    userComment.accept =
      ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*, .pdf";
    userComment.className = "commentBox";
   
    userComment.value = "test";
    userComment.textContent = userCom.content;
  
    const userDownload = document.createElement("a");
  
    const matched_image = fileNameData.find(
      (element) => element.comment_id == userCom.id
    );
    const extname = matched_image?.name.split(".").pop();
    const matched_name = ["jpg", "jpeg", "png", "gif", "tiff"].includes(
      extname
    );
    
    if (matched_image) {
      if (matched_name) {
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyy");
        const userFiles = document.createElement("img");
        userFiles.className = "commentImg";
        userFiles.src = url + 'uploads/' + matched_image.name;
        userDownload.href = '/uploads/' + matched_image.name;
        userDownload.appendChild(userFiles); //img into a
        userComment.appendChild(userDownload); //a into div
      } else {
        const descriptionDiv = document.createElement("div");
        descriptionDiv.id = "descriptionDiv";
        // descriptionDiv.textContent = matched_image.name;
        const descriptionATag = document.createElement("a");
        descriptionATag.href = '/uploads/' + matched_image.name;
        descriptionATag.textContent = matched_image.name;
        descriptionDiv.appendChild(descriptionATag);
        userComment.appendChild(descriptionDiv);
      }

    }

   
    const userInfo = document.createElement("div");
    userInfo.id = "postDetail";
    const userInfoName = document.createElement("div");
    userInfoName.id = "postUser";
    userInfoName.textContent = userCom.name;

    const userInfoDate = document.createElement("div");
    userInfoDate.id = "postTime";
    userInfoDate.textContent = new Date(userCom.created_at).toString("d-MMM-yyyy HH:mm tt")
    ;
    if (selectedTask == userCom.task_id) {
      userInfo.appendChild(userInfoName);
      userInfo.appendChild(userInfoDate);
      userComment.appendChild(userInfo);
      uploadDiv.appendChild(userComment);
      commentArea.appendChild(uploadDiv);
      userComment.addEventListener("click", changeComment);
      function changeComment() {
        selectedComment = userCom.id;
        // console.log(selectedComment);
        commentArea.querySelectorAll("div").forEach((element) => {
          element.style.color = "black";
        });
        this.style.color = "#178ca4";
      }
    }
  }
}


  function loadCommentArea() {
    const uploadArea = document.querySelector("#allContentTwo");
    uploadArea.innerHTML = ``;
  
    const formMessage = document.createElement("form");
    formMessage.action = "/file";
    formMessage.method = "post";
    formMessage.id = "form-message";
    formMessage.enctype = "multipart / form - data";
    const uploadBtn = document.createElement("div");
    uploadBtn.id = "uploadBtn";
  
  
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.name = "fileInput";
    uploadInput.id = "fileInput";
    uploadInput.accept =
      ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*, .pdf";
    uploadInput.multiple = true;
    uploadInput.style.opacity = 100;
    uploadInput.textContent = "Choose File";
    
    uploadBtn.appendChild(uploadInput);
   
    formMessage.appendChild(uploadBtn);
  
   
    const messageArea = document.createElement("textarea");
    messageArea.id = "message";
    messageArea.name = "message";
    messageArea.placeholder = "text here";
    formMessage.appendChild(messageArea);
    const sendOutBtn = document.createElement("div");
    sendOutBtn.id = "sendOutBtn";
    const sendBtn = document.createElement("input");
    sendBtn.name = "image";
    sendBtn.id = "sendBtnTo";
    sendBtn.value = "Submit";
    sendBtn.hidden = true;
    sendBtn.type = "submit";
    const sendBtnLabel = document.createElement("label");
    sendBtnLabel.className = "sendBtnLabel";
    sendBtnLabel.htmlFor = "sendBtnTo";
    sendBtnLabel.textContent = "Submit";
   
  
    sendOutBtn.appendChild(sendBtnLabel);
    sendOutBtn.appendChild(sendBtn);
    formMessage.appendChild(sendOutBtn);
    uploadArea.appendChild(formMessage);
  }
  function addCommentForm() {
    document
      .querySelector("#form-message")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const isFileExist = form.fileInput.files[0];
        console.log("isFIleExist: ", isFileExist);
        let resp = "";
        if (isFileExist !== undefined) {
          console.log("uplaoding file");
          const formData = new FormData();
          formData.append("task_id", selectedTask);
          formData.append("content", form.message.value);
          formData.append("fileInput", form.fileInput.files[0]);
          resp = await fetch("/file", {
            method: "POST",
            body: formData,
          });
        } else {
          const formBody = {
            task_id: selectedTask,
            content: form.message.value,
          };
          resp = await fetch("/comment", {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(formBody),
          });
        }
  
        // const respjson = await resp.json();
  
        if (resp.status === 200) {
          initCommentDiv();
          loadCommentArea();
          addCommentForm();
        } else {
          const data = await resp.json();
          alert(data.message);
        }
      });
  }

async function loadTaskDes(){
  const resp = await fetch("/task");
  const tasks = await resp.json();
  const taskDesBoard = document.querySelector("#allContent")
  taskDesBoard.innerHTML = "";
    const descriptionHead = document.createElement("div")
    descriptionHead.className = "taskDescriptionHead"
    descriptionHead.textContent = "TASK DESCRIPTION"
    taskDesBoard.appendChild(descriptionHead)
  for (const task of tasks){
  if (task.id == selectedTask){
    const descriptionHead = document.createElement("div")
    descriptionHead.className = "taskDescriptionHead"
    descriptionHead.textContent = "TASK DESCRIPTION"
    const descriptionText = document.createElement("div")
    descriptionText.className = "taskDescription"
    descriptionText.textContent = task.description
    taskDesBoard.append(descriptionText)
  }
}}

document.querySelector(".bi-list-task").addEventListener("click", function () {
  document.querySelector("#allContentTwo").innerHTML = "";
  loadTaskDes();
});
document
  .querySelector(".bi-send-check")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    initCommentDiv();
    loadCommentArea();
    addCommentForm();
  });

async function loadUserName() {
  const resp = await fetch("/userName");
  const users = await resp.json();
  const userNameBoard = document.querySelector(".userName")
  userNameBoard.innerHTML = ""
  for (const user of users){
  const userName = document.createElement("div")
  userName.className = ("userName")
  userName.textContent = user.name
  userNameBoard.appendChild(userName)
  }
}
