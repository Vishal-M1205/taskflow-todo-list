const API = 'http://localhost:5000'

let curID = 'KVc6JbPFUq0';

async function addTask(){

    try {
        const response = await fetch(`${API}/tasks`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            title:'Brush ',
            description:'brush using sensodyne',
            priority:'High'
        })
    })
    console.log('Data added')
    } catch (error) {
        console.log(error)
    }
    
   
}

async function getAllTask() {
    const response = await fetch(`${API}/tasks`) 
   
    const data = await response.json()
   
    console.log(data)
    curID = data[0].id
    console.log(curID)

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

