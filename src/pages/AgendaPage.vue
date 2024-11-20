<template>
  <q-page padding>
    <q-toolbar>
      <q-toolbar-title>Agenda</q-toolbar-title>
    </q-toolbar>

    <div class="calendar-controls">
      <q-btn flat icon="arrow_back" @click="prevMonth" />
      <div class="month-title">{{ formattedMonth }}</div>
      <q-btn flat icon="arrow_forward" @click="nextMonth" />
    </div>

    <div class="view-switcher">
      <q-btn
        flat
        :label="'Mês'"
        :color="viewMode === 'month' ? 'primary' : 'white'"
        @click="setViewMode('month')"
      />
      <q-btn
        flat
        :label="'Semana'"
        :color="viewMode === 'week' ? 'primary' : 'white'"
        @click="setViewMode('week')"
      />
      <q-btn
        flat
        :label="'Dia'"
        :color="viewMode === 'day' ? 'primary' : 'white'"
        @click="setViewMode('day')"
      />
    </div>

    <div v-if="viewMode === 'month'" class="calendar-container">
      <div class="calendar-grid">
        <div
          v-for="(day, index) in daysInMonth"
          :key="index"
          class="calendar-cell"
        >
          <div class="date-header">{{ day.day }}</div>
          <div class="events-container">
            <q-btn
              v-for="(event, idx) in getEventsForDay(day.date)"
              :key="idx"
              :label="event.servico"
              :class="getEventClass(event)"
              dense
              @click="openEventDialog(event)"
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="isDialogOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Detalhes do Evento</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="concluirEvento">
            <q-input
              v-model="selectedEvent.cliente"
              label="Cliente"
              outlined
              readonly
            />
            <q-input
              v-model="selectedEvent.servico"
              label="Serviço"
              outlined
              readonly
            />
            <q-input
              v-model="selectedEvent['data-hora-inicio']"
              label="Data e Hora de Início"
              outlined
              readonly
            />
            <q-input
              v-model="selectedEvent['data-hora-fim']"
              label="Data e Hora de Fim"
              outlined
              readonly
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Fechar"
            color="primary"
            @click="isDialogOpen = false"
          />
          <q-btn
            flat
            label="Concluir Evento"
            color="positive"
            @click="concluirEvento"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useEventStore } from "../stores/eventos.js";

export default {
  setup() {
    const currentDate = ref(new Date());
    const viewMode = ref("month");
    const eventStore = useEventStore();

    const isDialogOpen = ref(false);
    const selectedEvent = ref({});

    onMounted(() => {
      eventStore.fetchEvents();
    });

    const formattedMonth = computed(() =>
      currentDate.value.toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    );

    const daysInMonth = computed(() => {
      const days = [];
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
        days.push({
          date: new Date(day).toISOString().split("T")[0],
          day: day.getDate(),
        });
      }
      return days;
    });

    const getEventsForDay = (date) => {
      return eventStore.events.filter(
        (event) => event["data-hora-inicio"].split(" ")[0] === date
      );
    };

    const getEventClass = (event) => {
      const now = new Date();
      const eventEnd = new Date(event["data-hora-fim"]);

      if (event.status === "concluído") {
        return "event-completed";
      }

      if (eventEnd.getTime() < now.getTime() - 60 * 60 * 1000) {
        return "event-late";
      }

      if (
        event["data-hora-inicio"].split(" ")[0] ===
        now.toISOString().split("T")[0]
      ) {
        return "event-today";
      }

      return "";
    };

    const openEventDialog = (event) => {
      selectedEvent.value = { ...event };
      isDialogOpen.value = true;
    };

    const concluirEvento = async () => {
      try {
        selectedEvent.value.status = "concluído";
        await eventStore.updateEvent(
          selectedEvent.value.id,
          selectedEvent.value
        );
        isDialogOpen.value = false;
      } catch (error) {
        console.error("Erro ao concluir o evento:", error);
      }
    };

    const prevMonth = () => {
      const date = new Date(currentDate.value);
      date.setMonth(date.getMonth() - 1);
      currentDate.value = date;
    };

    const nextMonth = () => {
      const date = new Date(currentDate.value);
      date.setMonth(date.getMonth() + 1);
      currentDate.value = date;
    };

    const setViewMode = (mode) => {
      viewMode.value = mode;
    };

    return {
      currentDate,
      formattedMonth,
      daysInMonth,
      viewMode,
      getEventsForDay,
      getEventClass,
      isDialogOpen,
      selectedEvent,
      openEventDialog,
      concluirEvento,
      prevMonth,
      nextMonth,
      setViewMode,
    };
  },
};
</script>

<style scoped>
.event-completed {
  background-color: #4caf50 !important; /* Verde para concluídos */
  color: white;
}

.event-late {
  background-color: #f44336 !important; /* Vermelho para atrasados */
  color: white;
}

.event-today {
  background-color: #2196f3 !important; /* Azul para eventos do dia */
  color: white;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.month-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: white;
}

.calendar-container {
  background-color: #201f1c;
  color: white;
  border-radius: 8px;
  padding: 20px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
}

.calendar-cell {
  background-color: #2b2a27;
  border: 1px solid #3c3c3a;
  border-radius: 8px;
  min-height: 120px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.date-header {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 1.2rem;
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.event-btn {
  font-size: 0.9rem;
}
</style>
