(function (){

    $(".btnCrear").click(function(e){
        e.preventDefault();

        let user = $("#RegistroInputEmail").val();
        let pass = $("#RegistroInputPassword").val();
    
         firebase.auth().createUserWithEmailAndPassword(user, pass)
         .then(function(){
             alert("Registrado!")
            //CLEAN FIELD
            $("#RegistroInputEmail").val("");
            $("#RegistroInputPassword").val("");
         })
         .catch(function(error) {
             // Handle Errors here.
             var errorCode = error.code;
             var errorMessage = error.message;
             if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
              }
              else if(errorCode == 'auth/email-already-in-use'){
                alert('This acount already in use.');
              }
              else if(errorCode == 'auth/invalid-email'){
                alert('The email address is not valid.');
              }
              else if(errorCode == 'auth/weak-password'){
                alert('The password is not strong enough.');
              }
              else{
                alert(errorMessage);
              }

           });
    });

    $(".btnIniciarSesion").click(function(e){
        e.preventDefault();

        let user = $("#LoginInputEmail").val();
        let pass = $("#LoginInputPassword").val();

        firebase.auth().signInWithEmailAndPassword(user, pass)
        .then(()=>{
            alert("Done");
            $("#LoginInputEmail").val("");
            $("#LoginInputPassword").val("");
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
    });




})();