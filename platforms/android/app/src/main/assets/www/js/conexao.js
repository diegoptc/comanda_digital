//Inicializando o firebase
var config = {
    apiKey: "AIzaSyC1UdL35EsKpGZo_tNyzTQpX11ZZuEpx0g",
    authDomain: "appinventario-a8acd.firebaseapp.com",
    databaseURL: "https://appinventario-a8acd.firebaseio.com",
    projectId: "appinventario-a8acd",
    storageBucket: "appinventario-a8acd.appspot.com",
    messagingSenderId: "827922887965"
};
firebase.initializeApp(config);

/** AUTENTICAR USUÁRIO **/
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
                    if(snapshot.val().grupo == "Cliente")
                        //window.location = "visoa_cliente.html";
                        alert("Conectado como cliente");
                    else
                       //window.location = "visao_funcionario.html";
                       alert("Conectado como funcionário");                  
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

/** NOVO USUÁRIO **/
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

/** LER TOKEN **/
function lerToken(){
    cordova.plugins.barcodeScanner.scan(
        function(result){
            $("#token").val(result.text);
        },
        function(error){
            alert("Scanning failed: " + error);
        }
    );
}