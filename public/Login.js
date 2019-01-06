(function (){
    $(".btnIniciarSesionGoogle").click(function(e){
        GoogleAuth();
    })

    function GoogleAuth (){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            localStorage.setItem("UserName",result.user.email)
            location.href = "Dashboard.html";
          }).catch(function(error) {
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            swal({
                title: "Error!",
                text: errorMessage,
                icon: "warning",
                button: "Okey!",
            });
        });
    }
})();