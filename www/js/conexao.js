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

//Autenticar usuário
function autenticar(){
    var cpf = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;

    if(cpf != "" && senha != ""){
        firebase.database().ref("usuario").child(cpf).orderByKey().once("value", snapshot => {
            if(snapshot.exists()){
                //Descriptografando a senha do usuário para comparação
                var senha_descriptografada = CryptoJS.AES.decrypt(snapshot.val().senha, cpf + senha).toString(CryptoJS.enc.Utf8);
                //Verificação de senha
                if(senha != senha_descriptografada){ 
                    $("#mensagem_erro").html("Senha incorreta");
                    $("#mensagem_erro").show(300);
                }
                //Senha correta, redireciona para próxima página
                else{ 
                    window.location = "cadastro.html";
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
        $("#mensagem_erro").htlm("Entre com cpf e senha");
        $("#mensagem_erro").show(300);
    }
}

function novoUsuario(){
    var cpf = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;
    var csenha = document.getElementById("confirmacao_senha").value;

    if(cpf == ""  || senha == "" || csenha == ""){
        $("#mensagem_erro").html("Preencha todos os campos necessários!");
        $("#mensagem_erro").show(300);
    }
    else if(senha != csenha){
        $("#mensagem_erro").html("Senha e confirmação não coincidem!");
        $("#mensagem_erro").show(300);
    }
    else{
        firebase.database().ref("usuario").child(cpf).orderByKey().once("value", snapshot => {
            //Usuário já existe no banco de dados
            if(snapshot.exists()){ 
                $("#mensagem_erro").html("Já existe um usuário com este CPF!");
                $("#mensagem_erro").show(300)
            }
            //Cadastra usuário no banco de dados
            else{ 
                //Criptografando a senha do usuário com chave de criptografia formada pelo cpf + senha
                var senha_criptografada = CryptoJS.AES.encrypt(senha, cpf + senha).toString();
                firebase.database().ref("usuario").child(cpf).update({cpf: cpf, senha: senha_criptografada});
                alert("Usuário cadastrado com sucesso");
            }
        })
    }
}