<template>
  <q-page class="client-page">
    <div class="header">
      <q-btn
        flat
        round
        icon="add"
        label="Novo Cliente"
        color="primary"
        @click="showDialog = true"
      />
      <div class="search-container">
        <q-input
          outlined
          v-model="search"
          label="Buscar..."
          class="search-input"
        />
        <q-btn
          label="Buscar"
          color="primary"
          class="search-button"
          @click="performSearch"
        />
      </div>
    </div>

    <q-table
      :rows="clients"
      :columns="columns"
      row-key="id"
      class="client-table"
      :style="{ backgroundColor: '#201f1c', color: '#ffffff' }"
      :pagination="pagination"
    />

    <!-- Modal para o formulário de cadastro -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="client-form">
        <q-card-section>
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
            <q-btn
              label="Cancelar"
              color="secondary"
              @click="showDialog = false"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const showDialog = ref(false); // Controla a visibilidade do modal
const search = ref("");
const pagination = ref({ page: 1, rowsPerPage: 5 });
const clients = ref([]); // Lista de clientes
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

// Configura as colunas para exibição
const columns = [
  { name: "nome", label: "Nome", align: "left", field: (row) => row.nome },
  {
    name: "documento",
    label: "Documento",
    align: "left",
    field: (row) => row.documento,
  },
  {
    name: "contato",
    label: "Telefone",
    align: "left",
    field: (row) => row.contato,
  },
  {
    name: "status",
    label: "Status",
    align: "left",
    field: (row) => row.status,
  },
  {
    name: "dataNascimento",
    label: "Data de Nascimento",
    align: "left",
    field: (row) => row.dataNascimento,
  },
];

// Função para buscar os clientes do servidor
const fetchClients = async () => {
  try {
    const response = await axios.get("http://localhost:3000/clientes");
    clients.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
  }
};

// Função para salvar o cliente no JSON-Server
const saveClient = async () => {
  try {
    await axios.post("http://localhost:3000/clientes", formData.value);
    showDialog.value = false; // Fecha o modal
    resetForm(); // Limpa o formulário
    fetchClients(); // Atualiza a lista de clientes após salvar
  } catch (error) {
    console.error("Erro ao salvar o cliente:", error);
  }
};

// Função para limpar o formulário após salvar
const resetForm = () => {
  formData.value = {
    nome: "",
    documento: "",
    contato: "",
    cep: "",
    cidade: "",
    endereco: "",
    observacoes: "",
    status: "",
    dataNascimento: "",
  };
};

// Função de busca (a ser implementada)
const performSearch = () => {
  // Implementar lógica de busca
};

// Chama fetchClients ao montar o componente
onMounted(fetchClients);
</script>

<style scoped>
.client-page {
  padding: 20px;
  background-color: #3b3734;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  width: 200px;
  margin-right: 10px;
}

.search-button {
  height: 40px;
}

.client-table {
  background-color: #201f1c;
  color: #ffffff;
  flex-grow: 1;
}

.client-table th,
.client-table td {
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
