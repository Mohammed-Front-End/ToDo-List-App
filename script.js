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
// Icon Delete
let svgCode =
    '<svg class="delete" width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use class="delete" fill="#C3CAD9" fill-rule="nonzero" xlink:href="#a"/></svg>';


let iText = null;
function addTask(text, formattedDate, finish, boo) {
  // Check if the task already exists
  const taskExists =
      Array.from(document.querySelectorAll('.task-box')).some(task => {
        // Extract the task description from task.textContent
        const taskText = task.querySelector('p').textContent.trim();
        const taskDescription = taskText.split('Time of creation:')[0].trim();
        // Compare the extracted task description with the input text
        return taskDescription === text;
      });

  if (taskExists) {
    // Task already exists, show error message
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Task exists, type a different task',
    });
    return;  // Exit function if task already exists
  }

  // Create span element
  const mainSpan = document.createElement('span');
  deleteAll.style.display = 'block';
  finishAll.style.display = 'block';
  // Append Delete Button
  mainSpan.innerHTML = svgCode;

  // Create paragraph for task text
  const iText = document.createElement('p');
  iText.className = 'Text-task';
  iText.textContent = text;
  // Append task text to main span
  mainSpan.appendChild(iText);

  // Add class to main span
  mainSpan.classList.add('task-box');

  // Format the date and time as desired
  const elementDate = document.createElement('span');
  elementDate.className = 'date-ForElement';
  elementDate.textContent = formattedDate;
  // Append element Date to main span
  mainSpan.appendChild(elementDate);

  // Create input checkbox
  const inputCheckbox = document.createElement('input');
  inputCheckbox.setAttribute('type', 'checkbox');
  inputCheckbox.checked = finish;
  inputCheckbox.className = 'inputChacked';
  // Append checkbox to main span
  mainSpan.appendChild(inputCheckbox);

  // Set task details
  mainSpan.setAttribute('id', generateRandomId());
  mainSpan.setAttribute('data-finish', finish);

  // Add the task to the container
  tasksContainer.appendChild(mainSpan);

  // Store task details in local storage
  addItemToCart(text, formattedDate, finish, boo);

  // Enable drag and drop for the task
  mainSpan.draggable = true;
  mainSpan.addEventListener(`dragstart`, (evt) => {
    evt.target.classList.add(`selected`);
  });
  mainSpan.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
  });
  mainSpan.addEventListener(`dragover`, dragover);

  // Update task counts
  calculate();
}


function addItemToCart(text, formattedDate, finish, boo) {
  let storedTasks =
      JSON.parse(localStorage.getItem('tasks') || '[]');  // get current objects
  let taskDetails =
      {text: text, dateCreated: formattedDate, finishTask: finish, id: boo};
  storedTasks.push(taskDetails);  // push new one
  localStorage.setItem('tasks', JSON.stringify(storedTasks));
}


function updateFromlocalStorageToDOM() {
  // Retrieve tasks from the DOM
  const tasks =
      Array.from(tasksContainer.querySelectorAll('.task-box')).map(task => {
        const taskText = task.querySelector('p').textContent.trim();
        const taskId = task.getAttribute('id');
        const checkbox = task.querySelector('input[type="checkbox"]');
        const isChecked = checkbox.checked;

        // Update the class based on the checkbox state
        if (isChecked) {
          task.classList.add('finished');
        } else {
          task.classList.remove('finished');
        }

        // Store the checkbox state in local storage
        localStorage.setItem('tasks', isChecked ? 'true' : 'false');

        return {
          text: taskText,
          dateCreated:
              task.querySelector('.date-ForElement').textContent.trim(),
          finishTask: isChecked,
          id: taskId
        };
      });

  // Update local storage with the task details
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


window.onload = function() {
  // Focus on input field
  theInput.focus();

  // Check if local storage is supported by the browser
  if (typeof (Storage) !== 'undefined') {
    // Retrieve tasks from local storage
    let storedTasks = JSON.parse(localStorage.getItem('tasks'));
    // Clear existing tasks in the DOM
    tasksContainer.innerHTML = '';

    // Add tasks from local storage to the DOM
    if (storedTasks) {
      storedTasks.forEach(taskDetails => {
        addTask(
            taskDetails.text, taskDetails.dateCreated, taskDetails.finishTask,
            taskDetails.id);
      });
    }

    // Update task counts
    calculate();

    // Check if there are no tasks and display appropriate message
    if (!storedTasks || storedTasks.length === 0) {
      noTasks();
    }
  } else {
    console.log('Local storage is not supported in this browser.');
  }
};



const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach(mutation => {
    if (mutation.type === 'childList') {
      updateFromlocalStorageToDOM();
    }
  });
});
observer.observe(tasksContainer, {childList: true});

function updateLocalStorageTaskCompletion(taskId, isCompleted) {
  let storedTasks = JSON.parse(localStorage.getItem('tasks'));
  storedTasks.forEach(task => {
    if (task.id === taskId) {
      // Update the finishTask property
      task.finishTask = isCompleted;
    }
  });
  // Update local storage with the modified storedTasks array
  localStorage.setItem('tasks', JSON.stringify(storedTasks));
}



function handleTaskClick(e) {
  // Handle checkbox clicks
  if (e.target.type === 'checkbox') {
    let taskId = e.target.closest('.task-box').getAttribute('id');
    e.target.parentNode.classList.toggle('finished');
    updateLocalStorageTaskCompletion(taskId, e.target.checked);
    updateFromlocalStorageToDOM()
  }
  // Handle clicking on task boxes
  if (e.target.classList.contains('task-box') && e.target.type !== 'checkbox') {
    let taskBox = e.target;
    let checkbox = taskBox.querySelector('input[type="checkbox"]');
    let taskId = taskBox.getAttribute('id');
    e.target.classList.toggle('finished');
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
    updateLocalStorageTaskCompletion(taskId, checkbox.checked);
    updateFromlocalStorageToDOM()
  }
  // Handle clicking on the "Finish All" button
  if (e.target.classList.contains('finish-all')) {
    let allTasks = document.querySelectorAll('.task-box');
    allTasks.forEach(task => {
      let checkbox = task.querySelector('input[type="checkbox"]');
      let taskId = task.getAttribute('id');
      task.classList.add('finished');
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));
      updateLocalStorageTaskCompletion(taskId, true);
      updateFromlocalStorageToDOM()
    });
  }
  // calculate tasks
  calculate();
}
document.addEventListener('click', handleTaskClick);



// Create Random id
function generateRandomId() {
  const randomId = Math.floor(Math.random() * 1000000);
  return randomId;
}

function getNextElement(cursorPosition, currentElement) {
  const currentElementCoord = currentElement.getBoundingClientRect();
  const currentElementCenter =
      currentElementCoord.y + currentElementCoord.height / 2;
  // console.log(currentElementCenter);
  const nextElement = (cursorPosition < currentElementCenter) ?
      currentElement :
      currentElement.nextElementSibling;
  return nextElement;
};
function dragover(evt) {
  evt.preventDefault();
  const activeElement = tasksContainer.querySelector(`.selected`);
  const currentElement = evt.target;
  const isMoveable = activeElement !== currentElement &&
      currentElement.classList.contains(`task-box`);
  if (!isMoveable) {
    return;
  }
  const nextElement = getNextElement(evt.clientY, currentElement);
  if (nextElement && activeElement === nextElement.previousElementSibling ||
      activeElement === nextElement) {
    return;
  }
  tasksContainer.insertBefore(activeElement, nextElement);
};

theAddButton.onclick = function() {
  // if input is empty
  if (theInput.value === '') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You should write task before to press!',
    });
  } else {
    toggleNoTasksMessage()
    // Add text to span
    let text =
        theInput.value.trim();  // Trim to remove leading and trailing spaces
    // Create a new Date object to get the current date and time
    let currentDate = new Date();
    // Format the date and time as desired
    let formattedDate = `${currentDate.getFullYear()}/${
        currentDate.getMonth() + 1}/${currentDate.getDate()} ${
        currentDate.getHours()}:${currentDate.getMinutes()} ${
        currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    addTask(text, formattedDate);
    // empty the input
    theInput.value = '';
    // focus on field
    theInput.focus();
    calculate()
  }
};
// Delete all Tasks when click btn deleteAll
deleteAll.addEventListener('click', function() {
  let allTasks = document.querySelectorAll('.task-box');
  allTasks.forEach(task => {
    task.remove();
    localStorage.removeItem('tasks')
  });
  updateDeleteAllVisibility()
  // chack number of tasks inside the container
  if (tasksContainer.childElementCount == 0) {
    noTasks()
  }
});
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete')) {
    let taskBox = e.target.closest('.task-box');
    if (taskBox) {
      // Retrieve the task text
      let taskText =
          taskBox.textContent.trim().split('Time of creation:')[0].trim();

      // Retrieve existing tasks from localStorage
      let storedTasks = JSON.parse(localStorage.getItem('tasks'));

      // Find the index of the task to be removed
      let taskIndex = storedTasks.findIndex(task => task.text === taskText);

      // Remove the task from the storedTasks array and update localStorage
      if (taskIndex !== -1) {
        storedTasks.splice(taskIndex, 1);
        // localStorage.setItem('tasks', JSON.stringify(storedTasks));
      }
      // Remove the task-box element from the DOM
      taskBox.remove();
    }
    // chack number of tasks inside the container
    if (tasksContainer.childElementCount == 0) {
      noTasks()
      updateDeleteAllVisibility()
    }
    // calculate tasks
    calculate()
  }
})
// function to create no tasks message
function noTasks() {
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
  tasksCount.innerHTML =
      document.querySelectorAll('.tasks-content .task-box').length;
  // calculate Completed tasks
  tasksCompleted.innerHTML =
      document.querySelectorAll('.tasks-content .finished').length;
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
// Function to toggle the display of the 'no-tasks-Massage' element based on the
// presence of tasks
function toggleNoTasksMessage() {
  let noTasksMsg = document.querySelector('.no-tasks-Massage');
  if (document.body.contains(document.querySelector('.no-tasks-Massage'))) {
    // If there are no tasks, display the message
    noTasksMsg.remove()
  }
}
