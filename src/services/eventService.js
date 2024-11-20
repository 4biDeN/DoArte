import { api } from "../boot/axios";

class EventService {
  static async fetchEvents() {
    try {
      const response = await api.get("/events");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    }
  }

  static async addEvent(event) {
    try {
      const response = await api.post("/events", event);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      throw error;
    }
  }

  static async updateEvent(updatedEvent) {
    console.log("Evento a ser atualizado:", updatedEvent);

    try {
      const response = await api.put(`/events/${1}`, updatedEvent);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      throw error;
    }
  }
}

export default EventService;
