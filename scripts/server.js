const API = 'http://localhost:5000'

const date = new Date();

let curID = 'qpZn7tS_ewA';

const taskList = document.getElementById('taskList')

toastr.options = {
        "positionClass": "toast-bottom-right",
        "showDuration": "300",
        "preventDuplicates": true
      }

let allTaskTab = false;
let pendingTaskTab = false;
let completedTskTab = false;

async function addTask(){
          try {
        const title = $('#addtaskTitle').val();
        const desc = $('#addTaskDesc').val();
        const priority = $('#addTaskPrior').val();
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
            createdAt : `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
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
    const response = await fetch(`${API}/tasks`) 
    const data = await response.json()
    console.log(data)
    taskList.replaceChildren();
    completedTaskTab = false;
    pendingTaskTab = false;
    allTaskTab = true;
    data.forEach(task => {
        const div = document.createElement('div');
        div.innerHTML = ` <div class="card  rounded-4 shadow-sm">
            <div class="card-body d-flex justify-content-between">
                  <div class="${task.completed?"completed-text":""}">
                       <h4>${task.title}</h4>
                       <p>${task.description}</p>
                       <p class="${task.completed?"completed":"pending"}"><i class="bi ${task.completed?"bi-check-circle":"bi-clock"}"></i>${task.completed?"Completed":"Pending"}</p>
                  </div>
                  ${task.completed?`
                    <div>
                       <button class="btn rounded-2 text-warning border-1 border-secondary-subtle py-2  fs-4 redo-btn border" onClick="undoTask('${task.id}')"><i class="bi bi-arrow-counterclockwise "></i></button>
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
                  </div>
                    `:`
                     <div>
                      <button class="btn rounded-2 text-success border-1 border-secondary-subtle py-2  fs-4 check-btn border" onClick="completeTask('${task.id}')"><i class="bi bi-check-circle  "></i></button>
                      <button class="btn fs-4 rounded-2 border-1 border-secondary-subtle py-2 border edit-btn" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick="updateTask('${task.id}')"><i class="bi bi-pencil " ></i></button>
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
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
        }
        else{
            completedTaskTab = false;
            pendingTaskTab = true;
            allTaskTab = false;
        }
    const response = await fetch(`${API}/tasks?completed=${val}`) 
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
                       <p class="${task.completed?"completed":"pending"}"><i class="bi ${task.completed?"bi-check-circle":"bi-clock"}"></i>${task.completed?"Completed":"Pending"}</p>
                  </div>
                  ${task.completed?`
                    <div>
                       <button class="btn rounded-2 text-warning border-1 border-secondary-subtle py-2  fs-4 redo-btn border" onClick="undoTask('${task.id}')"><i class="bi bi-arrow-counterclockwise  "></i></button>
                      
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
                  </div>
                    `:`
                     <div>
                      <button class="btn rounded-2 text-success border-1 border-secondary-subtle py-2  fs-4 check-btn border" onClick="completeTask('${task.id}')"><i class="bi bi-check-circle  "></i></button>
                      <button class="btn fs-4 rounded-2 border-1 border-secondary-subtle py-2 border edit-btn" data-bs-toggle="modal" data-bs-target="#editTaskModal" onClick="updateTask('${task.id}')"><i class="bi bi-pencil " ></i></button>
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn" onClick="deleteTask('${task.id}')"><i class="bi bi-trash"></i></button>
                  </div>
                    `}
                 
            </div>
          </div>`
        taskList.append(div)
        
    });

    } catch (error) {
        
    }
}

async function getTaskCount() {
    try {
    const allTaskResponse = await fetch(`${API}/tasks`) 
    const allTaskData = await allTaskResponse.json()
    $('#totalTaskCard').text(allTaskData.length)

    const completedTaskResponse = await fetch(`${API}/tasks?completed=true`)
    const completedTaskData = await completedTaskResponse.json()
    $('#completeTaskCard').text(completedTaskData.length);
    const completePercent = (completedTaskData.length/allTaskData.length)*100
    $('#completeProgBar').css('width',`${completePercent}%`)
    
    const pendingTaskResponse = await fetch(`${API}/tasks?completed=false`)
    const pendingTaskData = await pendingTaskResponse.json()
    $('#pendingTaskCard').text(pendingTaskData.length);
    const pendingPercent = (pendingTaskData.length/allTaskData.length)*100
    $('#pendingProgBar').css('width',`${pendingPercent}%`)
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
        console.log(data);
        $('#updateTaskBtn').on('click',async ()=>{
            const updateResponse = await fetch(`${API}/tasks/${id}`,{
                method:'PATCH',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({
                    title : $('#updatetaskTitle').val(),
                    description:$('#updateTaskDesc').val(),
                    priority:$('#updateTaskPrior').val()
                })
            })
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
        })
         
    } catch (error) {
        console.log(error);
    }
}

async function deleteTask(id){
    try {
         const response = await fetch(`${API}/tasks/${id}`,{
        method:"DELETE"
    })
    console.log(response)
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
         console.log(error)
    }
   
}

$('#addTaskBtn').on('click',  async ()=>{
  
  const response =await addTask();
  toastr.success(response)
  getAllTask();
  getTaskCount()
  $('#addtaskTitle').val("");
  $('#addTaskDesc').val("");
})

$('#pendTaskTab').on('click',()=>{
    $('#allTaskTab').removeClass('active-btn');
    $('#completeTaskTab').removeClass('active-btn');
    $('#pendTaskTab').addClass('active-btn');
    getPendorCompleteTask(false);
})

$('#allTaskTab').on('click',()=>{
    $('#pendTaskTab').removeClass('active-btn');
    $('#completeTaskTab').removeClass('active-btn');
    $('#allTaskTab').addClass('active-btn');
     getAllTask();
})

$('#completeTaskTab').on('click',()=>{
    $('#allTaskTab').removeClass('active-btn');
    $('#pendTaskTab').removeClass('active-btn');
    $('#completeTaskTab').addClass('active-btn');
    getPendorCompleteTask(true);
})



getTaskCount();
getAllTask();



