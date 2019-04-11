/*------------------------------------------------------------------------------------
            TIRAR FOTO DO LANCHE
------------------------------------------------------------------------------------*/
function tirarFoto(){
    navigator.camera.getPicture(onSuccess, onFail, 
        {
            quality: 50, 
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        }
    ); 

    function onSuccess(imageURI){
        var image = document.getElementById('myImage'); 
        image.src = imageURI; 
    };

    function onFail(error){
        alert("Houve um erro ao acessar a câmera: " + error); 
    };
}