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
                    $("#mensagem_erro").hide(100);
                    $("#mensagem_erro").html("Senha incorreta");
                    $("#mensagem_erro").show(300);
                }
                //Senha correta, redireciona para próxima página
                //Verifica o grupo de usuário para redirecionamento
                else{
                    localStorage.setItem("usuarioLogado", usuario); //Armazena em cache o usuário logado
                    if(snapshot.val().grupo == "Cliente")
                        window.location = "menu_cliente.html";
                    else
                    window.location = "menu_funcionario.html";
                }
            }
            //Usuário não existe
            else{ 
                $("#mensagem_erro").hide(100);
                $("#mensagem_erro").html("Este usuário não existe no sistema")
                $("#mensagem_erro").show(300);
            }
        })
    }
    //Campos vazios
    else{
        $("#mensagem_erro").hide(100);
        $("#mensagem_erro").html("Entre com usuario e senha");
        $("#mensagem_erro").show(300);
    }
}