<template>
  <q-page padding>
    <q-toolbar>
      <q-toolbar-title>Agenda</q-toolbar-title>
    </q-toolbar>

    <div class="calendar-controls">
      <q-btn flat icon="arrow_back" @click="prevPeriod" />
      <div class="month-title">{{ formattedPeriod }}</div>
      <q-btn flat icon="arrow_forward" @click="nextPeriod" />
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

    <div v-if="viewMode === 'week'" class="week-view-container">
      <div class="hour-labels">
        <div v-for="hour in hours" :key="hour" class="hour-label">
          {{ hour }}
        </div>
      </div>
      <div class="week-grid">
        <div
          v-for="(day, index) in daysInWeek"
          :key="index"
          class="week-day-column"
        >
          <div class="date-header">{{ day.day }}</div>
          <div v-for="hour in hours" :key="hour" class="hour-slot">
            <div class="events-container">
              <q-btn
                v-for="(event, idx) in getEventsForHour(day.date, hour)"
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
    </div>

    <div v-if="viewMode === 'day'" class="day-view-container">
      <div class="hour-labels">
        <div v-for="hour in hours" :key="hour" class="hour-label">
          {{ hour }}
        </div>
      </div>
      <div class="day-column">
        <div v-for="hour in hours" :key="hour" class="hour-slot">
          <div class="events-container">
            <q-btn
              v-for="(event, idx) in getEventsForHour(currentDateISO, hour)"
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

    const hours = Array.from({ length: 16 }, (_, i) => `${7 + i}:00`);

    const currentDateISO = computed(() => {
      return currentDate.value.toISOString().split("T")[0];
    });

    const formattedPeriod = computed(() => {
      if (viewMode.value === "month") {
        return currentDate.value.toLocaleString("pt-BR", {
          month: "long",
          year: "numeric",
        });
      } else if (viewMode.value === "week") {
        const startOfWeek = new Date(currentDate.value);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString(
          "pt-BR"
        )} - ${endOfWeek.toLocaleDateString("pt-BR")}`;
      } else if (viewMode.value === "day") {
        return currentDate.value.toLocaleDateString("pt-BR");
      }
      return "";
    });

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

    const daysInWeek = computed(() => {
      const days = [];
      const startOfWeek = new Date(currentDate.value);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push({
          date: day.toISOString().split("T")[0],
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

    const getEventsForHour = (date, hour) => {
      return eventStore.events.filter((event) => {
        const eventDate = event["data-hora-inicio"].split(" ")[0];
        const eventStartHour = event["data-hora-inicio"]
          .split(" ")[1]
          .substring(0, 5);
        const eventEndHour = event["data-hora-fim"]
          .split(" ")[1]
          .substring(0, 5);

        // Verifica se o evento começa ou termina dentro da faixa de hora
        return (
          eventDate === date &&
          ((eventStartHour >= hour && eventStartHour < addOneHour(hour)) ||
            (eventEndHour > hour && eventEndHour <= addOneHour(hour)))
        );
      });
    };
    const addOneHour = (hour) => {
      const [h, m] = hour.split(":").map(Number);
      const newHour = h + 1;
      return `${newHour < 10 ? "0" + newHour : newHour}:${
        m < 10 ? "0" + m : m
      }`;
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
      console.log("Evento selecionado:", event);
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

    const prevPeriod = () => {
      if (viewMode.value === "month") {
        const date = new Date(currentDate.value);
        date.setMonth(date.getMonth() - 1);
        currentDate.value = date;
      } else if (viewMode.value === "week") {
        const date = new Date(currentDate.value);
        date.setDate(date.getDate() - 7);
        currentDate.value = date;
      } else if (viewMode.value === "day") {
        const date = new Date(currentDate.value);
        date.setDate(date.getDate() - 1);
        currentDate.value = date;
      }
    };

    const nextPeriod = () => {
      if (viewMode.value === "month") {
        const date = new Date(currentDate.value);
        date.setMonth(date.getMonth() + 1);
        currentDate.value = date;
      } else if (viewMode.value === "week") {
        const date = new Date(currentDate.value);
        date.setDate(date.getDate() + 7);
        currentDate.value = date;
      } else if (viewMode.value === "day") {
        const date = new Date(currentDate.value);
        date.setDate(date.getDate() + 1);
        currentDate.value = date;
      }
    };

    const setViewMode = (mode) => {
      viewMode.value = mode;
    };

    return {
      currentDate,
      currentDateISO,
      formattedPeriod,
      daysInMonth,
      daysInWeek,
      hours,
      viewMode,
      getEventsForDay,
      getEventsForHour,
      getEventClass,
      isDialogOpen,
      selectedEvent,
      openEventDialog,
      concluirEvento,
      prevPeriod,
      nextPeriod,
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
  min-height: 150px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.date-header {
  background-color: #2b2a27;
  padding: 5px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #3c3c3a;
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 90%; /* Permitir que os eventos ocupem toda a largura disponível */
}

.event-btn {
  font-size: 0.9rem;
}

.week-view-container {
  display: flex;
}

.hour-slot {
  min-height: 60px;
  border-bottom: 1px dashed #3c3c3a;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  padding: 5px;
}

.hour-labels {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 10px;
}

.hour-label {
  height: 60px;
  line-height: 60px;
  font-weight: bold;
  color: white;
  border-bottom: 1px dashed #3c3c3a; /* Linha pontilhada */
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  flex-grow: 1;
  border-left: 1px dashed #3c3c3a; /* Linha pontilhada à esquerda */
}

.week-day-column {
  display: flex;
  flex-direction: column;
  border-right: 1px dashed #3c3c3a;
  padding: 5px; /* Adicionando padding para espaçamento */
  width: 100%;
}

.day-view-container {
  display: flex;
}

.day-column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-left: 1px dashed #3c3c3a; /* Linha pontilhada à esquerda */
}

.hour-slot {
  height: 60px;
  border-bottom: 1px dashed #3c3c3a; /* Linha pontilhada */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>
