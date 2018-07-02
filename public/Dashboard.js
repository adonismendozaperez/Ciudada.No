window.addEventListener('load', inicio, false);

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
}
