<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container">
      <div class="card" v-for="card in cards" :key="card.title">
        <div class="card-header">{{ card.title }}</div>
        <div class="card-content">
          <!-- Conteúdo específico de cada card -->
          <ul v-if="card.title === 'AGENDA DO DIA'">
            <li v-for="event in eventsToday" :key="event.id">
              {{ event.cliente }} - {{ event.servico }} -
              {{ formatTime(event["data-hora-inicio"]) }}
            </li>
          </ul>
          <ul v-else-if="card.title === 'ANIVERSARIANTES DO DIA'">
            <li v-for="cliente in aniversariantesHoje" :key="cliente.id">
              {{ cliente.nome }} - {{ cliente.dataNascimento }}
            </li>
          </ul>
          <div v-else-if="card.title === 'FINANCEIRO'"></div>
          <ul v-else-if="card.title === 'TOP SERVIÇOS'">
            <li>Serviço 1</li>
            <li>Serviço 2</li>
          </ul>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useEventStore } from "../stores/eventos.js";
import { useClientesStore } from "../stores/clientes.js"; // Importa o store de clientes

export default {
  setup() {
    const eventStore = useEventStore();
    const clientesStore = useClientesStore(); // Instancia o store de clientes

    onMounted(() => {
      eventStore.fetchEvents();
      clientesStore.getClientes(); // Carrega os clientes
      clientesStore.getAniversariantesHoje(); // Carrega os aniversariantes do dia
    });

    const currentDateISO = ref(new Date().toISOString().split("T")[0]);

    const eventsToday = computed(() => {
      return eventStore.events.filter(
        (event) =>
          event["data-hora-inicio"].split("T")[0] === currentDateISO.value
      );
    });

    const aniversariantesHoje = computed(() => {
      return clientesStore.aniversariantesHoje;
    });

    const formatTime = (dateTime) => {
      return dateTime.split("T")[1].substring(0, 5);
    };

    return {
      eventsToday,
      formatTime,
      aniversariantesHoje,
      cards: [
        { title: "AGENDA DO DIA" },
        { title: "ANIVERSARIANTES DO DIA" },
        { title: "FINANCEIRO" },
        { title: "TOP SERVIÇOS" },
      ],
    };
  },
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  height: 100vh;
}

.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
}

.card {
  background-color: #3d3d3d;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  color: white;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.card-content {
  margin-top: 10px;
}
</style>
