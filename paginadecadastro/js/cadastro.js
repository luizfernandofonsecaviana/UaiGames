// =============================================
// CONFIGURAÇÃO DO SUPABASE
// Substitua os valores abaixo pelos do seu projeto
// Acesse: https://supabase.com → Seu projeto → Settings → API
// =============================================
const SUPABASE_URL = "https://pghogrpvloukvjxqyflm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaG9ncnB2bG91a3ZqeHF5ZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODA0NTMsImV4cCI6MjA5MTc1NjQ1M30.rvYTFT0UrSPGKM1-Zo_fCb6OXMOZC6l-foh6dl-kh-g";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================

function validarMsgEmailVazio(){
    const email = form.email().value;
    if(!email){
        form.erroEmail().style.display = "block";
    }else{
        form.erroEmail().style.display = "none";
    }
    desativarBtnCadastrar();
}

function validarMsgSenhaVazia(){
    const senha = form.senha().value;
    if(!senha){
        form.erroSenha().style.display = "block";
    }else{
        form.erroSenha().style.display = "none";
    }

    if(senha.length < 6){
        form.erroSenha6().style.display = "block";
    }else{
        form.erroSenha6().style.display = "none";
    }

    validarSenhasIguais();
    desativarBtnCadastrar();
}

function validarSenhasIguais(){
    const senha = form.senha().value;
    const confirmarmesenha = form.confirmarSenha().value;
    if(senha != confirmarmesenha){
        form.erroSenhaIgual().style.display = "block";
    }else{
        form.erroSenhaIgual().style.display = "none";
    }
    desativarBtnCadastrar();
}

async function cadastrar(){
    const email = form.email().value;
    const senha = form.senha().value;

    const { error } = await supabaseClient.auth.signUp({ email, password: senha });

    if (!error) {
        alert("Cadastro realizado! Verifique seu email para confirmar a conta.");
        window.location.href = "../paginadelogin/PaginaLogin/login.html";
    } else {
        alert(getMsgErro(error));
    }
}

function getMsgErro(error){
    if(error.message.includes("already registered") || error.message.includes("already been registered")){
        return "Email já cadastrado!";
    }
    return error.message || "Erro ao cadastrar.";
}

function desativarBtnCadastrar(){
    form.btnCadastrar().disabled = !validarFormulario();
}

function validarFormulario(){
    const email = form.email().value;
    if(!email) return false;

    const senha = form.senha().value;
    if(!senha || senha.length < 6) return false;

    const confirmarmesenha = form.confirmarSenha().value;
    if(senha != confirmarmesenha) return false;

    return true;
}

function irLogin(){
    window.location.href="../paginadelogin/PaginaLogin/login.html";
}

const form = {
    email: () => document.getElementById('email'),
    senha: () => document.getElementById('senha'),
    confirmarSenha: () => document.getElementById('confirmarmesenha'),
    erroEmail: () => document.getElementById('erroEmail'),
    erroSenha: () => document.getElementById('erroSenha'),
    erroSenha6: () => document.getElementById('erroSenha6'),
    erroSenhaIgual: () => document.getElementById('erroConfirmarSenhaIgual'),
    btnCadastrar: () => document.getElementById('BtnCadastrar'),
    pglogin: () => document.getElementById('BtnLogin')
};
