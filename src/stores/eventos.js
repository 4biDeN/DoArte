import { defineStore } from "pinia";
import EventService from "../services/eventService";

export const useEventStore = defineStore("agenda", {
  state: () => ({
    events: [],
  }),
  actions: {
    async fetchEvents() {
      try {
        this.events = await EventService.fetchEvents();
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    },
    async addEvent(event) {
      try {
        const newEvent = await EventService.addEvent(event);
        this.events.push(newEvent);
      } catch (error) {
        console.error("Erro ao adicionar evento:", error);
      }
    },
    async updateEvent(updatedEvent) {
      try {
        const updated = await EventService.updateEvent(updatedEvent);
        const index = this.events.findIndex(
          (event) => event.id === updatedEvent.id
        );
        if (index !== -1) {
          this.events[index] = updated;
        }
      } catch (error) {
        console.error("Erro ao atualizar evento:", error);
      }
    },
  },
});
