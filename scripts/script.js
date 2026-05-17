const API = 'http://localhost:5000'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,15}$/
const nameRegex = /^[a-zA-Z\s]+$/
toastr.options = {
        "positionClass": "toast-bottom-right",
        "showDuration": "300",
        "preventDuplicates": true
      }
    
function toggleTheme(){
  const currentTheme = document.body.getAttribute("data-theme");

    if(currentTheme === "dark"){

        document.body.setAttribute("data-theme", "light");

        themeBtn.innerText = "Dark Mode";
    }
    else{

        document.body.setAttribute("data-theme", "dark");

        themeBtn.innerText = "Light Mode";
    }
}

 const emailValidate = function (input){
         return emailRegex.test(input);
 }
 const passValidate = function (input){
         return passRegex.test(input);
 }
 const nameValidate = function (input){
  return nameRegex.test(input)
 }
 $('#sign-in').on('click',async function(){
        let isValid = true;

         if(!emailValidate($('#loginEmail').val())){
             isValid = false;
             toastr.warning("Invalid email")
             return
         }
         if(!passValidate($('#loginPass').val())){
          isValid = false;
            toastr.warning("Invalid password")
          return
         }
         if(isValid){
                const response = await fetch(`${API}/users?email=${$('#loginEmail').val()}&password=${$('#loginPass').val()}`)
                const data = await response.json();
               if(data[0]?.email){
                    toastr.success('Login Successful') 
                    localStorage.setItem('userId',`${data[0].id}`)
                    console.log(localStorage.getItem('userId'))
                    setTimeout(()=>{
                      window.location.replace('./main.html')
                    },1500)
                    
                }
                else{
                  toastr.error('Invalid Email or Password')
                }

                
         }
      })
        $('#register').on('click', async function(){
          console.log()
          let isValid = true;
         if(!nameValidate($('#name').val())){
            isValid = false;
             toastr.warning("Invalid name")
             return
         }
         if(!emailValidate($('#email').val())){
             isValid = false;
             toastr.warning("Invalid email")
             return
         }
         if(!passValidate($('#pass').val())){
          isValid = false;
          toastr.warning("Invalid password")
          return
         }
         if($('#pass').val() !== $('#cpass').val()){
          isValid = false;
          toastr.warning("Password not same")
          return
         }
         if(!$('#dob').val()){
          isValid = false;
          toastr.warning("Fill the date of birth");
          return
         }
         if(!$('#male').prop('checked')&&!$('#female').prop('checked')){
          isValid = false;
          toastr.warning("Fill the gender");
          return
         }
         if(!$('#addr').val()){
           isValid = false;
          toastr.warning("Fill the address");
          return
         }
         
         if(isValid){
              try {
                
                const emailCheckResponse = await fetch(`${API}/users?email=${$('#email').val()}`)
                const emailData = await emailCheckResponse.json()
                if(emailData[0]?.email){
                  toastr.error('User already exist')
                }
                else{
                  const response = await fetch(`${API}/users`,{
                method:'POST',
                headers:{
                  'Content-type':'application/json'
                },
                body:JSON.stringify({
                  name: $('#name').val(),
                  email : $('#email').val(),
                  password: $('#pass').val(),
                  dob:$('#dob').val(),
                  gender: $('#male').prop('checked')?'male':'female',
                  address: $('#addr').val()
                })
              })
           
              toastr.success("User Registered Successfully")
              const modal = bootstrap.Modal.getInstance(
              document.getElementById('registerModal')
                );

              modal.hide();
              $('#name').val("");
              $('#email').val("");
              $('#pass').val("");
              $('#cpass').val("");
              $('#dob').val("");
              $('#male').prop('checked',false);
              $('#female').prop('checked',false);
              $('#addr').val("");
                }
              } catch (error) {
                console.log(error)
              }
           
         }
      })

        