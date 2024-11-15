<template>
  <q-page padding>
    <q-toolbar>
      <q-toolbar-title>Agenda</q-toolbar-title>
      <q-btn flat icon="add" @click="showAddEventDialog = true" />
    </q-toolbar>

    <vue-cal
      class="custom-calendar"
      :events="formattedEvents"
      :time="false"
      @cell-click="showEvents"
    />

    <q-dialog v-model="showAddEventDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Adicionar Evento</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newEvent.title" label="Título" />
          <q-input v-model="newEvent.date" label="Data" type="date" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Adicionar" @click="addEvent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useAgendaStore } from "src/stores/agenda";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

export default {
  components: {
    VueCal,
  },
  setup() {
    const store = useAgendaStore();
    const showAddEventDialog = ref(false);
    const newEvent = ref({ title: "", date: "" });

    onMounted(() => {
      store.fetchEvents();
    });

    const addEvent = () => {
      store.addEvent(newEvent.value);
      newEvent.value = { title: "", date: "" };
      showAddEventDialog.value = false;
    };

    const showEvents = (event) => {
      const dayEvents = store.events.filter((e) => e.date === event.date);
      if (dayEvents.length) {
        alert(dayEvents.map((e) => e.title).join("\n"));
      } else {
        alert("Nenhum evento");
      }
    };

    const formattedEvents = computed(() => {
      return store.events.map((event) => ({
        start: event.date,
        end: event.date,
        title: event.title,
      }));
    });

    return {
      events: store.events,
      showAddEventDialog,
      newEvent,
      addEvent,
      formattedEvents,
      showEvents,
    };
  },
};
</script>

<style scoped>
.custom-calendar {
  --cal-bg: #f9f9f9;
  --cal-border-color: #e0e0e0;
  --cal-header-bg: #3f51b5;
  --cal-header-text-color: #ffffff;
  --cal-day-text-color: #333333;
  --cal-event-bg: #3f51b5;
  --cal-event-text-color: #ffffff;
}

.q-toolbar {
  background-color: #3f51b5;
  color: white;
}

.q-btn {
  color: white;
}

.q-card {
  max-width: 400px;
  margin: auto;
}

.q-card-section {
  padding: 16px;
}

.q-card-actions {
  padding: 8px;
}

.q-input {
  margin-bottom: 16px;
}
</style>
