var itens = {};

$(document).ready(function(){
    firebase.database().ref().child("pedido").orderByKey().once("value", snapshot => {
        var conteudo = "";
        snapshot.forEach(pedido => {
            if(pedido.val().cliente == localStorage.getItem("usuarioLogado")){
                conteudo+= "<tr><td>" + pedido.val().status + "</td><td>" + "<button class='ui teal button' onclick='recupera_itens("+'"'+pedido.key+'"'+")'>Visualizar pedido</button>" + "<td>" + pedido.val().valor + "</tr>";
            }
        })
        $("#dados").html(conteudo);
    })
})

function recupera_itens(chave){
    firebase.database().ref().child("pedido").orderByKey().once("value", snapshot => {
        snapshot.forEach(pedido => {
            if(pedido.key == chave){
                itens = pedido.val().pedido;
                atualiza_tabela();
                $('.ui.modal').modal('show');
            }
        })
    })
}

function configura_nome(nome){
    nome_aux = '';
    espaco = 0;
    for (key in nome){
        if(key == 0){
            nome_aux += nome[key].toUpperCase();
        }else if(nome[key] == '_'){
            nome_aux += ' '
            espaco = 1;
        }else if(espaco == 1) {
            nome_aux += nome[key].toUpperCase();
            espaco = 0;
        }else{
            nome_aux += nome[key];
        }   
    }
    return nome_aux;
}

function atualiza_tabela(){
    conteudo = '';
    for (item in itens) {
        if(itens[item]['quantidade'] > 0) {
            nome = configura_nome(item);
            conteudo += '<tr>';
            conteudo +=     '<td>'+nome+'</td>';
            conteudo +=     '<td>'+itens[item]["quantidade"]+'</td>'
            conteudo += '</tr>';
        }
    }
    $("#dados_modal").html(conteudo);
    console.log(conteudo);
}

function close_modal(){
    $('.ui.modal').modal('hide');
}