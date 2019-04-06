/*------------------------------------------------------------------------------------
    INICIALIZAÇÃO DO FIREBASE
------------------------------------------------------------------------------------*/
var config = {
    apiKey: "AIzaSyC1UdL35EsKpGZo_tNyzTQpX11ZZuEpx0g",
    authDomain: "appinventario-a8acd.firebaseapp.com",
    databaseURL: "https://appinventario-a8acd.firebaseio.com",
    projectId: "appinventario-a8acd",
    storageBucket: "appinventario-a8acd.appspot.com",
    messagingSenderId: "827922887965"
};
firebase.initializeApp(config);

/*------------------------------------------------------------------------------------
    AUTENTICAR USUÁRIO
------------------------------------------------------------------------------------*/
function autenticar(){
    var usuario = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;

    if(usuario != "" && senha != ""){
        firebase.database().ref("usuario").child(usuario).orderByKey().once("value", snapshot => {
            if(snapshot.exists()){
                //Descriptografando a senha do usuário para comparação
                var senha_descriptografada = CryptoJS.AES.decrypt(snapshot.val().senha, usuario + senha).toString(CryptoJS.enc.Utf8);
                //Verificação de senha
                if(senha != senha_descriptografada){ 
                    $("#mensagem_erro").html("Senha incorreta");
                    $("#mensagem_erro").show(300);
                }
                //Senha correta, redireciona para próxima página
                //Verifica o grupo de usuário para redirecionamento
                else{
                    localStorage.setItem("usuarioLogado", usuario); //Armazena em cache o usuário logado
                    //localStorage.getItem("usuarioLogado"); //Recupera o usuário logado (em cache)
                    if(snapshot.val().grupo == "Cliente")
                        window.location = "menu_cliente.html";
                    else
                       window.location = "CRUD_mesa.html";
                }
            }
            //Usuário não existe
            else{ 
                $("#mensagem_erro").html("Este usuário não existe no sistema")
                $("#mensagem_erro").show(300);
            }
        })
    }
    //Campos vazios
    else{
        $("#mensagem_erro").htlm("Entre com usuario e senha");
        $("#mensagem_erro").show(300);
    }
}

/*------------------------------------------------------------------------------------
    NOVO USUÁRIO
------------------------------------------------------------------------------------*/
function novoUsuario(){
    var usuario = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;
    var csenha = document.getElementById("confirmacao_senha").value;

    if(usuario == ""  || senha == "" || csenha == ""){
        $("#mensagem_erro").html("Preencha todos os campos necessários!");
        $("#mensagem_erro").show(300);
    }
    else if(senha != csenha){
        $("#mensagem_erro").html("Senha e confirmação não coincidem!");
        $("#mensagem_erro").show(300);
    }
    else{
        firebase.database().ref("usuario").child(usuario).orderByKey().once("value", snapshot => {
            //Usuário já existe no banco de dados
            if(snapshot.exists()){ 
                $("#mensagem_erro").html("Já existe um usuário com este nome!");
                $("#mensagem_erro").show(300)
            }
            //Cadastra usuário no banco de dados
            else{ 
                //Criptografando a senha do usuário com chave de criptografia formada pelo usuario + senha
                var senha_criptografada = CryptoJS.AES.encrypt(senha, usuario + senha).toString();

                var grupo = "";
                //Nenhum token informado cadastra como cliente
                if($("#token").val() == ""){
                    grupo = "Cliente";
                }
                //Se informado um token verifica se é o correto
                else if($("#token").val() != "180c4e8f50a356b7408cd08029083d77"){ //token = md5(prova01)
                    $("#mensagem_erro").html("Token inválido!");
                    $("#mensagem_erro").show(300)
                }
                //Se o token tive correto cadastra como funcionário
                else if($("#token").val() == "180c4e8f50a356b7408cd08029083d77"){
                    grupo = "Funcionario";
                }
                firebase.database().ref("usuario").child(usuario).update({usuario: usuario, senha: senha_criptografada, grupo: grupo});
                alert(grupo + " cadastrado com sucesso");
                window.location = "index.html";
            }
        }) 
    }
}

/*------------------------------------------------------------------------------------
    LER TOKEN EM QR CODE
------------------------------------------------------------------------------------*/
function lerToken(){
    cordova.plugins.barcodeScanner.scan(
        result => { 
            document.getElementById("token").value = result.text; 
        },
        error => { 
            alert("Erro interno: " + error); 
        }
    );
}

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
    FAZER PEDIDO - LER QR CODE DA MESA
------------------------------------------------------------------------------------*/
function fazerPedido(){
    var result = confirm("A câmera será aberta para você ler o QR Code de sua mesa e prosseguir com o pedido.")
    if(result){
        cordova.plugins.barcodeScanner.scan(
            result => {
                var numeroMesa = result.text.toString();
                firebase.database().ref("mesa").child(numeroMesa).orderByKey().once("value", snapshot => {
                    if(snapshot.exists()){
                        alert(numeroMesa);
                    }
                    else{
                        alert("Não há nenhuma mesa relacionada com este QR Code!");
                    }
                })
            },
            error => {
                alert("Verifique as permissões para uso da câmera!");
            }
        );
    }
}

/*------------------------------------------------------------------------------------
   CADASTRAR PEDIDO DE CLIENTE
------------------------------------------------------------------------------------*/
//Adicionar itens ao lanche final
function addItem(valor, quantidadeID){
    //Recupera o valor do item
    var valorAux = parseFloat(valor);
    //Incrementa a quantidade do item
    document.getElementById(quantidadeID).value = parseInt(document.getElementById(quantidadeID).value) + 1;
    //Se ainda não tive nenhum valor
    if(document.getElementById("valor").value == ""){
        document.getElementById("valor").value = valorAux;
    }
    //Se não soma com o atual
    else{
        document.getElementById("valor").value = (parseFloat(document.getElementById("valor").value) + valorAux).toFixed(2);
    }
}

/*------------------------------------------------------------------------------------
    LIMPAR FORMULÁRIO
------------------------------------------------------------------------------------*/
function limpar(){
    document.getElementById("numero").value = "";
    document.getElementById("descricao").value = "";
}

function limparPedido(){
    var result = confirm("Confirmar cancelamento?");
    if(result){
        document.getElementById("valor").value = "";
        document.getElementById("qtdPresunto").value = "0";
        document.getElementById("qtdBacon").value = "0";
        document.getElementById("qtdBoi").value = "0";
        document.getElementById("qtdSalsicha").value = "0";
        document.getElementById("qtdAlface").value = "0";
        document.getElementById("qtdTomate").value = "0";
        document.getElementById("qtdPicles").value = "0";
        document.getElementById("qtdCebola").value = "0";
        document.getElementById("qtdQueijo").value = "0";
        document.getElementById("qtdMilho").value = "0";
        document.getElementById("qtdBatataPalha").value = "0";
        document.getElementById("qtdOvoFrito").value = "0";
        document.getElementById("qtdMaionese").value = "0";
        document.getElementById("qtdMostarda").value = "0";
        document.getElementById("qtdKetchup").value = "0";
        document.getElementById("qtdBarbecue").value = "0";
    }
}