window.addEventListener('load', inicio, false);
$(document).ready(inicio);



function inicio() {
    $(".btnSalir").click(()=>{
        firebase.auth().signOut().then(function() {
            location.href = 'index.html';
        }).catch(function(error) {
            alert(error);
        });
    });

    $("#customFile").change(()=>{
        $(".custom-file-label").text($("#customFile").val())
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(mostrarCoordenada);
    } else {
    alert('El navegador no dispone la capacidad de geolocalización');
    }


    
}

function mostrarCoordenada(posicion) {
    $("#inputLogintud").val(posicion.coords.longitude);
    $("#inputLatitud").val(posicion.coords.latitude);
}