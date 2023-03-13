window.onload = () => {
  loadProjects();
  loadTasks();
  loadSubtasks();
  // loadDeadProject()
  // bar()
};

async function loadProjects() {
  const resp = await fetch("/workerDashboardProject");
  const projects = await resp.json();
  const projectCount = document.querySelector(".countPjt");

  projectCount.innerHTML = "";
  const pjtNum = document.createElement("div");
  pjtNum.className = "count";
  pjtNum.textContent =
    "Incomplete Projects: " +
    projects.filter(function (projects) {
      return projects.is_completed == false;
    }).length;
  projectCount.appendChild(pjtNum);

  for (const project of projects) {
    const projectDead = document.querySelector(".pjtDead");
    projectDead.innerHTML = "";
    const pjtDead = document.createElement("div");
    pjtDead.className = "dead";
    pjtDead.textContent = "Nearest End Date Project: " + project.name;
    projectDead.appendChild(pjtDead);
    const pjtDate = document.createElement("div");
    pjtDate.className = "dead";
    pjtDate.textContent =
      "End Date: " + new Date(project.deadline).toString("d-MMM-yyyy");

    pjtDead.appendChild(pjtDate);
  }
}

async function loadTasks() {
  const resp = await fetch("/dashboardTask");
  const tasks = await resp.json();
  console.log(tasks)
  let totalCompleted = tasks.filter(function (tasks) {
    return tasks.status == "Done";
  }).length;

  let totalInCompleted = tasks.filter(function (tasks) {
    return (
      tasks.status == "Not yet started" ||
      tasks.status == "Working on it"
    );
  }).length;
  const taskCount = document.querySelector(".countTask");
  taskCount.innerHTML = "";
  const taskNum = document.createElement("div");
  taskNum.className = "count";
  taskNum.textContent =
    "Incomplete Tasks: " +
    tasks.filter(function (tasks) {
      return (
        (tasks.status == tasks.status) == "Not yet started" ||
        tasks.status == "Working on it"
      );
    }).length;
  taskCount.appendChild(taskNum);
  for (const task of tasks) {
    if (task.status !== "Done") {
      const taskDead = document.querySelector(".taskDead");
      taskDead.innerHTML = "";
      const tkDead = document.createElement("div");
      tkDead.className = "dead";
      tkDead.textContent = "Nearest End Date Task: " + task.name;
      const tkDate = document.createElement("div");
      tkDate.className = "dead";
      tkDate.textContent =
        "End Date: " + new Date(task.deadline).toString("d-MMM-yyyy");
      taskDead.appendChild(tkDead);
      taskDead.appendChild(tkDate);
    }
  }
  const ctx = document.getElementById("pieChart1");
  new Chart(ctx, {
    type: "pie",
    data: (data = {
      labels: ["Completed Task", "Incompleted Task"],
      datasets: [
        {
          label: "My First Dataset",
          data: [totalCompleted, totalInCompleted],
          backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
          hoverOffset: 4,
        },
      ],
    }),
  });
}

async function loadSubtasks() {
  const resp = await fetch("/dashboardSubtask");
  const subtasks = await resp.json();
  const subtaskCount = document.querySelector(".countSubtask");
  subtaskCount.innerHTML = "";
  const subtaskNum = document.createElement("div");
  subtaskNum.className = "count";
  subtaskNum.textContent =
    "Incomplete Subtasks: " +
    subtasks.filter(function (subtasks) {
      return (
        subtasks.status == "Not yet started" ||
        subtasks.status == "Working on it"
      );
    }).length;
  subtaskCount.appendChild(subtaskNum);
  const ctxx = document.getElementById("pieChart2");
  const completed = subtasks.filter(function (subtasks) {
    return subtasks.status == "Done";
  }).length;
  const inCompleted = subtasks.filter(function (subtasks) {
    return (
      subtasks.status == "Not yet started" || subtasks.status == "Working on it"
    );
  }).length;
  const data = {
    labels: ["Completed Subtask", "Incompleted Subtask"],
    datasets: [
      {
        label: "My First Dataset",
        data: [completed, inCompleted],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  };
  new Chart(ctxx, {
    type: "pie",
    data: data,
  });
}
