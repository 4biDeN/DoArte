<template>
  <q-page class="financeiro-page">
    <div class="header">
      <div class="icon-title">
        <q-btn
          flat
          round
          icon="monetization_on"
          color="primary"
          @click="goToReceber"
        />
        <span class="title">A PAGAR</span>
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
      :rows="payables"
      :columns="columns"
      row-key="id"
      flat
      separator="horizontal"
      class="financeiro-table"
      :pagination="pagination"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const goToReceber = () => {
  router.push({ name: "FinanceiroReceber" });
};

const search = ref("");
const pagination = ref({ page: 1, rowsPerPage: 10 });
const payables = ref([]); // Dados de contas a pagar

// Definindo as colunas da tabela
const columns = [
  {
    name: "fornecedor",
    label: "Fornecedor",
    align: "left",
    field: (row) => row.fornecedor,
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

// Função para buscar os dados de contas a pagar do servidor
const fetchPayables = async () => {
  try {
    const response = await axios.get("http://localhost:3000/payables");
    payables.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar dados de contas a pagar:", error);
  }
};

// Função de busca
const performSearch = () => {
  // Filtrar os resultados com base na variável 'search'
  payables.value = payables.value.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(search.value.toLowerCase())
    )
  );
};

// Carregar os dados ao montar o componente
onMounted(fetchPayables);
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
</style>
