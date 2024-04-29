/*
  ![1] Use Sweet Alert If Input Is Empty
  ![2] Check if Task is exist
  ![3] Create delete all tasks Button
  ![4] Create Finish all tasks Button
  ?------------------
  [5] Add To Tasks To The Local Storage
  [6] Add Drag drop and drag drop to To The Local Storage
  [7] add Date on task  
  [8] add all tasks is finished to element Tasks is Finished
  [9] add all tasks is Deleted to element Tasks is Deleted
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
var svgCode = '<svg class="delete" width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use class="delete" fill="#C3CAD9" fill-rule="nonzero" xlink:href="#a"/></svg>';

// Foucs On Input Field
window.onload = function () {
  theInput.focus();
}
// adding the task
theAddButton.onclick = function () {
  // if input is empty 
  if (theInput.value === '') {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You should write task before to press!",
    });
    // Task One
  }else{
    let noTasksMsg = document.querySelector('.no-tasks-Massage');
    // check if span with no tasks message is exist
    if (document.body.contains(document.querySelector('.no-tasks-Massage'))) {
      // Remove no Tasks Message
      noTasksMsg.remove()
    }
    // Add text to span
    let text = theInput.value.trim(); // Trim to remove leading and trailing spaces
    // Check if the task already exists
    let taskExists = Array.from(document.querySelectorAll('.task-box')).some(task => {
      return task.textContent.trim() === text;
    });
    if(taskExists){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Task exists, type a different task",
      });
    }else{
      // create span element 
      let mainSpan = document.createElement('span');
      deleteAll.style.display = 'block';
      finishAll.style.display = 'block';

      // append Delete Button  
      mainSpan.innerHTML = svgCode;
      // add new text  
      mainSpan.appendChild(document.createTextNode(text));

      // add class to mainElement
      mainSpan.className += 'task-box';
      // add the task to the container
      tasksContainer.appendChild(mainSpan);

      // Delete all Tasks when click btn deleteAll
      deleteAll.addEventListener('click', function(){
        let allTasks = document.querySelectorAll('.task-box');
        allTasks.forEach(task => {
          task.remove();
        });
        updateDeleteAllVisibility()
      })


      // empty the input
      theInput.value = '';
      // focus on field
      theInput.focus();
      // calculate tasks
      calculate()
    }
  };
};
document.addEventListener('click',function(e) {
  if (e.target.classList.contains('delete')) {
    let taskBox = e.target.closest('.task-box');
    if (taskBox) {
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



































































