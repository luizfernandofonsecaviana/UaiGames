// =============================================
// CONFIGURAÇÃO DO SUPABASE
// Acesse: https://supabase.com → Seu projeto → Settings → API
// =============================================
const SUPABASE_URL = "https://pghogrpvloukvjxqyflm.supabase.co"; // ← espaço removido (era bug!)
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaG9ncnB2bG91a3ZqeHF5ZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODA0NTMsImV4cCI6MjA5MTc1NjQ1M30.rvYTFT0UrSPGKM1-Zo_fCb6OXMOZC6l-foh6dl-kh-g";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================

window.onload = function () {
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const togglePassword = document.getElementById('togglePassword');

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const erroEmail = document.getElementById('erroEmail');
            if (emailInput.value.trim() === "") {
                erroEmail.innerText = "Email obrigatório";
                erroEmail.style.display = "block";
            } else {
                erroEmail.style.display = "none";
            }
        });
    }

    if (senhaInput) {
        senhaInput.addEventListener('blur', () => {
            const erroSenha = document.getElementById('erroSenha');
            if (senhaInput.value.trim() === "") {
                erroSenha.innerText = "Senha obrigatória";
                erroSenha.style.display = "block";
            } else {
                erroSenha.style.display = "none";
            }
        });
    }

    if (togglePassword && senhaInput) {
        togglePassword.addEventListener('click', function () {
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text';
                togglePassword.classList.add('visible');
            } else {
                senhaInput.type = 'password';
                togglePassword.classList.remove('visible');
            }
        });
    }
};

async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        window.location.href = "../paginadelogin/PaginaLogin/login.html";
    } else {
        alert("Erro ao deslogar. Tente novamente.");
    }
}

async function login() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const erroEmail = document.getElementById('erroEmail');
    const erroSenha = document.getElementById('erroSenha');
    const btnSubmit = document.querySelector('input[type="submit"]');

    erroEmail.style.display = "none";
    erroSenha.style.display = "none";

    let temErro = false;

    if (!email) {
        erroEmail.innerText = "Email obrigatório";
        erroEmail.style.display = "block";
        temErro = true;
    }

    if (!senha) {
        erroSenha.innerText = "Senha obrigatória";
        erroSenha.style.display = "block";
        temErro = true;
    }

    if (temErro) return;

    if (btnSubmit) {
        btnSubmit.value = "Entrando...";
        btnSubmit.disabled = true;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password: senha });

    if (btnSubmit) {
        btnSubmit.value = "Entrar";
        btnSubmit.disabled = false;
    }

    if (!error) {
        window.location.href = "../../pg_inicial/bem_vindo.html";
    } else {
        erroSenha.innerText = "Email e/ou senha inválidos!";
        erroSenha.style.display = "block";
    }
}

async function recuperarSenha() {
    const email = document.getElementById('email').value.trim();
    const msgRecuperacao = document.getElementById('msgRecuperacao');
    const erroEmail = document.getElementById('erroEmail');

    if (msgRecuperacao) {
        msgRecuperacao.style.display = "none";
        msgRecuperacao.innerText = "";
    }
    if (erroEmail) erroEmail.style.display = "none";

    if (!email) {
        erroEmail.innerText = "Informe o email para recuperar a senha";
        erroEmail.style.display = "block";
        document.getElementById('email').focus();
        return;
    }

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: "https://uai-games-cnof.vercel.app/reset-password.html"
    });

    if (!error) {
        if (msgRecuperacao) {
            msgRecuperacao.innerText = "✓ Email de recuperação enviado! Verifique sua caixa de entrada ou spam.";
            msgRecuperacao.style.display = "block";
            msgRecuperacao.style.color = "#00ff00";
        }
    } else {
        let mensagemErro = "Erro ao enviar email de recuperação.";

        if (error.message.includes("User not found")) {
            mensagemErro = "Email não encontrado no sistema.";
        } else if (error.message.includes("Invalid email")) {
            mensagemErro = "Email inválido.";
        } else if (error.message.includes("rate limit") || error.message.includes("too many")) {
            mensagemErro = "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
        } else {
            mensagemErro += " " + error.message;
        }

        if (msgRecuperacao) {
            msgRecuperacao.innerText = "✗ " + mensagemErro;
            msgRecuperacao.style.display = "block";
            msgRecuperacao.style.color = "#ff4444";
        }
    }
}
