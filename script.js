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
let svgCode = '<svg class="delete" width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use class="delete" fill="#C3CAD9" fill-rule="nonzero" xlink:href="#a"/></svg>';

// Foucs On Input Field
window.onload = function () {
  theInput.focus();
}
let iText = null;

function addTask(text, formattedDate) {
  // Check if the task already exists
  let taskExists = Array.from(document.querySelectorAll('.task-box')).some(task => {
    // Extract the task description from task.textContent
    let taskText = task.querySelector('i').textContent.trim();

    let taskDescription = taskText.split('Time of creation:')[0].trim();
    // Compare the extracted task description with the input text
    let comparisonResult = taskDescription.trim() === text;
    console.log("task Description",taskDescription);
    console.log("comparisonResult",comparisonResult);
    
    return comparisonResult;
  });
  console.log("task Exists",taskExists);


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

    deleteAll.style.display = 'block';
    finishAll.style.display = 'block';
    // Append Delete Button  
    mainSpan.innerHTML = svgCode;
    iText = document.createElement('i')
    iText.appendChild(document.createTextNode(text))
    // Add new text  
    mainSpan.appendChild(iText);
    // Add class to mainElement
    mainSpan.className += 'task-box';
    // Format the date and time as desired
    let elementDate = document.createElement('span');
    elementDate.setAttribute('class', 'date-ForElement')
    elementDate.innerHTML = `${formattedDate}`;
    // Append element Date to main span
    mainSpan.appendChild(elementDate);
    // Retrieve existing tasks from local storage or initialize as an empty array
    let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Store task details in local storage
    let taskDetails = {
      text: text,
      dateCreated: formattedDate,
    };
    // Add the new task to the array
    storedTasks.push(taskDetails);
    // Store the updated tasks array back in local storage
    localStorage.setItem('tasks', JSON.stringify(storedTasks));
    // Add the task to the container
    tasksContainer.appendChild(mainSpan);

    const updateLocalStorageFromDOM = () => {
      const tasks = Array.from(tasksContainer.querySelectorAll('.task-box')).map((task, index) => {
        let taskText = task.querySelector('i').textContent.trim();
        return {
          text: taskText,
          dateCreated: task.querySelector('.date-ForElement').textContent.trim(),
        };
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          updateLocalStorageFromDOM();
        }
      });
    });
    observer.observe(tasksContainer, { childList: true });

    // Enable drag and drop for the task
    mainSpan.draggable = true;

    mainSpan.addEventListener(`dragstart`, (evt) => {
      evt.target.classList.add(`selected`);
    });
    mainSpan.addEventListener(`dragend`, (evt) => {
      evt.target.classList.remove(`selected`);
    });

    const getNextElement = (cursorPosition, currentElement) => {
      const currentElementCoord = currentElement.getBoundingClientRect();
      const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
      console.log(currentElementCenter);
      const nextElement = (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;
      return nextElement;
    };
    
    mainSpan.addEventListener(`dragover`, (evt) => {
      evt.preventDefault();
      const activeElement = tasksContainer.querySelector(`.selected`);
      const currentElement = evt.target;
      const isMoveable = activeElement !== currentElement && currentElement.classList.contains(`task-box`);
      if (!isMoveable) {
        return;
      }
      const nextElement = getNextElement(evt.clientY, currentElement);
      if (nextElement && activeElement === nextElement.previousElementSibling ||activeElement === nextElement) {
        return;
      }
      tasksContainer.insertBefore(activeElement, nextElement);
    });
    calculate();
  };
};



















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


