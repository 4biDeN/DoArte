<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex">
        <div class="login-container">
          <div class="image-container">
            <img src="../assets/login.jpg" alt="Minha imagem" />
          </div>
          <div class="form-container">
            <q-input
              v-model="username"
              label="Usuário ou e-mail"
              outlined
              dense
              class="input-spacing large-input"
            />
            <q-input
              v-model="password"
              label="Informe a senha"
              type="password"
              outlined
              dense
              class="input-spacing large-input"
              @keyup.enter="submitLogin"
            />
            <q-btn
              label="Login"
              color="primary"
              @click="submitLogin"
              class="login-btn"
            />
          </div>
          <div class="branding">
            <img src="../assets/muller-cj-invert.png" alt="Muller CJ logo" />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Importa o roteador

const username = ref("");
const password = ref("");
const router = useRouter(); // Instancia o roteador

function submitLogin() {
  // Lógica de autenticação (exemplo simples)
  if (username.value === "admin" && password.value === "1234") {
    // Se as credenciais forem válidas, redireciona para a Dashboard
    router.push("/dashboard");
  } else {
    // Exibe uma mensagem de erro se as credenciais forem inválidas
    alert("Usuário ou senha incorretos");
  }
}
</script>

<style scoped>
.login-container {
  background-color: black;
  display: flex;
  align-items: center; /* Alinha verticalmente no centro */
  width: 100%;
  max-width: auto; /* Limite de largura para o container */
  margin: 0 auto; /* Centraliza o container na página */
}

.image-container img {
  background-color: black;
  display: flex;
  align-items: left;
  width: 1418px; /* Define a largura da imagem */
  height: 1025px; /* Mantém a proporção da imagem */
}

.form-container {
  background-color: #3b3734;
  width: 300px; /* Largura da div de login */
  margin-left: 20px; /* Espaço entre a imagem e o formulário */
}

.input-spacing {
  margin-bottom: 20px;
}

/* Inputs maiores */
.large-input .q-field__control {
  font-size: 18px; /* Aumenta o tamanho da fonte */
  padding: 20px 15px; /* Aumenta o espaçamento interno */
}

.q-btn {
  width: 40%;
  display: flex;
  align-items: center;
  background-color: #645d58; /* Azul do botão de login */
  color: white;
}

.q-btn:hover {
  background-color: #645d58; /* Tom mais escuro ao passar o mouse */
}

.branding {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}

.branding {
  position: fixed;
  bottom: 200px; /* Fixado ao final da tela */
  left: 50%;
  transform: translateX(300%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.branding img {
  width: 150px;
  margin-right: 10px;
}
</style>
