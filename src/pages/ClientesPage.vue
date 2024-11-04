<template>
  <q-page class="client-page">
    <div class="header">
      <q-btn
        flat
        round
        icon="add"
        label="Novo Cliente"
        color="primary"
        @click="showForm = true"
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

    <ClienteForm v-if="showForm" @close="showForm = false" />
    <q-table
      :rows="clients"
      :columns="columns"
      row-key="id"
      class="client-table"
      :style="{ backgroundColor: '#201f1c', color: '#ffffff' }"
      v-model:pagination="pagination"
    />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import ClienteForm from "./ClienteForm.vue";

const search = ref("");
const pagination = ref({ page: 1, rowsPerPage: 5 });
const showForm = ref(false);

const clients = ref([
  {
    id: 1,
    codigo: "001",
    nome: "Cliente A",
    documento: "123",
    telefone: "123456789",
    status: "Ativo",
    dias: "10",
  },
  // Adicionar mais clientes aqui...
]);

const columns = [
  {
    name: "codigo",
    required: true,
    label: "Código",
    align: "left",
    field: (row) => row.codigo,
  },
  { name: "nome", label: "Nome", align: "left", field: (row) => row.nome },
  {
    name: "documento",
    label: "Documento",
    align: "left",
    field: (row) => row.documento,
  },
  {
    name: "telefone",
    label: "Telefone",
    align: "left",
    field: (row) => row.telefone,
  },
  {
    name: "status",
    label: "Status",
    align: "left",
    field: (row) => row.status,
  },
  {
    name: "dias",
    label: "Dias s/ Comprar",
    align: "left",
    field: (row) => row.dias,
  },
];

const performSearch = () => {
  // Implementar lógica de busca aqui
};
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
  height: 40px; /* Ajuste a altura do botão para maior visibilidade */
}

.client-table {
  background-color: #201f1c;
  color: #ffffff;
  flex-grow: 1; /* Faz a tabela ocupar o espaço restante */
}

.client-table th,
.client-table td {
  color: #ffffff; /* Cor do texto da tabela */
}
</style>
