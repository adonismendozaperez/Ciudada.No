(function (){

    $(".btnCrear").click(function(e){
        e.preventDefault();

        let user = $("#RegistroInputEmail").val();
        let pass = $("#RegistroInputPassword").val();
    
         firebase.auth().createUserWithEmailAndPassword(user, pass)
         .then(function(){
            $("#RegistroInputEmail").val("");
            $("#RegistroInputPassword").val("");
         })
         .catch(function(error) {
             var errorCode = error.code;
             var errorMessage = error.message;
             if (errorCode == 'auth/weak-password') {
                swal({
                    title: "Informacion!",
                    text: "The password is too weak.!",
                    icon: "warning",
                    button: "Okey!",
                  });
              }
              else if(errorCode == 'auth/email-already-in-use'){
                swal({
                    title: "Informacion!",
                    text: "This acount already in use!",
                    icon: "warning",
                    button: "Okey!",
                  });
              }
              else if(errorCode == 'auth/invalid-email'){
                swal({
                    title: "Informacion!",
                    text: "The email address is not valid!",
                    icon: "warning",
                    button: "Okey!",
                  });
              }
              else if(errorCode == 'auth/weak-password'){
                swal({
                    title: "Informacion!",
                    text: "The password is not strong enough!",
                    icon: "warning",
                    button: "Okey!",
                  });
              }
              else{
                swal({
                    title: "Informacion!",
                    text: errorMessage,
                    icon: "warning",
                    button: "Okey!",
                  });
              }

           });
    });

    $(".btnIniciarSesion").click(function(e){
        e.preventDefault();

        let user = $("#LoginInputEmail").val();
        let pass = $("#LoginInputPassword").val();

        firebase.auth().signInWithEmailAndPassword(user, pass)
        .then(()=>{
            $("#LoginInputEmail").val("");
            $("#LoginInputPassword").val("");
            location.href = "Dashboard.html";
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                swal({
                    title: "Informacion!",
                    text: "Wrong password",
                    icon: "warning",
                    button: "Okey!",
                  });
            }
            else if(errorCode === 'auth/invalid-email'){
                swal({
                    title: "Informacion!",
                    text: "The email address is badly formatted.",
                    icon: "warning",
                    button: "Okey!",
                  });
            }
            else {
                swal({
                    title: "Informacion!",
                    text: errorMessage,
                    icon: "warning",
                    button: "Okey!",
                  });
            }
            console.log(error);
        });
    });
    
})();