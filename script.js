/*
  ![1] Use Sweet Alert If Input Is Empty
  ![2] Check if Task is exist
  ![3] Create delete all tasks Button
  ![4] Create Finish all tasks Button
  TODO:------------------ Hard Tasks ------------------
  ![5] Add To Tasks To The Local Storage
  ![6] add Date on task  
*/

// Setting Up Variables
let theInput = document.querySelector('.add-task input');
let theAddButton = document.querySelector('.add-task button');
let tasksContainer = document.querySelector('.tasks-content');
let tasksCount = document.querySelector('.tasks-count span');
let tasksCompleted = document.querySelector('.tasks-completed span');
let taskStats = document.querySelector('.task-stats')
let deleteAll = document.querySelector('.delete-all');
let finishAll = document.querySelector('.finish-all');
var svgCode = '';

// Foucs On Input Field
window.onload = function () {
  theInput.focus();
}

function addTask(text, formattedDate) {
  // Check if the task already exists
  let taskExists = Array.from(document.querySelectorAll('.task-box')).some(task => {
    // Extract the task description from task.textContent
    let taskText = task.textContent.trim();
    let taskDescription = taskText.split('Time of creation:')[0];
    // Compare the extracted task description with the input text
    let comparisonResult = taskDescription.trim() === text;
    return comparisonResult;
  });

  if(taskExists){
    // Task already exists, show error message
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Task exists, type a different task",
    });
  } else {
    // Create span element 
    let mainSpan = document.createElement('span');
    // Set a unique ID for each task-box element
    let taskId = 'task_' + Math.random().toString(36).substr(2, 9); // Generate a random ID
    mainSpan.id = taskId;
    deleteAll.style.display = 'block';
    finishAll.style.display = 'block';
    // Append Delete Button  
    mainSpan.innerHTML = svgCode;
    // Add new text  
    mainSpan.appendChild(document.createTextNode(text));
    // Add class to mainElement
    mainSpan.className += 'task-box';
    mainSpan.draggable = true;

    // Format the date and time as desired
    // Add Element Date  
    let elementDate = document.createElement('span');
    elementDate.setAttribute('class', 'date-ForElement')
    elementDate.innerHTML = `Time of creation: ${formattedDate}`;
    // Append element Date to main span
    mainSpan.appendChild(elementDate);

    // Retrieve existing tasks from local storage or initialize as an empty array
    let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Order is initially set to the current number of tasks
    let order = storedTasks.length;
    // Store task details in local storage
    let taskDetails = {
      id: taskId, // Assign the generated ID to the task
      text: text,
      dateCreated: formattedDate,
      order: order // Include the order property
    };
    // Add the new task to the array
    storedTasks.push(taskDetails);
    // Store the updated tasks array back in local storage
    localStorage.setItem('tasks', JSON.stringify(storedTasks));
    
    // Add the task to the container
    tasksContainer.appendChild(mainSpan);

    // Enable drag and drop for the task
    mainSpan.draggable = true;
    mainSpan.addEventListener('dragstart', handleDragStart);
    mainSpan.addEventListener('dragover', handleDragOver);
    mainSpan.addEventListener('drop', handleDrop);
    // calculate tasks
    calculate();
  }
}
function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
}
function handleDragOver(event) {
  event.preventDefault();
}
function handleDrop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  const draggedTask = document.getElementById(taskId);
  const tasks = Array.from(tasksContainer.querySelectorAll('.task-box'));
  const indexDragged = tasks.indexOf(draggedTask);
  const indexTarget = tasks.indexOf(event.currentTarget);
  
  // Swap the order and id properties of the dragged task and the target task
  if (indexDragged !== -1 && indexTarget !== -1) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const draggedTaskInfo = storedTasks.find(task => task.id === taskId);
    const targetTaskInfo = storedTasks.find(task => task.order === indexTarget);

    // Update the order and id properties
    draggedTaskInfo.order = indexTarget;
    targetTaskInfo.order = indexDragged;

    // Swap the order of the tasks in the array
    storedTasks[indexTarget] = draggedTaskInfo;
    storedTasks[indexDragged] = targetTaskInfo;

    localStorage.setItem('tasks', JSON.stringify(storedTasks));
    
    // Swap the positions of the tasks on the page
    if (indexDragged < indexTarget) {
      tasksContainer.insertBefore(draggedTask, event.currentTarget.nextSibling);
    } else {
      tasksContainer.insertBefore(draggedTask, event.currentTarget);
    }
  }
}





theAddButton.onclick = function () {
  // if input is empty 
  if (theInput.value === '') {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You should write task before to press!",
    });
  } else {
    toggleNoTasksMessage()
    // Add text to span
    let text = theInput.value.trim(); // Trim to remove leading and trailing spaces
    // Create a new Date object to get the current date and time
    let currentDate = new Date();
    // Format the date and time as desired
    let formattedDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    addTask(text, formattedDate);

    // empty the input
    theInput.value = '';
    // focus on field
    theInput.focus();
    calculate()
  }
};

// Delete all Tasks when click btn deleteAll
deleteAll.addEventListener('click', function () {
  let allTasks = document.querySelectorAll('.task-box');
  allTasks.forEach(task => {
    task.remove();
    localStorage.removeItem('tasks')
  });
  updateDeleteAllVisibility()
  // chack number of tasks inside the container
  if(tasksContainer.childElementCount == 0){
    noTasks()
  }
});

window.onload = function () {
  // Focus on input field
  theInput.focus();

  // Check if local storage is supported by the browser
  if (typeof(Storage) !== "undefined") {
    // Retrieve tasks from local storage
    let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Clear existing tasks in the DOM
    tasksContainer.innerHTML = '';
    localStorage.clear()
    // Loop through the stored tasks and add them to the DOM
    storedTasks.forEach(taskDetails => {
      addTask(taskDetails.text, taskDetails.dateCreated);
    });
    // Update task counts
    calculate();

    // Check if there are no tasks and display appropriate message
    if (storedTasks.length === 0) {
      noTasks();
    }
  } else {
    console.log("Local storage is not supported in this browser.");
  }
};

document.addEventListener('click',function(e) {
  if (e.target.classList.contains('delete')) {
    let taskBox = e.target.closest('.task-box');
    if (taskBox) {
      // Retrieve the task text
      let taskText = taskBox.textContent.trim().split('Time of creation:')[0].trim();

      // Retrieve existing tasks from localStorage
      let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

      // Find the index of the task to be removed
      let taskIndex = storedTasks.findIndex(task => task.text === taskText);

      // Remove the task from the storedTasks array and update localStorage
      if (taskIndex !== -1) {
        storedTasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
      }
      // Remove the task-box element from the DOM
      taskBox.remove();
    }

    // chack number of tasks inside the container
    if(tasksContainer.childElementCount == 0){
      noTasks()
      updateDeleteAllVisibility()
    }
    // calculate tasks
    calculate()
  }

  if (e.target.classList.contains('task-box')) {
    e.target.classList.toggle('finished')
    // calculate tasks
  }
  // Add class Finish to Task-boxes when click btn FinishAll
  finishAll.onclick = function(e){
    let allTasks = document.querySelectorAll('.task-box');
    allTasks.forEach(task => {
      task.classList.add('finished');
    });
  }
  calculate()
}) 

// function to create no tasks message
function noTasks(){
  // create message span element
  let msgSpan = document.createElement('span');
  // create the text Message
  let msgText = document.createTextNode('No Tasks To Show');
  // Add text To Message Span Element 
  msgSpan.appendChild(msgText)
  // Add class To message Span
  msgSpan.className = 'no-tasks-Massage';
  // Append the message span element to the task Container 
  tasksContainer.appendChild(msgSpan)
};

// Function to calculate tasks
function calculate() {
  // calculate all tasks
  tasksCount.innerHTML = document.querySelectorAll('.tasks-content .task-box').length;
  // calculate Completed tasks
  tasksCompleted.innerHTML = document.querySelectorAll('.tasks-content .finished').length;
}

// update DeleteAll Visibility
function updateDeleteAllVisibility() {
  let allTasks = document.querySelectorAll('.task-box');
  if (allTasks.length === 0) {
    deleteAll.style.display = 'none';
    finishAll.style.display = 'none';
  } else {
    deleteAll.style.display = 'block';
    finishAll.style.display = 'block';
  }
  
}

// Function to toggle the display of the 'no-tasks-Massage' element based on the presence of tasks
function toggleNoTasksMessage() {
  let noTasksMsg = document.querySelector('.no-tasks-Massage');
  if (document.body.contains(document.querySelector('.no-tasks-Massage'))) {
    // If there are no tasks, display the message
    noTasksMsg.remove()
  } 
}


