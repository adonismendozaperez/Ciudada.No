(function (){
    //CREAR NUEVO USUARIO
    $(".btnCrear").click(function(e){
        e.preventDefault();
        NuevoUsuario($("#RegistroInputEmail").val(), $("#RegistroInputPassword").val());
    });

    //INICIAR SESION
    $(".btnIniciarSesion").click(function(e){
        e.preventDefault();
        Login($("#LoginInputEmail").val(), $("#LoginInputPassword").val());
    });
    
    function Login(user,pass){
        firebase.auth().signInWithEmailAndPassword(user, pass)
        .then(()=>{
            $("#LoginInputEmail").val("");
            $("#LoginInputPassword").val("");
            debugger;
            if(user === "adonis.mendoza@outlook.com"){
                location.href = 'Admin.html';
            }
            else{
                location.href = "Dashboard.html";
            }

        })
        .catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                swal({
                    title: "Información!",
                    text: "Contraseña incorrecta",
                    icon: "warning",
                    button: "Okey!",
                  });
            }
            else if(errorCode === 'auth/invalid-email'){
                swal({
                    title: "Información!",
                    text: "La dirección de correo electrónico está mal, favor de veríficar.",
                    icon: "warning",
                    button: "Okey!",
                  });
            }
            else {
                swal({
                    title: "Información!",
                    text: errorMessage,
                    icon: "warning",
                    button: "Okey!",
                  });
            }
        });
    }

    function NuevoUsuario(user,pass){
        firebase.auth().createUserWithEmailAndPassword(user, pass)
        .then(function(){
            Login(user,pass);
            $("#RegistroInputEmail").val("");
            $("#RegistroInputPassword").val("");
        })
        .catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                swal({
                    title: "Información!",
                    text: "La contraseña es muy débil!",
                    icon: "warning",
                    button: "Okey!",
                    });
                }
                else if(errorCode == 'auth/email-already-in-use'){
                swal({
                    title: "Información!",
                    text: "Esta cuenta ya está en uso, favor de intentar con otra!",
                    icon: "warning",
                    button: "Okey!",
                    });
                }
                else if(errorCode == 'auth/invalid-email'){
                swal({
                    title: "Información!",
                    text: "La dirección de correo electrónico no es válida!",
                    icon: "warning",
                    button: "Okey!",
                    });
                }
                else if(errorCode == 'auth/weak-password'){
                swal({
                    title: "Información!",
                    text: "La contraseña no es lo suficientemente fuerte, favor de intentar con otra!",
                    icon: "warning",
                    button: "Okey!",
                    });
                }
                else{
                swal({
                    title: "Información!",
                    text: errorMessage,
                    icon: "warning",
                    button: "Okey!",
                    });
                }
        });
    }

})();