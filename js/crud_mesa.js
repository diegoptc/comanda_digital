$(document).ready(function(){
    firebase.database().ref().child("mesa").orderByKey().once("value", snapshot => {
        var tabela = "<table class='table table-striped'><tr><th>Número</th><th>Descrição</th><th></th><th></th></tr>";
        snapshot.forEach(mesa => {
            tabela+= "<tr><td>" + mesa.val().numero + "</td><td>" + mesa.val().descricao + 
            "</td><td><button class='btn btn-warning' onclick='attMesa(" + mesa.val().numero + ")'>Editar</button></td>" + 
            "<td><button class='btn btn-danger' onclick='delMesa(" + mesa.val().numero + ")'>Excluir</button></td></tr>";
        })
        tabela+= "</table";
        document.getElementById("listagem").innerHTML = tabela;
    })
})

/*------------------------------------------------------------------------------------
    CADASTRAR/ATUALIZAR MESA
------------------------------------------------------------------------------------*/
function addMesa(){
    var numero = document.getElementById("numero").value;
    var descricao = document.getElementById("descricao").value;
    firebase.database().ref("mesa").child(numero).update({numero: numero, descricao: descricao});
    //Atualiza a página
    location.href = "CRUD_mesa.html";
}

/*------------------------------------------------------------------------------------
    ATUALIZAR MESA
------------------------------------------------------------------------------------*/
function attMesa(id){
    //Encontra a mesa correspondente ao id
    firebase.database().ref("mesa").child(id).orderByKey().once("value", snapshot => {
        //Repassa os valores para os imputs
        document.getElementById("numero").value = snapshot.val().numero;
        document.getElementById("descricao").value = snapshot.val().descricao;
    })
}

/*------------------------------------------------------------------------------------
    REMOVER MESA
------------------------------------------------------------------------------------*/
function delMesa(id){
    //Confirmar a remoção da mesa
    var confirmar =  confirm("Confirmar exclusão?");
    if(confirmar){
        //Encontra a mesa correspondente ao id
        firebase.database().ref("mesa").child(id).remove(); //Remove o registro no firebase
        location.href = "CRUD_mesa.html"; //Refresh
    }
}

/*------------------------------------------------------------------------------------
    LISTAGEM DE MESAS
------------------------------------------------------------------------------------*/
function listagem(){
    var div = document.getElementById("listagem");
    document.getElementById("isListagem").checked ? div.style.display = "block" : div.style.display = "none";
}

/*------------------------------------------------------------------------------------
    LIMPAR FORMULÁRIO
------------------------------------------------------------------------------------*/
function limpar(){
    document.getElementById("numero").value = "";
    document.getElementById("descricao").value = "";
}