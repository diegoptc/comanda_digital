$(document).ready(function(){
    firebase.database().ref().child("pedido").orderByKey().once("value", snapshot => {
        var tabela = "<table class='table table-striped'><tr><th>Status</th><th>Lanche</th><th>Mesa</th></tr>";
            snapshot.forEach(pedido => {
            //Verifica se o pedido não foi iniciado (para iniciar)
            if(pedido.val().status == "Na fila"){
                tabela+= "<tr><td><button class='btn btn-info' onclick=statusPedido('" + pedido.key + "')>Fazer</button></td><td>" + pedido.val().pedido + "</td><td>" + pedido.val().mesa + "</td></tr>";
            }
            //Opção de pedido concluido
            if(pedido.val().status == "Iniciado"){
                tabela+= "<tr><td><button class='btn btn-warning' onclick=finalizarPedido('" + pedido.key + "')>Finalizar</button></td><td>" + pedido.val().pedido + "</td><td>" + pedido.val().mesa + "</td></tr>";
            }
        })
        tabela+= "</table";
        document.getElementById("listaPedidos").innerHTML = tabela;
    })
})

/*------------------------------------------------------------------------------------
            ATUALIZAR STATUS DO PEDIDO - INICIADO E ENTREGUE
------------------------------------------------------------------------------------*/
function statusPedido(idPedido){
    firebase.database().ref("pedido").child(idPedido).update({status: "Iniciado"})
    location.href = "lista_pedidos_funcionario.html";
}

function finalizarPedido(idPedido){
    //Confirmar a conclusão do pedido
    var confirmar =  confirm("Concluir pedido?");
    if(confirmar){
        firebase.database().ref("pedido").child(idPedido).update({status: "Entregue"})
        location.href = "lista_pedidos_funcionario.html";
    }
}