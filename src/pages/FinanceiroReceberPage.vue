<template>
  <q-page class="financeiro-page">
    <div class="header">
      <div class="icon-title">
        <q-btn
          flat
          round
          icon="monetization_on"
          color="primary"
          @click="goToPagar"
        />
        <span class="title">A RECEBER</span>

        <!-- Botão para adicionar nova conta a receber -->
        <q-btn
          flat
          round
          icon="add"
          color="primary"
          @click="openAddDialog"
          class="add-btn"
        />
      </div>
      <q-input
        outlined
        dense
        v-model="search"
        placeholder="Buscar..."
        class="search-input"
        debounce="300"
        @input="performSearch"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-table
      :rows="receivables"
      :columns="columns"
      row-key="id"
      flat
      separator="horizontal"
      class="financeiro-table"
      :pagination="pagination"
    />

    <!-- Diálogo para adicionar nova conta a receber -->
    <q-dialog v-model="isAddDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nova Conta a Receber</div>
        </q-card-section>

        <q-card-section>
          <!-- Formulário de cadastro -->
          <q-input v-model="newReceivable.cliente" label="Cliente" outlined />
          <q-input
            v-model="newReceivable.valorOriginal"
            label="Valor Original"
            type="number"
            outlined
          />
          <q-input
            v-model="newReceivable.valorPago"
            label="Valor Pago"
            type="number"
            outlined
          />
          <q-input
            v-model="newReceivable.emissao"
            label="Emissão"
            type="date"
            outlined
          />
          <q-input
            v-model="newReceivable.pagamento"
            label="Pagamento"
            type="date"
            outlined
          />
          <q-input
            v-model="newReceivable.vencimento"
            label="Vencimento"
            type="date"
            outlined
          />
          <q-input
            v-model="newReceivable.tipoPagamento"
            label="Tipo de Pagamento"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Adicionar"
            color="primary"
            @click="addReceivable"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const goToPagar = () => {
  router.push({ name: "FinanceiroPagar" });
};

const search = ref("");
const pagination = ref({ page: 1, rowsPerPage: 10 });
const receivables = ref([]); // Dados de contas a receber
const isAddDialogOpen = ref(false); // Controle de exibição do diálogo de cadastro
const newReceivable = ref({
  cliente: "",
  valorOriginal: 0,
  vencimento: "",
  tipoPagamento: "",
});

// Definindo as colunas da tabela
const columns = [
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: (row) => row.cliente,
  },
  {
    name: "emissao",
    label: "Emissão",
    align: "center",
    field: (row) => row.emissao,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: "pagamento",
    label: "Pagamento",
    align: "center",
    field: (row) => row.pagamento,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: "vencimento",
    label: "Vencimento",
    align: "center",
    field: (row) => row.vencimento,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: "valorOriginal",
    label: "Valor Original",
    align: "right",
    field: (row) => row.valorOriginal,
  },
  {
    name: "valorPago",
    label: "Valor Pago",
    align: "right",
    field: (row) => row.valorPago,
  },
  {
    name: "tipoPagamento",
    label: "Tipo Pagamento",
    align: "left",
    field: (row) => row.tipoPagamento,
  },
];

// Função para abrir o diálogo de adicionar
const openAddDialog = () => {
  isAddDialogOpen.value = true;
};
const fetchNextId = async () => {
  try {
    const response = await axios.get("http://localhost:3000/receivables");
    const receivables = response.data;
    // Calcula o próximo ID sequencial
    return receivables.length > 0
      ? Math.max(...receivables.map((item) => item.id)) + 1
      : 1;
  } catch (error) {
    console.error("Erro ao buscar ID:", error);
    return 1; // Retorna 1 se houver erro
  }
};
// Função para adicionar uma nova conta a receber
const addReceivable = async () => {
  try {
    const id = await fetchNextId();
    const receivableData = {
      id,
      cliente: newReceivable.value.cliente,
      emissao: newReceivable.value.emissao,
      pagamento: newReceivable.value.pagamento,
      vencimento: newReceivable.value.vencimento,
      valorOriginal: newReceivable.value.valorOriginal,
      valorPago: newReceivable.value.valorPago,
      tipoPagamento: newReceivable.value.tipoPagamento,
    };

    // Envia os dados para o JSON Server
    await axios.post("http://localhost:3000/receivables", receivableData);
    console.log("Conta a receber adicionada com sucesso!");

    // Limpa o formulário
    Object.keys(newReceivable.value).forEach(
      (key) => (newReceivable.value[key] = "")
    );
  } catch (error) {
    console.error("Erro ao adicionar conta a receber:", error);
  }
};

// Função para buscar os dados de contas a receber do servidor
const fetchReceivables = async () => {
  try {
    const response = await axios.get("http://localhost:3000/receivables");
    receivables.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de contas a receber:", error);
  }
};

// Função de busca
const performSearch = () => {
  receivables.value = receivables.value.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(search.value.toLowerCase())
    )
  );
};

// Carregar os dados ao montar o componente
onMounted(fetchReceivables);
</script>

<style scoped>
.financeiro-page {
  padding: 20px;
  background-color: #201f1c;
  color: #ffffff;
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.icon-title {
  display: flex;
  align-items: center;
}

.title {
  font-size: 1.5rem;
  margin-left: 10px;
  color: #ffffff;
}

.search-input {
  width: 250px;
}

.financeiro-table {
  background-color: #201f1c;
  color: #ffffff;
}

.financeiro-table th,
.financeiro-table td {
  color: #ffffff;
}

.add-btn {
  margin-left: 15px;
}
</style>
