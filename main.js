// Add new task card.
function onAddTask() {
  let containerTask = document.getElementById("containerCard");
  let time = document.getElementById("time");
  let date = document.getElementById("date");
  let text = document.getElementById("text");
  let title = document.getElementById("title");

  try {
    validateInput(date, text, title);
    notesArr = saveTasks(time, date, text, title);
    addFullNoteCard(containerTask, notesArr, notesArr.length - 1);
    resetInputsUI()

    console.log("Succssesfully");
  } catch (error) {
    console.log(error);
    for (_error in error) {
      showError(_error, error[_error]);
    }
  }
}

// Function of Validations.
function validateInput(date, text, title) {
  resetErrorFieldsUI();

  //Imports all the validations as Objects.
  const validationObject = {
    title: isEmptyField(title.value) ? "Title cannot be empty" : title.value.length > 23 && "Title cannot be over 23 characters",
    date: isEmptyField(date.value) && "Date cannot be empty",
    text: isEmptyField(text.value) ? "Task Message cannot be empty, <br> Min 4 characters." : text.value.length < 4 && "Task text is too low, Min 4 characters.",
  };

  const isValid = Object.values(validationObject).every((value) => value === false);

  if (!isValid) {
    throw validationObject;
  }

  return true;
}

// Function that show you all the errors.
function showError(id, errorMessage) {
  if (!errorMessage) return;
  let node = document.getElementById(id);
  node.style.border = "2px solid red";

  let errorsNode = document.getElementById(id + "-error");
  errorsNode.innerHTML = errorMessage;
}

// Function that cleans all the errors.
function cleanErrorFromElement(id) {
  let node = document.getElementById(id);
  node.style.border = "";
  let errorsNode = document.getElementById(id + "-error");
  errorsNode.innerHTML = "";
}

// Function that reset all the errors fields.
function resetErrorFieldsUI() {
  cleanErrorFromElement("title");
  cleanErrorFromElement("date");
  cleanErrorFromElement("time");
  cleanErrorFromElement("text");
}

// Function checking if the fields are empty.
function isEmptyField(field) {
  if (field == null || field == "") {
    return true;
  }

  return false;
}

function addFullNoteCard(containerTask, notesArr, index) {
  let createdNewTask = document.createElement("div");
  getTaskCard(createdNewTask, notesArr, index);
  getTaskId(createdNewTask, notesArr, index);
  getTaskTitle(createdNewTask, notesArr, index);
  getTaskDetails(createdNewTask, notesArr, index);
  getTaskDate(createdNewTask, notesArr, index);
  getTaskTime(createdNewTask, notesArr, index);
  removeTask(createdNewTask);
  containerTask.append(createdNewTask);
}

// Function that creating new task div card.
function getTaskCard(createdNewTask, notesArr, index) {
  createdNewTask.setAttribute("id", notesArr[index].id);
  createdNewTask.setAttribute("class", "newTaskDiv");
  createdNewTask.style.animation = "fadeIn 2s";
}

function getTaskTitle(createdNewTask, notesArr, index) {
  let taskTitle = document.createElement("div");
  taskTitle.setAttribute("class", "title-card");

  taskTitle.innerHTML = notesArr[index].title;
  createdNewTask.append(taskTitle);
}

// Function that creating date of task div inside the task card.
function getTaskDate(createdNewTask, notesArr, index) {
  let taskDate = document.createElement("div");
  taskDate.setAttribute("class", "date-card");

  taskDate.innerHTML = "Date : " + notesArr[index].date;
  createdNewTask.append(taskDate);
}

// Function that creating time of task div inside the task card.
function getTaskTime(createdNewTask, notesArr, index) {
  let taskTime = document.createElement("div");
  taskTime.setAttribute("class", "time-card");

  taskTime.innerHTML = "Time : " + notesArr[index].time;
  createdNewTask.append(taskTime);
}

function getTaskId(createdNewTask, notesArr, index) {
  let taskId = document.createElement("div");
  taskId.setAttribute("class", "task-id");

  taskId.innerHTML = "Task : " + (index + 1);
  createdNewTask.append(taskId);
}

// Function that creating text of task div inside the task card.
function getTaskDetails(createdNewTask, notesArr, index) {
  let taskDetails = document.createElement("div");
  taskDetails.setAttribute("class", "textarea-card");
  taskDetails.innerHTML = notesArr[index].text;
  createdNewTask.append(taskDetails);
}

// Function that saving all the tasks from LocalStorage.
function saveTasks(time, date, text, title) {
  let strNotesCounter = localStorage.getItem("notesCounter");
  let notesCounter;
  if (!strNotesCounter) {
    notesCounter = 0;
  } else {
    notesCounter = JSON.parse(strNotesCounter);
  }

  let taskObject = {
    time: time.value,
    date: date.value,
    text: text.value,
    title: title.value,
    id: notesCounter++,
  };

  localStorage.setItem("notesCounter", JSON.stringify(notesCounter));

  let notesArr;
  let strNotes = localStorage.getItem("notesArr");

  if (!strNotes) {
    notesArr = [];
  } else {
    notesArr = JSON.parse(strNotes);
  }

  notesArr.push(taskObject);
  localStorage.setItem("notesArr", JSON.stringify(notesArr));
  return notesArr;
}

// Function that loading all the tasks from LocalStorage.
function loadsTasks() {
  let strNotes = localStorage.getItem("notesArr");

  if (!strNotes) {
    return;
  }

  let notesArr = JSON.parse(strNotes);
  let containerTask = document.getElementById("containerCard");
  containerTask.innerHTML = "";

  for (index = 0; index < notesArr.length; index++) {
    addFullNoteCard(containerTask, notesArr, index);
  }
}
loadsTasks();

// Function that creating button to remove task inside the task card.
function removeTask(createdNewTask) {
  let removeTask = document.createElement("input");
  removeTask.setAttribute("class", "trashBtn");
  removeTask.setAttribute("type", "button");
  createdNewTask.append(removeTask);

  removeTask.addEventListener("click", function (event) {
    let removeCard = event.target.parentNode;
    let notesArr = JSON.parse(localStorage.getItem("notesArr"));
    localStorage.setItem("notesCounter", localStorage.getItem("notesCounter") - 1);

    let tasksQubesArray = Array.prototype.slice.call(document.getElementsByClassName("newTaskDiv"));
    let taskIndex = tasksQubesArray.indexOf(event.target.parentElement);

    removeId(notesArr, createdNewTask.id);

    $(removeCard).fadeOut("slow", function () {
      removeCard.parentNode.removeChild(removeCard);
      let tasksQubes = document.getElementsByClassName("task-id");

      for (let i = taskIndex; i < tasksQubes.length; i++) {
        tasksQubes[i].innerHTML = "Task : " + (i + 1);
      }
    });
  });
}

// Function that removing all the tasks by ID from LocalStorage.
function removeId(notesArr, taskObjectId) {
  for (let index = 0; index < notesArr.length; index++) {
    if (notesArr[index].id == taskObjectId) {
      notesArr.splice(index, 1);
    }
  }
  localStorage.setItem("notesArr", JSON.stringify(notesArr));
}

// Function that clearing all the page by click.
function removeAllTasks() {
  let msg = confirm("Are you sure you want to delete all tasks permanently?");
  if (msg == true) {
    let removeContainer = document.getElementById("containerCard");
    removeContainer.parentNode.removeChild(removeContainer);
    localStorage.clear();
    location.reload();
    alert("Your tasks has been removed.");
  }
  return;
}

// Function that init all the inputs.
function resetInputsUI() {
  let titleElement = document.getElementById("title");
  let dateElement = document.getElementById("date");
  let timeElement = document.getElementById("time");
  let textElement = document.getElementById("text");

  titleElement.value = "";
  timeElement.value = "";
  dateElement.value = "";
  textElement.value = "";
  resetErrorFieldsUI();
}

function fadeIn(createdNewTask) {
  var op = 0.1; // initial opacity
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    createdNewTask.style.opacity = op;
    createdNewTask.style.filter = "alpha(opacity=" + op * 100 + ")";
    op += op * 0.1;
  }, 10);
}

let dialLines = document.getElementsByClassName("diallines");
let clockEl = document.getElementsByClassName("clock")[0];

for (let i = 1; i < 60; i++) {
  clockEl.innerHTML += "<div class='diallines'></div>";
  dialLines[i].style.transform = "rotate(" + 6 * i + "deg)";
}

function clock() {
  let weekday = new Array(7),
    d = new Date(),
    h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds(),
    date = d.getDate(),
    month = d.getMonth() + 1,
    year = d.getFullYear(),
    hDeg = h * 30 + m * (360 / 720),
    mDeg = m * 6 + s * (360 / 3600),
    sDeg = s * 6,
    hEl = document.querySelector(".hour-hand"),
    mEl = document.querySelector(".minute-hand"),
    sEl = document.querySelector(".second-hand"),
    dateEl = document.querySelector(".date"),
    dayEl = document.querySelector(".day");

  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  let day = weekday[d.getDay()];

  if (month < 9) {
    month = "0" + month;
  }

  hEl.style.transform = "rotate(" + hDeg + "deg)";
  mEl.style.transform = "rotate(" + mDeg + "deg)";
  sEl.style.transform = "rotate(" + sDeg + "deg)";
  dateEl.innerHTML = date + "/" + month + "/" + year;
  dayEl.innerHTML = day;
}

setInterval("clock()", 100);
