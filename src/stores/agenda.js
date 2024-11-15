// src/stores/agendaStore.js
import { defineStore } from "pinia";
import axios from "axios";

export const useAgendaStore = defineStore("agenda", {
  state: () => ({
    events: [],
  }),
  actions: {
    async fetchEvents() {
      try {
        // Supondo que o json-server esteja rodando na porta 3000
        const response = await axios.get("http://localhost:3000/events");
        this.events = response.data;
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    },
    async addEvent(event) {
      try {
        const response = await axios.post(
          "http://localhost:3000/events",
          event
        );
        this.events.push(response.data);
      } catch (error) {
        console.error("Erro ao adicionar evento:", error);
      }
    },
  },
});
