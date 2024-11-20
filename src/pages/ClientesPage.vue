<template>
  <q-page class="client-page">
    <div class="header">
      <q-btn
        flat
        round
        icon="add"
        label="Novo Cliente"
        color="primary"
        @click="newClient"
      />
      <div class="search-container">
        <q-input
          outlined
          v-model="search"
          label="Buscar..."
          class="search-input"
          color="white"
          @keyup.enter="performSearch"
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
      @row-click="editClient"
    />

    <!-- Modal para o formulário de cadastro -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="client-form" bg-color="#3b3734">
        <q-card-section>
          <h2 class="form-title">
            {{ isEditing ? "Editar Cliente" : "Cadastrar Cliente" }}
          </h2>
          <q-input
            v-model="formData.nome"
            label="Nome"
            class="white-text-input"
          />
          <q-input
            v-model="formData.cpf"
            label="Documento (CPF)"
            class="white-text-input"
          />
          <q-input
            v-model="formData.contato"
            label="Contato"
            class="white-text-input"
          />
          <q-input
            v-model="formData.cep"
            label="CEP"
            class="white-text-input"
          />
          <q-input
            v-model="formData.cidade"
            label="Cidade"
            class="white-text-input"
          />
          <q-input
            v-model="formData.endereco"
            label="Endereço"
            class="white-text-input"
          />
          <q-input
            v-model="formData.observacoes"
            label="Observações"
            class="white-text-input"
          />

          <div class="status-nascimento">
            <q-input
              v-model="formData.status"
              label="Status"
              class="white-text-input"
            />
            <q-input
              v-model="formData.dataNascimento"
              label="Data de Nascimento"
              type="date"
              class="white-text-input"
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

const showDialog = ref(false);
const isEditing = ref(false);
const search = ref("");
const pagination = ref({ page: 1, rowsPerPage: 5 });
const clients = ref([]);
const formData = ref({
  id: null,
  nome: "",
  cpf: "",
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
    name: "cpf",
    label: "Documento",
    align: "left",
    field: (row) => row.cpf,
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

const newClient = () => {
  resetForm();
  isEditing.value = false;
  showDialog.value = true;
};

const editClient = async (client) => {
  let id = client.id;
  console.log(id);
  try {
    const response = await axios.get(`http://localhost:3000/clientes/${id}`);

    formData.value = response.data; // Preenche o formulário com os dados retornados
    isEditing.value = true;
    showDialog.value = true; // Abre o modal para edição
  } catch (error) {
    console.error("Erro ao buscar dados do cliente:", error);
  }
};

// Função para salvar o cliente no JSON-Server
const saveClient = async () => {
  try {
    if (isEditing.value) {
      await axios.put(
        `http://localhost:3000/clientes/${formData.value.id}`,
        formData.value
      );
    } else {
      await axios.post("http://localhost:3000/clientes", formData.value);
    }
    showDialog.value = false;
    resetForm();
    fetchClients();
  } catch (error) {
    console.error("Erro ao salvar o cliente:", error);
  }
};

// Função para limpar o formulário após salvar
const resetForm = () => {
  formData.value = {
    id: null,
    nome: "",
    cpf: "",
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
  // Verifica se há algum termo de busca
  if (search.value.trim() === "") {
    // Se a busca estiver vazia, exibe todos os clientes
    fetchClients();
  } else {
    // Filtra os clientes com base no nome, cpf ou cidade
    const filteredClients = clients.value.filter((client) => {
      const searchTerm = search.value.toLowerCase();
      return (
        client.nome.toLowerCase().includes(searchTerm) ||
        client.cpf.includes(searchTerm) ||
        client.cidade.toLowerCase().includes(searchTerm)
      );
    });
    clients.value = filteredClients; // Atualiza a lista de clientes exibidos
  }
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
.client-form {
  background-color: #3b3734;
}

.white-text-input .q-field__native {
  color: white; /* Torna o texto do input branco */
  caret-color: white; /* Torna o cursor branco */
}

/* Para garantir que o placeholder e o texto digitado sejam brancos */
.white-text-input .q-field__control {
  color: white;
}

.form-title {
  color: white;
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

.search-input .q-field__native {
  color: white; /* Define a cor do texto do input */
}

.search-input {
  width: 200px;
  margin-right: 10px;
  color: #ffffff;
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
