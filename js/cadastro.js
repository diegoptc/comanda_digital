$(document).ready(function(){
    valida_coincidencia();
});

function valida_coincidencia(){
    senha = $("#senha").val();
    confirm_senha = $("#confirmacao_senha").val();
    if(confirm_senha != senha && confirm_senha.length >= 1){
        $("#campo_confirmacao_senha").addClass("error")
        $("#pointing_confirm").show(300);
    }else{
        $("#campo_confirmacao_senha").removeClass("error");
        $("#pointing_confirm").hide(300);
    }
};

$("#confirmacao_senha").keyup(function(){
    valida_coincidencia();
});

$("#senha").keyup(function(){
    valida_coincidencia();
});

/*------------------------------------------------------------------------------------
    NOVO USUÁRIO
------------------------------------------------------------------------------------*/
function novoUsuario(){
    var usuario = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;
    var csenha = document.getElementById("confirmacao_senha").value;

    if(usuario == ""  || senha == "" || csenha == ""){
        $("#mensagem_erro").hide(100);
        $("#mensagem_erro").html("Preencha todos os campos necessários!");
        $("#mensagem_erro").show(300);
    }
    else if(senha != csenha){
        $("#mensagem_erro").hide(100);
        $("#mensagem_erro").html("Senha e confirmação não coincidem!");
        $("#mensagem_erro").show(300);
    }
    else{
        firebase.database().ref("usuario").child(usuario).orderByKey().once("value", snapshot => {
            //Usuário já existe no banco de dados
            if(snapshot.exists()){ 
                $("#mensagem_erro").hide(100);
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
                    firebase.database().ref("usuario").child(usuario).update({usuario: usuario, senha: senha_criptografada, grupo: grupo});
                    alert(grupo + " cadastrado com sucesso");
                    window.location = "index.html";
                }
                //Se informado um token verifica se é o correto
                else if($("#token").val() != "180c4e8f50a356b7408cd08029083d77"){ //token = md5(prova01)
                    $("#mensagem_erro").hide(100);
                    $("#mensagem_erro").html("Token inválido!");
                    $("#mensagem_erro").show(300)
                }
                //Se o token tive correto cadastra como funcionário
                else if($("#token").val() == "180c4e8f50a356b7408cd08029083d77"){
                    grupo = "Funcionario";
                    firebase.database().ref("usuario").child(usuario).update({usuario: usuario, senha: senha_criptografada, grupo: grupo});
                    alert(grupo + " cadastrado com sucesso");
                    window.location = "index.html";
                }
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