 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;
     const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,15}$/
     const nameRegex = /^[a-zA-Z\s]+$/
      toastr.options = {
        "positionClass": "toast-bottom-right",
        "showDuration": "300",
        "preventDuplicates": true
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
      $('#sign-in').on('click',function(){
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
                toastr.success("Login success")
               setTimeout(() => {
              window.location.assign('./main.html');
            $('#loginEmail').val("")
           $('#loginPass').val("")
            }, 1500);
         }
      })
        $('#register').on('click',function(){
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
         if($('#male').prop('checked')&&$('#female').prop('checked')){
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
              toastr.success("Login success")
               setTimeout(() => {
              window.location.assign('./main.html');
            $('#loginEmail').val("")
           $('#loginPass').val("")
            }, 1500);
         }
      })