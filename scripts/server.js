const API = 'http://localhost:5000'

const date = new Date();

const userId = localStorage.getItem('userId')

const taskList = document.getElementById('taskList')

const editModal = new bootstrap.Modal(
    document.getElementById('editTaskModal')
)
const addModal = new bootstrap.Modal(
    document.getElementById('addTaskModal')
)

if(localStorage.getItem('theme')=='light'){
    $('#themeBtn').removeClass('bi-sun-fill')
        $('#themeBtn').addClass('bi-moon-fill')
        document.body.setAttribute("data-theme", "light");
}
else{
        $('#themeBtn').addClass('bi-sun-fill')
        $('#themeBtn').removeClass('bi-moon-fill')
        document.body.setAttribute("data-theme", "dark");
}
async function getUserName(){
    const response = await fetch(`${API}/users/${userId}`)
    const data = await response.json()
    let name = data.name;
   name = name.split(' ')
    $('#usersName').text(name[0])
}
getUserName();


toastr.options = {
        "positionClass": "toast-bottom-right",
        "showDuration": "300",
        "preventDuplicates": true
      }

function isOverdue(dueDate, completed){

    if(completed) return false;
    const today = new Date();
    console.log(today)
    const [year, month, day] = dueDate.split('-');
    const taskDueDate = new Date(year, month - 1, day);
    today.setHours(0,0,0,0);
    taskDueDate.setHours(0,0,0,0);
    console.log(taskDueDate < today)
    return taskDueDate < today;
}

function refreshTab(){
    if(allTaskTab){
        getAllTask()
     }
     else if(completedTaskTab){
        getPendorCompleteTask(true)
     }
     else if(pendingTaskTab){
        getPendorCompleteTask(false)
     }
     else{
        getNotStartedTask()
     }
}

function toggleTheme(){
  const currentTheme = document.body.getAttribute("data-theme");


    if(currentTheme === "dark"){
        $('#themeBtn').removeClass('bi-sun-fill')
        $('#themeBtn').addClass('bi-moon-fill')
        document.body.setAttribute("data-theme", "light");
        localStorage.setItem('theme','light')

        
    }
    else{
      $('#themeBtn').addClass('bi-sun-fill')
        $('#themeBtn').removeClass('bi-moon-fill')
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem('theme','dark')
       
    }
}


let allTaskTab = false;
let pendingTaskTab = false;
let completedTskTab = false;
let notStartedTaskTab = false;

async function addTask(){
          try {
        const title = $('#addtaskTitle').val();
        const desc = $('#addTaskDesc').val();
        const priority = $('#addTaskPrior').val();
        const dueDate = $('#addTaskDueDate').val();
        const response = await fetch(`${API}/tasks`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            title:title,
            description:desc,
            priority: priority,
            completed:false,
            createdAt : `${date.toISOString().split('T')[0]}`,
            dueDate : dueDate,
            userId : userId,
            deleted:false,
            started:false
        })
    })
    console.log('Data added');
    return 'Data Added'
    } catch (error) {
        console.log(error)
        return error
    }
  
}

async function getAllTask() {
    try {
    console.log(userId)
    const response = await fetch(`${API}/tasks?userId=${userId}&deleted=false&started=true&_sort=-createdAt`) 
    const data = await response.json()
    console.log(data)
    taskList.replaceChildren();
    completedTaskTab = false;
    pendingTaskTab = false;
    notStartedTaskTab = false;
    allTaskTab = true;
    data.forEach(task => {
        const div = document.createElement('div');
        div.innerHTML = ` <div class="card  rounded-4 shadow-sm">
            <div class="card-body d-flex justify-content-between">
                  <div class="${task.completed?"completed-text":""}">
                       <h4>${task.title}</h4>
                       <p>${task.description}</p>
                       <p class="text-secondary mb-1">
        <i class="bi bi-calendar-event"></i>
        Created: ${task.createdAt}
    </p>
     <p class="text-secondary mb-2">
        <i class="bi bi-calendar2-check"></i>
        Due: ${task.dueDate}
    </p>
                       <span class="${task.completed?"completed":"pending"}"><i class="bi ${task.completed?"bi-check-circle":"bi-clock"}"></i>${task.completed?"Completed":"Pending"}</span>
                         ${
        isOverdue(task.dueDate, task.completed)
        ?
        `<span class="overdue mb-2">
            <i class="bi bi-exclamation-circle"></i>
            Overdue
        </span>`
        :
        ""
    }
                  </div>
                  ${task.completed?`
                    <div class="d-flex flex-column justify-content-between align-items-center">
                    <div>
                    <button class="btn rounded-2 text-warning border-1 border-secondary-subtle py-2  fs-4 redo-btn border" onClick="undoTask('${task.id}')"><i class="bi bi-arrow-counterclockwise  "></i></button>
                      
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
                    </div>
                    ${task.priority=='high'?`<p class="text-center rounded-pill fs-6 fw-bold text-danger bg-danger-subtle px-3 py-2 mb-0">High priority</p>`:`<p class="text-center rounded-pill fs-6 fw-bold text-info bg-info-subtle px-3 py-2 mb-0">Low Priority</p>`}
                       
                  </div>
                    `:`
                     <div class="d-flex flex-column justify-content-between align-items-center">
                     <div>
                      <button class="btn rounded-2 text-success border-1 border-secondary-subtle py-2  fs-4 check-btn border" onClick="completeTask('${task.id}')"><i class="bi bi-check-circle  "></i></button>
                      <button class="btn fs-4 rounded-2 border-1 border-secondary-subtle py-2 border edit-btn" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick="updateTask('${task.id}')"><i class="bi bi-pencil " ></i></button>
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
                     </div>
                     ${task.priority=='high'?`<p class="text-center rounded-pill fs-6 fw-bold text-danger bg-danger-subtle px-3 py-2 mb-0">High priority</p>`:`<p class="text-center rounded-pill fs-6 fw-bold text-info bg-info-subtle px-3 py-2 mb-0">Low Priority</p>`}
                  </div>
                    `}
                 
            </div>
          </div>`
        taskList.append(div)
        
    });

    } catch (error) {
        
    }

}

async function getPendorCompleteTask(val){
    try {
        if(val){
            completedTaskTab = true;
            pendingTaskTab = false;
            allTaskTab = false;
            notStartedTaskTab = false;
        }
        else{
            completedTaskTab = false;
            pendingTaskTab = true;
            allTaskTab = false;
            notStartedTaskTab = false;
        }
    const response = await fetch(`${API}/tasks?completed=${val}&userId=${userId}&deleted=false&started=true&_sort=-createdAt`) 
    const data = await response.json()
    console.log(data)
    taskList.replaceChildren();
    data.forEach(task => {
        const div = document.createElement('div');
        
        div.innerHTML = ` <div class="card  rounded-4 shadow-sm">
            <div class="card-body d-flex justify-content-between">
                  <div class="${task.completed?"completed-text":""}">
                       <h4>${task.title}</h4>
                       <p>${task.description}</p>
                       <p class="text-secondary mb-1">
        <i class="bi bi-calendar-event"></i>
        Created: ${task.createdAt}
    </p>
     <p class="text-secondary mb-2">
        <i class="bi bi-calendar2-check"></i>
        Due: ${task.dueDate}
    </p>
                       <span class="${task.completed?"completed":"pending"}"><i class="bi ${task.completed?"bi-check-circle":"bi-clock"}"></i>${task.completed?"Completed":"Pending"}</span>
                       ${
        isOverdue(task.dueDate, task.completed)
        ?
        `<span class="overdue mb-2">
            <i class="bi bi-exclamation-circle"></i>
            Overdue
        </span>`
        :
        ""
    }
                  </div>
                  ${task.completed?`
                    <div class="d-flex flex-column justify-content-between align-items-center">
                    <div>
                    <button class="btn rounded-2 text-warning border-1 border-secondary-subtle py-2  fs-4 redo-btn border" onClick="undoTask('${task.id}')"><i class="bi bi-arrow-counterclockwise  "></i></button>
                      
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
                    </div>
                    ${task.priority=='high'?`<p class="text-center rounded-pill fs-6 fw-bold text-danger bg-danger-subtle px-3 py-2">High priority</p>`:`<p class="text-center rounded-pill fs-6 fw-bold text-info bg-info-subtle px-3 py-2">Low Priority</p>`}
                       
                  </div>
                    `:`
                      <div class="d-flex flex-column justify-content-between align-items-center">
                     <div>
                      <button class="btn rounded-2 text-success border-1 border-secondary-subtle py-2  fs-4 check-btn border" onClick="completeTask('${task.id}')"><i class="bi bi-check-circle  "></i></button>
                      <button class="btn fs-4 rounded-2 border-1 border-secondary-subtle py-2 border edit-btn" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick="updateTask('${task.id}')"><i class="bi bi-pencil " ></i></button>
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
                     </div>
                     ${task.priority=='high'?`<p class="text-center rounded-pill fs-6 fw-bold text-danger bg-danger-subtle px-3 py-2 mb-0">High priority</p>`:`<p class="text-center rounded-pill fs-6 fw-bold text-info bg-info-subtle px-3 py-2 mb-0">Low Priority</p>`}
                  </div>
                  </div>
                    `}
                 
            </div>
          </div>`
        taskList.append(div)
        
    });

    } catch (error) {
        
    }
}

async function getNotStartedTask(){
   try {
    completedTaskTab = false;
    pendingTaskTab = false;
    allTaskTab = false;
    notStartedTaskTab = true;
    const response = await fetch(`${API}/tasks?started=false&userId=${userId}&deleted=false&_sort=-createdAt`)
    const data = await response.json();
    console.log(data);
        taskList.replaceChildren();
        data.forEach(task => {
         const div = document.createElement('div');
         
     div.innerHTML = ` <div class="card  rounded-4 shadow-sm">
            <div class="card-body d-flex justify-content-between">
                  <div class="${task.completed?"completed-text":""}">
                       <h4>${task.title}</h4>
                       <p>${task.description}</p>
                       <p class="text-secondary mb-1">
        <i class="bi bi-calendar-event"></i>
        Created: ${task.createdAt}
    </p>
     <p class="text-secondary mb-2">
        <i class="bi bi-calendar2-check"></i>
        Due: ${task.dueDate}
    </p>
                       <span class="not-started"><i class="bi bi-cone-striped px-1"></i>Not Started</span>
                       ${
        isOverdue(task.dueDate, task.completed)
        ?
        `<span class="overdue mb-2">
            <i class="bi bi-exclamation-circle"></i>
            Overdue
        </span>`
        :
        ""
    }
                  </div>
                  
                    <div class="d-flex flex-column justify-content-between align-items-center">
                     <div>
                      <button class="btn rounded-2 text-info border-1 border-secondary-subtle py-2  fs-4 start-btn border" onClick="startTask('${task.id}')"><i class="bi bi-rocket-takeoff  "></i></button>
                      <button class="btn fs-4 rounded-2 border-1 border-secondary-subtle py-2 border edit-btn" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick="updateTask('${task.id}')"><i class="bi bi-pencil " ></i></button>
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
                     </div>
                     ${task.priority=='high'?`<p class="text-center rounded-pill fs-6 fw-bold text-danger bg-danger-subtle px-3 py-2 mb-0">High priority</p>`:`<p class="text-center rounded-pill fs-6 fw-bold text-info bg-info-subtle px-3 py-2 mb-0">Low Priority</p>`}
                  </div>
                  </div>
                  </div>`
                taskList.append(div)
                })
        
   } catch (error) {
     
   }

}



async function getTaskCount() {
    try {
    const allTaskResponse = await fetch(`${API}/tasks?userId=${userId}&deleted=false`) 
    const allTaskData = await allTaskResponse.json()
    $('#totalTaskCard').text(allTaskData.length)

    const completedTaskResponse = await fetch(`${API}/tasks?completed=true&userId=${userId}&deleted=false&started=true`)
    const completedTaskData = await completedTaskResponse.json()
    $('#completeTaskCard').text(completedTaskData.length);
    const completePercent = (completedTaskData.length/allTaskData.length)*100
    $('#completeProgBar').css('width',`${completePercent}%`)
    
    const pendingTaskResponse = await fetch(`${API}/tasks?completed=false&userId=${userId}&deleted=false&started=true`)
    const pendingTaskData = await pendingTaskResponse.json()
    $('#pendingTaskCard').text(pendingTaskData.length);
    const pendingPercent = (pendingTaskData.length/allTaskData.length)*100
    $('#pendingProgBar').css('width',`${pendingPercent}%`)

        const notStartedTaskResponse = await fetch(`${API}/tasks?started=false&userId=${userId}&deleted=false`)
    const notStartedTaskData = await notStartedTaskResponse.json()
    $('#notStartedTaskCard').text(notStartedTaskData.length);
    const notStartedPercent = (notStartedTaskData.length/allTaskData.length)*100
    $('#notStartedProgBar').css('width',`${notStartedPercent}%`)
    } catch (error) {
        
    }
}

async function completeTask(id){
   try {
     const response = await fetch(`${API}/tasks/${id}`,{
        method:'PATCH',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({
               completed:true
        })
     });
     const data =await response.json();
     console.log(data)
     getTaskCount();
     if(allTaskTab){
        getAllTask()
     }
     else if(completedTaskTab){
        getPendorCompleteTask(true)
     }
     else{
        getPendorCompleteTask(false)
     }
     toastr.success('Task Completed')
   } catch (error) {
    
   }
}

async function undoTask(id){
   try {
     const response = await fetch(`${API}/tasks/${id}`,{
        method:'PATCH',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({
               completed:false
        })
     });
     const data =await response.json();
     console.log(data)
     getTaskCount();
     if(allTaskTab){
        getAllTask()
     }
     else if(completedTaskTab){
        getPendorCompleteTask(true)
     }
     else{
        getPendorCompleteTask(false)
     }
   } catch (error) {
    
   }
}

async function updateTask(id){
    
    try {
        const response = await fetch(`${API}/tasks/${id}`)
        const data = await response.json();
        $('#updatetaskTitle').val(data.title);
        $('#updateTaskDesc').val(data.description);
        $('#updateTaskPrior').val(data.priority);
        $('#updateTaskDate').val(data.dueDate);
        console.log(data);
        $('#updateTaskBtn').off('click').on('click',async ()=>{
            const sweetResponse = await  Swal.fire({
        title: 'Do you want to update this task?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    })
    if(!sweetResponse.isConfirmed) return;
    const updateResponse = await fetch(`${API}/tasks/${id}`,{
                method:'PATCH',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({
                    title : $('#updatetaskTitle').val(),
                    description:$('#updateTaskDesc').val(),
                    priority:$('#updateTaskPrior').val(),
                    dueDate:$('#updateTaskDate').val()
                })
            })
            editModal.hide();
            getTaskCount();
           refreshTab()
      toastr.success('Updated Successfully')
     })
   
         
    } catch (error) {
        console.log(error);
    }
}

async function deleteTask(id){
    const sweetResponse = await  Swal.fire({
        title: 'Are you sure you want to delete this task?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    })
    if(!sweetResponse.isConfirmed) return;
    try {
         const response = await fetch(`${API}/tasks/${id}`,{
        method:"PATCH",
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            deleted:true
        })
    })
    console.log(response)
    getTaskCount();
     refreshTab()
     toastr.error('Task Deleted')
    } catch (error) {
         console.log(error)
    }
   
}

$('#addTaskBtn').on('click',  async ()=>{
  if(!$('#addtaskTitle').val() || !$('#addTaskDesc').val() || !$('#addTaskDueDate').val()) {
    toastr.error('Please fill all the fields')
    return;
  }
  const response =await addTask();
  toastr.success(response)
  refreshTab()
  getTaskCount()
  addModal.hide();
  $('#addtaskTitle').val("");
  $('#addTaskDesc').val("");
})

$('#pendTaskTab').on('click',()=>{
    $('#allTaskTab').removeClass('active-btn');
    $('#completeTaskTab').removeClass('active-btn');
    $('#pendTaskTab').addClass('active-btn');
    $('#notStartedTaskTab').removeClass('active-btn');
    getPendorCompleteTask(false);
})

$('#allTaskTab').on('click',()=>{
    $('#pendTaskTab').removeClass('active-btn');
    $('#completeTaskTab').removeClass('active-btn');
    $('#allTaskTab').addClass('active-btn');
    $('#notStartedTaskTab').removeClass('active-btn');
     getAllTask();
})

$('#completeTaskTab').on('click',()=>{
    $('#allTaskTab').removeClass('active-btn');
    $('#pendTaskTab').removeClass('active-btn');
    $('#completeTaskTab').addClass('active-btn');
     $('#notStartedTaskTab').removeClass('active-btn');
    getPendorCompleteTask(true);
})
$('#notStartedTaskTab').on('click',()=>{
    $('#allTaskTab').removeClass('active-btn');
    $('#pendTaskTab').removeClass('active-btn');
    $('#completeTaskTab').removeClass('active-btn');
    $('#notStartedTaskTab').addClass('active-btn');
    getNotStartedTask();
})

$('#logoutBtn').on('click', async ()=>{
  const response = await   Swal.fire({
    title: 'Are you sure you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
    })
    if(response.isConfirmed){
            localStorage.removeItem('userId');
             window.location.replace('./index.html')
    }

})

$('#restoreTask').on('click',()=>{
    restoreTaskListModal()
})

async function restoreTaskListModal() {
    try {
        const response = await fetch(`${API}/tasks?userId=${userId}&deleted=true`)
     const data = await response.json();
     const restoreTaskList = document.getElementById('restoreTaskList');
     restoreTaskList.replaceChildren();
     data.forEach((task)=>{
           const div = document.createElement('div');
           div.innerHTML = `
           <div class="container card-theme d-flex justify-content-between rounded-3 shadow-lg px-3 py-2 align-items-center">
           <div>
           <p class="fs-4 mb-0 text-theme-primary">${task.title}</p>
           </div>
           <div>
           <button class="btn border-1 border-warning text-warning" ><i class="bi bi-bootstrap-reboot fs-4" onClick="restoreTask('${task.id}')"></i></button>
           </div> 
           </div>
           
           `
           restoreTaskList.append(div)
     })
     
    } catch (error) {
        console.log(error)
    }
}

async function restoreTask(id) {
    try {
        const response = await fetch(`${API}/tasks/${id}`, {
        method:"PATCH",
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({
            deleted:false
        })
    })
    toastr.warning('Task Restored')
    restoreTaskListModal();
    getTaskCount();
     refreshTab()
    } catch (error) {
        console.log(error)
    }

    
}

async function startTask(id){
    try {
        const response = await fetch(`${API}/tasks/${id}`,{
        method:'PATCH',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({
            started:true
        })
    })
  toastr.info('Task Started')
  getTaskCount();
  getNotStartedTask();
} catch (error) {
        
    }
}

$('#user').on('click',async ()=>{
    try {
        const response = await fetch(`${API}/users/${userId}`)
        const data = await response.json();
        console.log(data)
        $('#userName').text(data.name);
        $('#userEmail').text(data.email);
        $('#userDob').text(data.dob);
        $('#userGender').text(data.gender);
        $('#userAddress').text(data.address);

    } catch (error) {
        
    }
})


getTaskCount();
getAllTask();



