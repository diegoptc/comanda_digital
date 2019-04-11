$(document).ready(function(){
    soma_tudo();
});

var itens = {
    'presunto': {
        'quantidade' : 0,
        'valor' : 0.5,
        'total': 0
    },
    'bacon': {
        'quantidade' : 0,
        'valor': 0.8,
        'total': 0
    },
    'hamburguer_boi': {
        'quantidade': 0,
        'valor' : 0.8,
        'total': 0
    },
    'salsicha': {
        'quantidade': 0,
        'valor' : 0.8,
        'total': 0
    },
    'alface': {
        'quantidade': 0,
        'valor': 0.2,
        'total': 0
    },
    'tomate': {
        'quantidade': 0,
        'valor': 0.5,
        'total': 0
    },
    'picles': {
        'quantidade': 0,
        'valor': 0.5,
        'total': 0
    },
    'cebola': {
        'quantidade': 0,
        'valor': 0.10,
        'total': 0
    },
    'queijo': {
        'quantidade': 0,
        'valor': 0.5,
        'total': 0
    },
    'milho':{
        'quantidade': 0,
        'valor': 0.5,
        'total': 0
    },
    'batata_palha':{
        'quantidade': 0,
        'valor': 0.5,
        'total': 0
    },
    'ovo_frito':{
        'quantidade': 0,
        'valor': 0.6,
        'total': 0
    },
    'maionese':{
        'quantidade': 0,
        'valor': 1.0,
        'total': 0
    },
    'mostarda':{
        'quantidade': 0,
        'valor': 1.0,
        'total': 0
    },
    'ketchup':{
        'quantidade': 0,
        'valor': 1.0,
        'total': 0
    },
    'barbecue':{
        'quantidade': 0,
        'valor': 3.00,
        'total': 0
    }
};

function retorna_itens(){
    return itens;
}

function atualiza_quantidades(){
    itens = retorna_itens();
    $("#qtdPresunto").val(itens['presunto']['quantidade']);
    $("#qtdBacon").val(itens['bacon']['quantidade']);
    $("#qtdBoi").val(itens['hamburguer_boi']['quantidade']);
    $("#qtdSalsicha").val(itens['salsicha']['quantidade']);
    $("#qtdAlface").val(itens['alface']['quantidade']);
    $("#qtdTomate").val(itens['tomate']['quantidade']);
    $("#qtdPicles").val(itens['picles']['quantidade']);
    $("#qtdCebola").val(itens['cebola']['quantidade']);
    $("#qtdQueijo").val(itens['queijo']['quantidade']);
    $("#qtdMilho").val(itens['milho']['quantidade']);
    $("#qtdBatataPalha").val(itens['batata_palha']['quantidade']);
    $("#qtdOvoFrito").val(itens['ovo_frito']['quantidade']);
    $("#qtdMaionese").val(itens['maionese']['quantidade']);
    $("#qtdMostarda").val(itens['mostarda']['quantidade']);
    $("#qtdKetchup").val(itens['ketchup']['quantidade']);
    $("#qtdBarbecue").val(itens['barbecue']['quantidade']);
}

function soma_tudo(){
    itens = retorna_itens();
    soma = 0.0;
    for(var item in itens){
        itens[item]['total'] = itens[item]['quantidade'] * itens[item]['valor'];
        soma += itens[item]['total'];
    }
    soma = parseFloat(soma).toFixed(2);
    $("#valor").val('R$ ' + soma);
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
    itens = retorna_itens();
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
    $("#dados").html(conteudo);
}

/*------------------------------------------------------------------------------------
    CALCULAR PEDIDO DE CLIENTE - ADICIONAR ITEM
------------------------------------------------------------------------------------*/
//Adicionar itens ao lanche final
function addItem(produto){
    itens = retorna_itens();
    itens[produto]['quantidade'] += 1;
    atualiza_quantidades();
    soma_tudo();
    atualiza_tabela();
}

/*------------------------------------------------------------------------------------
    CALCULAR PEDIDO DE CLIENTE - REMOVER ITEM
------------------------------------------------------------------------------------*/
function delItem(produto){
    itens = retorna_itens();
    if(itens[produto]['quantidade'] > 0) {
        itens[produto]['quantidade'] -= 1;
        atualiza_quantidades();
        soma_tudo();
        atualiza_tabela();
    }else{
        alert('O item já é igual a 0');
    }
}

/*------------------------------------------------------------------------------------
    FAZER PEDIDO - LER QR CODE DA MESA
------------------------------------------------------------------------------------*/
function fazerPedido(){
    //Verifica se existe algo no pedido
    if($("#valor").val() == 'R$ 0.00'){
        alert("Monte seu lanche antes de fazer o pedido.");
    }
    else{
        var result = confirm("Seu pedido ficou em " + document.getElementById("valor").value +  "\nA câmera será aberta para você ler o QR Code de sua mesa e prosseguir com o pedido.")
        if(result){
            cordova.plugins.barcodeScanner.scan(
                result => {
                    //Recupera o número da mesa
                    var numeroMesa = result.text.toString();
                    firebase.database().ref("mesa").child(numeroMesa).orderByKey().once("value", snapshot => {
                        //Se a mesa existir após a leitura do QR Code
                        if(snapshot.exists()){
                            //Recupera o cliente
                            var usuario = localStorage.getItem("usuarioLogado"); //Recupera o usuário logado (em cache)
                            //Recupera os itens do pedido
                            var pedido = retorna_itens();
                            //Recupera o valor do pedido
                            var valor = $("#valor").val();
                            //Cadastra o pedido com as informações recuperadas
                            firebase.database().ref("pedido").push({cliente: usuario, mesa: numeroMesa, pedido: pedido, valor: valor, status: "Na fila"})
                            
                            alert("Seu pedido foi enviado para cozinha, aguarde um pouco :D");
                            location.href = "menu_cliente.html";
                        }
                        //Se for lido outro QR Code
                        else{
                            alert("Não há nenhuma mesa relacionada com este QR Code!");
                        }
                    })
                },
                error => {
                    alert("Verifique as permissões para uso da câmera!" + error);
                }
            );
        }
    }
}

/*------------------------------------------------------------------------------------
   LIMPAR CAMPOS
------------------------------------------------------------------------------------*/
function limparPedido(){
    result = confirm("Tem certeza que deseja cancelar?");
    if(result){
        itens = retorna_itens();
        for (item in itens){
            itens[item]['quantidade'] = 0
        }
        atualiza_quantidades();
        soma_tudo();
        atualiza_tabela();
    }
};