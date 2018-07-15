$(document).ready(inicio);

function inicio() {
    //SALIR DE LA SESION
    $(".btnSalir").click(()=>{
        firebase.auth().signOut().then(function() {
            location.href = 'index.html';
        }).catch(function(error) {
            alert(error);
        });
    });

    //CARGAR RECURSOS POR PAGINAS
    if(document.location.pathname === "/Dashboard.html"){
        VerificarSesion();
        PagDashboard();
    }
    else if(document.location.pathname === "/Denuncias.html"){
        VerificarSesion();
        DenunciasPage();
    }
    else if(document.location.pathname === "/mapa.html"){
        VerificarSesion();
        todaCategoria();
    }
    else if(document.location.pathname === "/ContactoAdmin.html"){
        VerificarSesion();
        ContactoAdminPage();
    }
    else if(document.location.pathname === "/MyCuenta.html"){
        MyCuentaPage();
    }
    // ADMIN PAGES
    else if(document.location.pathname === "/Admin.html"){
        VerificarSesion();
        AdminPage();
    }
    else if(document.location.pathname === "/TiposCasos.html"){
        VerificarSesion();
        TiposCasosPage();
    }
    else if(document.location.pathname === "/TiposCasos.html"){
        VerificarSesion();
        TiposCasosPage();
    }
    else if(document.location.pathname === "/ReporteAdmin.html"){
        VerificarSesion();
        ReportePage();
    }
    else if(document.location.pathname === "/MensajesAdmin.html"){
        VerificarSesion();
        MensajesAdminPage();
    }
    else{
        console.log("Not found")
    }

}//END INICIO

// VERIFICAR SI TIENE SESION
function VerificarSesion(){   
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let us = firebase.auth().currentUser;
            $("#UserName").prepend(`<i class="far fa-user"></i> ${us.email}`);
        } else {
            location.href = 'index.html';
        }
    });
}


//PAGE DASHBOARD
function PagDashboard(){
    //GET GEOLOCALITATION
    geolocalizacion();
    //GET NAME FILE
    $("#customFile").change(()=>{
        $(".custom-file-label").text($("#customFile").val())
    });  

    firebase.database().ref("TiposCasos").on('child_added',function(data){
        $("#inputTipoProblematica").append(`<option>${data.val().Caso}</option>`)
    });
    

    //SET PROBLEMATICA
    $("#btnEnviarProblematica").click(()=>{
        let d = new Date();
        let n = d.valueOf();
        
        if($("#inputComentario").val() !== ""){
            let Tipo =      $("#inputTipoProblematica").val();
            let Fecha =     new Date(Date.now()).toLocaleString();
            let Longitud =  $("#inputLogintud").text();
            let Latitud =   $("#inputLatitud").text();
            let Comentario =$("#inputComentario").val();
            let Estatus =   "Pendiente";
            let UserName =  firebase.auth().currentUser;
            let DenunciaID = n;
            
            let obj = {
                Tipo,
                Fecha,
                Longitud,
                Latitud,
                Comentario,
                Estatus,
                UserName: UserName.email,
                DenunciaID
            }

            firebase.database().ref("Problematicas/"+n).set(obj);
            swal("Guardado!", "Datos Guardados correctamente!", "success");
            $("#inputTipoProblematica").val("");
            $("#inputFecha").val("");
            $("#inputComentario").val("");
        }
        else{
            swal("Alerta!", "Debe rellenar todos los campos correctamente!", "warning");
        }
            
    });
}

//GET LOCATION
function geolocalizacion(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(mostrarCoordenada);
    } else {
        alert('El navegador no dispone la capacidad de geolocalización');
    }

    function mostrarCoordenada(posicion) {
        $("#inputLogintud").text(posicion.coords.longitude);
        $("#inputLatitud").text(posicion.coords.latitude);
    }

}
//PAG DENUNCIAS
function DenunciasPage(){
    firebase.database().ref('Problematicas').orderByChild("Fecha").limitToLast(15).on('child_added',function(data){
        $(".list-unstyled").append(`
        <li class="media" style="color:silver;">
            <img class="rounded float-left img-list" src="Imagenes/doc.svg" >
            <div class="media-body">
            <button type="button" class="btn btn-light btn-event" data-toggle="modal" data-DenunciaID="${data.val().DenunciaID}" data-target="#exampleModal"><i class="far fa-eye"></i></button>
            <h5 class="mt-0 mb-1">${data.val().Tipo}</h5>
            ${data.val().Comentario}
            <blockquote class="blockquote mb-0">
            <footer class="blockquote-footer font-weight-light">${data.val().Estatus}</footer>
            </blockquote>
            </div>
        </li>
        <hr/>
        `);
     });

     
   setTimeout(()=>{
    $(".btn-event").click(function(){
         ID = $(this).attr("data-DenunciaID");

        let Entry = firebase.database().ref('Problematicas').child("/"+ID);
        Entry.once('value', function (r) { 
            $("#InputTipo").val(r.val().Tipo)
            $("#InputComentario").val(r.val().Comentario)
            $("#InputUsuario").val(r.val().UserName)
            $("#InputFecha").val(r.val().Fecha)
            $("#InputEstatus").val(r.val().Estatus) 
        });
     });
   },2000);


  $("#animation-loading").css("display","none");
}
//FUNCTION MAPA 
function todaCategoria(){
    let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
    let maps, map; 
    map = L.map('map').setView([18.4861,  -69.9312], 15).addLayer(osm);

    firebase.database().ref('Problematicas').on('child_added',function(data){
        maps = L.marker([data.val().Latitud, data.val().Longitud])
        .addTo(map)
        .bindPopup(`<b>${data.val().Tipo}</b><br>${data.val().Comentario}`)
        .openPopup();
    });
}

//PAG CONTACTO ADMIN
function ContactoAdminPage(){
    $("#btnEnviarMensaje").click(()=>{
        if($("#inputTitulo").val() !== "" && $("#inputContenido").val() !== "" ){
         let titulo =      $("#inputTitulo").val();
         let contenido =  $("#inputContenido").val();
         let userName =  firebase.auth().currentUser;
         let fecha =     new Date(Date.now()).toLocaleString();

         let obj = {
             Titulo : titulo,
             Contenido : contenido,
             UserName: userName.email,
             Fecha : fecha
          }

          firebase.database().ref("MsjAdmin").push(obj);
          swal("Mensaje Enviado!", "Mensaje enviado correctamente!", "success");
          $("#inputTitulo").val("");
          $("#inputContenido").val("");
        }
        else{
            swal("Alerta!", "Debe rellenar todos los campos correctamente!", "warning");
        }
         
    });
}

function MyCuentaPage(){  
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
           let us = firebase.auth().currentUser;
           $("#UserName").prepend(`<i class="far fa-user"></i> ${us.email}`);
            
            //TABLA MIS DENUNCIAS
            firebase.database().ref('Problematicas').orderByChild("UserName").startAt(`${us.email}`).endAt(`${us.email}`).limitToLast(3).on('child_added',function(data){

                $(".list-unstyled").append(`
                <li class="media" style="color:silver;">
                    <img class="rounded float-left img-list" src="Imagenes/doc.svg" >
                    <div class="media-body">
                    <h5 class="mt-0 mb-1">${data.val().Tipo}</h5>
                    ${data.val().Comentario}
                    <blockquote class="blockquote mb-0">
                    <footer class="blockquote-footer font-weight-light">${data.val().Estatus}</footer>
                    </blockquote>
                    </div>
                </li>
                <hr/>
                `);

            });
        } else {
          location.href = 'index.html';
        }
      });
       
        //END ANIMACION      
        $("#animation-loading").css("display","none")

      $(".btnCambiarPassword").click((e)=>{
          e.preventDefault();
         let user = firebase.auth().currentUser;
         //CAMBIAR PASSWORD
         let newPassword = $("#InputPassword").val();

         user.updatePassword(newPassword).then(function() {
            swal("Listo!", "La contraseña fue cambiada correctamente!", "success");
         }).catch(function(error) {
            let errorMessage = error.message;
            swal("Información!", errorMessage, "warning");
         });
      });
}

//==================================== ADMIN PAGES  ===================================================
function AdminPage(){
    let ID;

    //GET-DENUNCIAS
    firebase.database().ref('Problematicas').orderByChild("Fecha").on('child_added',function(data){
          $(".list-unstyled").append(`
              <li class="media" style="color:silver;">
                  <img class="rounded float-left img-list" src="Imagenes/doc.svg" >
                  <div class="media-body">
                  <button type="button" class="btn btn-light btn-event" data-toggle="modal" data-DenunciaID="${data.val().DenunciaID}" data-target="#exampleModal"><i class="far fa-edit"></i></button>
                  <h5 class="mt-0 mb-1">${data.val().Tipo}</h5>
                  ${data.val().Comentario}
                  <blockquote class="blockquote mb-0">
                  <footer class="blockquote-footer font-weight-light">${data.val().Estatus}</footer>
                  </blockquote>
                  </div>
              </li>
          <hr/>
          `);

       });

     setTimeout(()=>{
      $(".btn-event").click(function(){
           ID = $(this).attr("data-DenunciaID");

          var Entry = firebase.database().ref('Problematicas').child("/"+ID);
          Entry.once('value', function (r) { 
              $("#InputTipo").val(r.val().Tipo)
              $("#InputComentario").val(r.val().Comentario)
              $("#InputUsuario").val(r.val().UserName)
              $("#InputEstatus").val(r.val().Estatus)
          });
       });

       $("#btn-guardar").click(function(){           
          let obj = {
              Estatus : $("#InputEstatus").val(),
          }

          firebase.database().ref("Problematicas/"+ID).update(obj);
          
          //DELETE INPUTS
          $("#InputTipo").val("")
          $("#InputComentario").val("")
          $("#InputUsuario").val("")
          $("#InputEstatus").val("")
         
          swal("Guardado!", "Datos Guardados correctamente!", "success");
          $(".close").click()
       });

     },2000)
}

//TIPOS CASOS PAGE
function TiposCasosPage(){
    firebase.database().ref('TiposCasos').orderByChild("Fecha").on('child_added',function(data){
        $(".list-unstyled").append(`
            <li class="media" style="color:silver;">
                <div class="media-body"><i class="far fa-file-alt"></i> ${data.val().Caso}</div>
            </li>
            <hr/>
        `);
    });

    $("#btGuardar").click(()=>{
        if($("#inputCaso").val() !== ""){
         let caso =      $("#inputCaso").val();
         let fecha =     new Date(Date.now()).toLocaleString();

         let obj = {
             Caso : caso,
             Fecha : fecha
          }

          firebase.database().ref("TiposCasos").push(obj);
          swal("Guardado!", "Datos Guardados correctamente!", "success");
          $("#inputCaso").val("");
        }
        else{
            swal("Alerta!", "Debe rellenar todos los campos correctamente!", "warning");
        }
    });
}

//REPORTE PAGE
function ReportePage(){
        //CONF GRAFICO  
        var config = {
            type: 'pie',
            data: {
              datasets: [{
                data: [
                  10,
                  20,
                  30,
                  40,
                  50,
                  60,
                  70
                ],
                backgroundColor: [
                  '#FF0000',
                  '#00FF00',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF'
                ],
                label: 'El grafico del futuro'
              }],
              labels: [
                'Bullying',
                'Contaminacion',
                'Delincuencia',
                'Electricidad',
                'Racismo',
                'Violencia de Genero',
                'Otros'
              ]
            },
            options: {
              responsive: true
            }
          };
          
         
          let conteoBullying = 0;
          let conteoContaminacion = 0;
          let conteoDelincuencia = 0;
          let conteoElectricidad = 0;
          let conteoRacismo = 0;
          let conteoViolenciaGenero = 0;
          let conteoOtros = 0;
  
          let starCountRef = firebase.database().ref('Problematicas');
          starCountRef.on('value', function(snapshot) {
          datos = snapshot.val();
          
          
          for(let d in datos){
              
              if(datos[d].Tipo === "Bullying"){
                  conteoBullying++;
              }
              else if(datos[d].Tipo === "Contaminación"){
                  conteoContaminacion++;
              }
              else if(datos[d].Tipo === "Delincuencia"){
                  conteoDelincuencia++;
              }
              else if(datos[d].Tipo === "Electricidad"){
                  conteoElectricidad ++;
              }
              else if(datos[d].Tipo === "Racismo"){
                  conteoRacismo++;
              }
              else if(datos[d].Tipo === "Violencia de Genero"){
                  conteoViolenciaGenero++;
              }
              else{
                  conteoOtros++;
              }
          }
          
          
          //SET DATA  
          config.data.datasets[0].data[0] = conteoBullying;
          config.data.datasets[0].data[1] = conteoContaminacion;
          config.data.datasets[0].data[2] = conteoDelincuencia;
          config.data.datasets[0].data[3] = conteoElectricidad;
          config.data.datasets[0].data[4] = conteoRacismo;
          config.data.datasets[0].data[5] = conteoViolenciaGenero;
          config.data.datasets[0].data[6] = conteoOtros;
          window.myPie.update();
  
          console.log(`Total de Bullying: ${conteoBullying}`)
          console.log(`Total de Contaminacion: ${conteoContaminacion}`)
          console.log(`Total de Delincuencia: ${conteoDelincuencia}`)
          console.log(`Total de Electricidad: ${conteoElectricidad}`);
          console.log(`Total de Racismo: ${conteoRacismo}`)
          console.log(`Total de Violencia de genero: ${conteoViolenciaGenero}`)
          console.log(`Total de Otros: ${conteoOtros}`)
          });
  
          
          var ctx = document.getElementById('chart-area').getContext('2d');
          window.myPie = new Chart(ctx, config);
}

//MENSAJES ADMIN
function MensajesAdminPage(){
    firebase.database().ref('MsjAdmin').orderByChild("Fecha").limitToLast(4).on('child_added',function(data){
        $(".list-unstyled").append(`
            <li class="media" style="color:silver;">
                <img class="rounded float-left img-list" src="Imagenes/email.svg" >
                <div class="media-body">
                <h5 class="mt-0 mb-1">${data.val().Titulo}</h5>
                ${data.val().Contenido}
                <blockquote class="blockquote mb-0">
                <footer class="blockquote-footer font-weight-light">Usuario: ${data.val().UserName}</footer>
                </blockquote>
                </div>
            </li>
        <hr/>
        `);
    });
}