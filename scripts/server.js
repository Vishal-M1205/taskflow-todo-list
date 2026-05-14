const API = 'http://localhost:5000'

const date = new Date();

let curID = 'qpZn7tS_ewA';

const taskList = document.getElementById('taskList')

toastr.options = {
        "positionClass": "toast-bottom-right",
        "showDuration": "300",
        "preventDuplicates": true
      }

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
                       <button class="btn rounded-2 text-warning border-1 border-secondary-subtle py-2  fs-4 redo-btn border"><i class="bi bi-arrow-counterclockwise  "></i></button>
                      <button class="btn fs-4 rounded-2 border-1 border-secondary-subtle py-2 border edit-btn"><i class="bi bi-pencil "></i></button>
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn  "><i class="bi bi-trash"></i></button>
                  </div>
                    `:`
                     <div>
                      <button class="btn rounded-2 text-success border-1 border-secondary-subtle py-2  fs-4 check-btn border"><i class="bi bi-check-circle  "></i></button>
                      <button class="btn fs-4 rounded-2 border-1 border-secondary-subtle py-2 border edit-btn"><i class="bi bi-pencil "></i></button>
                      <button class="btn text-danger fs-4 rounded-2 border-1 border-secondary-subtle py-2 border trash-btn  "><i class="bi bi-trash"></i></button>
                  </div>
                    `}
                 
            </div>
          </div>`
        taskList.append(div)
        
    });

    } catch (error) {
        
    }

}

async function getPendingTask(){
    
}

async function deleteTask(){
    try {
         const response = await fetch(`${API}/tasks/${curID}`,{
        method:"DELETE"
    })
    console.log(response)
    } catch (error) {
         console.log(error)
    }
   
}

$('#addTaskBtn').on('click',  async ()=>{
 
  const response =await addTask();
  toastr.success(response)
  getAllTask();
})

$('#pendTaskTab').on('click',()=>{
    taskList.replaceChildren();
})

$('#allTaskTab').on('click',()=>{
    
     getAllTask();
})
getAllTask();



