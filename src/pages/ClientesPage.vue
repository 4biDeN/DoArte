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
      <q-btn
        flat
        round
        icon="edit"
        label="Editar Cliente"
        color="primary"
        @click="editSelectedClient"
        :disable="!selectedClient"
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

    <div class="client-list">
      <q-card
        v-for="client in clients"
        :key="client.id"
        class="client-card"
        @click="selectClient(client)"
        :class="{ selected: selectedClient && selectedClient.id === client.id }"
      >
        <q-card-section>
          <div class="client-info">
            <q-checkbox
              :model-value="selectedClient && selectedClient.id === client.id"
              @update:model-value="toggleSelection(client)"
              color="primary"
            />
            <div class="client-details">
              <div class="client-field">
                <div class="field-label">Nome</div>
                <div class="field-value">{{ client.nome }}</div>
              </div>
              <div class="client-field">
                <div class="field-label">CPF</div>
                <div class="field-value">{{ client.cpf }}</div>
              </div>
              <div class="client-field">
                <div class="field-label">Telefone</div>
                <div class="field-value">{{ client.contato }}</div>
              </div>
              <div class="client-field">
                <div class="field-label">Status</div>
                <div class="field-value">{{ client.status }}</div>
              </div>
              <div class="client-field">
                <div class="field-label">Nascimento</div>
                <div class="field-value">{{ client.dataNascimento }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

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
import ClienteService from "../services/clienteService";

const showDialog = ref(false);
const isEditing = ref(false);
const search = ref("");
const clients = ref([]);
const selectedClient = ref(null);
const formData = ref({
  id: "",
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

// Função para buscar os clientes do servidor
const fetchClients = async () => {
  try {
    clients.value = await ClienteService.getClientes();
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
  }
};

const newClient = () => {
  resetForm();
  isEditing.value = false;
  showDialog.value = true;
};

const editSelectedClient = () => {
  if (selectedClient.value) {
    editClient(selectedClient.value);
  }
};

const editClient = async (client) => {
  try {
    const clientData = await ClienteService.getClienteById(client.id);
    formData.value = clientData;
    isEditing.value = true;
    showDialog.value = true;
  } catch (error) {
    console.error("Erro ao buscar dados do cliente:", error);
  }
};

const saveClient = async () => {
  try {
    if (isEditing.value) {
      await ClienteService.updateCliente(formData.value);
    } else {
      await ClienteService.addCliente(formData.value);
    }
    showDialog.value = false;
    resetForm();
    fetchClients();
  } catch (error) {
    console.error("Erro ao salvar o cliente:", error);
  }
};

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
  selectedClient.value = null;
};

const performSearch = () => {
  if (search.value.trim() === "") {
    fetchClients();
  } else {
    const filteredClients = clients.value.filter((client) => {
      const searchTerm = search.value.toLowerCase();
      return (
        client.nome.toLowerCase().includes(searchTerm) ||
        client.cpf.includes(searchTerm) ||
        client.cidade.toLowerCase().includes(searchTerm)
      );
    });
    clients.value = filteredClients;
  }
};

const selectClient = (client) => {
  selectedClient.value = client;
};

const toggleSelection = (client) => {
  if (selectedClient.value && selectedClient.value.id === client.id) {
    selectedClient.value = null; // Deselect if already selected
  } else {
    selectedClient.value = client; // Select the clicked client
  }
};

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
  color: white;
  caret-color: white;
}

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
  color: white;
}

.search-input {
  width: 200px;
  margin-right: 10px;
  color: #ffffff;
}

.search-button {
  height: 40px;
}

.client-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.client-card {
  background-color: #201f1c;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
}

.client-card.selected {
  border: 2px solid #ffffff;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.client-details {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.client-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.field-label {
  font-weight: bold;
  margin-bottom: 4px;
}

.field-value {
  font-size: 14px;
}
</style>
