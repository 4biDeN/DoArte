<template>
  <q-page class="client-form">
    <div class="form-container">
      <h2>Cadastrar Cliente</h2>
      <q-input v-model="formData.nome" label="Nome" />
      <q-input v-model="formData.documento" label="Documento (CPF)" />
      <q-input v-model="formData.contato" label="Contato" />
      <q-input v-model="formData.cep" label="CEP" />
      <q-input v-model="formData.cidade" label="Cidade" />
      <q-input v-model="formData.endereco" label="Endereço" />
      <q-input v-model="formData.observacoes" label="Observações" />

      <div class="status-nascimento">
        <q-input v-model="formData.status" label="Status" />
        <q-input
          v-model="formData.dataNascimento"
          label="Data de Nascimento"
          type="date"
        />
      </div>

      <div class="buttons">
        <q-btn label="Salvar" color="primary" @click="saveClient" />
        <q-btn label="Cancelar" color="secondary" @click="cancel" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
  nome: "",
  documento: "",
  contato: "",
  cep: "",
  cidade: "",
  endereco: "",
  observacoes: "",
  status: "",
  dataNascimento: "",
});

const saveClient = () => {
  // Implementar lógica para salvar o cliente
  console.log("Cliente salvo:", formData.value);
};

const cancel = () => {
  emit("close");
  console.log("Cadastro cancelado");
};
</script>

<style scoped>
.form-container {
  padding: 20px;
  background-color: #3b3734;
  color: #ffffff;
}

.status-nascimento {
  display: flex;
  justify-content: space-between;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
