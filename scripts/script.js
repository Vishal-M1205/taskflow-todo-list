const API = 'http://localhost:5000'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,15}$/
const nameRegex = /^[a-zA-Z\s]{3,}$/
const mobileRegex = /^[0-9]{10}$/
toastr.options = {
        "positionClass": "toast-bottom-right",
        "showDuration": "300",
        "preventDuplicates": true
      }

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

 const emailValidate = function (input){
         return emailRegex.test(input);
 }
 const passValidate = function (input){
         return passRegex.test(input);
 }
 const nameValidate = function (input){
  return nameRegex.test(input)
 }
const mobileValidate = function (input){
 return mobileRegex.test(input)
}

const addInValidClass = function (msg,eleID,msgID){
  $(msgID).text(msg)
   $(eleID).addClass('is-invalid')
          $(eleID).removeClass('is-valid')

          $(msgID).addClass('invalid-feedback');
          $(msgID).removeClass('valid-feedback');
} 

const addValidClass = function(msg,eleID,msgID){
   $(msgID).text(msg)
   $(eleID).addClass('is-valid')
       $(eleID).removeClass('is-invalid')
        $(msgID).addClass('valid-feedback');
          $(msgID).removeClass('invalid-feedback');
}




$('#name').on('input',()=>{
   if(!nameValidate($('#name').val())){
          addInValidClass('Invlaid name, atleast 3 letters required','#name','#nameErrMsg')
         }
      else{
          addValidClass('Looks Good!','#name','#nameErrMsg')
      }
})
$('#email').on('input',()=>{
   if(!emailValidate($('#email').val())){
          addInValidClass('Invlaid email','#email','#emailErrMsg')
         }
      else{
          addValidClass('Looks Good!','#email','#emailErrMsg')
      }
})
$('#mob').on('input',()=>{
   if(!mobileValidate($('#mob').val())){
          addInValidClass('Invlaid number','#mob','#mobErrMsg')
         }
      else{
          addValidClass('Looks Good!','#mob','#mobErrMsg')
      }
})
$('#cpass').on('input',()=>{
   if(!($('#cpass').val()==$('#pass').val())){
         addInValidClass("Password didn't match",'#cpass','#cpassErrMsg')
         }
      else{
        addValidClass("Password Matched",'#cpass','#cpassErrMsg')
      }
})
$('#pass').on('input',()=>{
   if(!passValidate($('#pass').val())){
         addInValidClass("Password must have 8-15 characters, one uppercase, one lowercase, one number and one special character",'#pass','#passErrMsg')
         }
      else{
        addValidClass("Valid Password",'#pass','#passErrMsg')
      }
})



$('#signupModal input, #signupModal textarea,#signupModal select').on('input change',()=>{
  let signupVal = {
    fullName : $('#name').val(),
    email: $('#email').val(),
    mobno : $('#mob').val(),
    
    dob : $('#dob').val(),
    gender: $('#male').prop('checked')?'male':'female',
    addr : $('#addr').val(),
    role : $('#role').val(),
    skills: $('input[name="skills"]:checked').map(function (){
     return $(this).attr('id')
    }).get()
  }
  localStorage.setItem('signupVal',JSON.stringify(signupVal))
  const value = JSON.parse(localStorage.getItem('signupVal'))
  console.log(value)

})

function signupModal(){
  const signupVal = JSON.parse(localStorage.getItem('signupVal'))
  console.log(signupVal)
  if(signupVal){
     $('#name').val(signupVal.fullName)
     $('#email').val(signupVal.email)
     $('#pass').val(signupVal.pass)
     $('#mob').val(signupVal.mobno)
     $('#dob').val(signupVal.dob)
     signupVal.gender == 'male'?$('#male').prop('checked',true):$('#female').prop('checked',true)
    $('#addr').val(signupVal.addr)
    $('#role').val(signupVal.role)
    const skills = signupVal.skills
    console.log(skills)
    console.log(skills.forEach((element )=> {
      $(`#${element}`).prop('checked',true)
    }))
  }
}
signupModal();

$('#loginEmail').on('input',()=>{
   if(!emailValidate($('#loginEmail').val())){
          addInValidClass('Invlaid email','#loginEmail','#loginEmailErrMsg')
         }
      else{
          addValidClass('Looks Good!','#loginEmail','#loginEmailErrMsg')
      }
})



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
          

    let selected = [];

    $("input[name='skills']:checked").each(function () {
        selected.push($(this).val());
    });

    console.log(selected);

          let isValid = true;
         if(!nameValidate($('#name').val())&&!emailValidate($('#email').val())&&!passValidate($('#pass').val())){
             isValid = false;
             toastr.warning("Empty Values not allowed")
             return
         }
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
          toastr.warning("Invalid password, password must contain 8-15 characters, at least one uppercase letter, one lowercase letter, one number and one special character")
          return
         }
         if(!$('#mob').val()){
          isValid = false;
          toastr.warning("Invalid Phone Number");
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
         
         if(selected.length == 0){
          isValid = false;
          toastr.warning("Select atleast one skill");
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
                  mobile: $('#mob').val(),
                  password: $('#pass').val(),
                  dob:$('#dob').val(),
                  gender: $('#male').prop('checked')?'male':'female',
                  address: $('#addr').val(),
                  skills:selected
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
              localStorage.removeItem('signupVal')
                }
              } catch (error) {
                console.log(error)
              }
           
         }
      })

