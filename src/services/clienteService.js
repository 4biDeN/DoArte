import { api } from "../boot/axios"; // Certifique-se de que o `api` está configurado corretamente

class ClienteService {
  static async getClientes() {
    try {
      const response = await api.get("/clientes");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  }

  static async addCliente(cliente) {
    try {
      const response = await api.post("/clientes", cliente);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      throw error;
    }
  }

  static async updateCliente(cliente) {
    if (!cliente || !cliente.id) {
      throw new Error("Cliente inválido ou ID ausente");
    }

    try {
      const response = await api.put(`/clientes/${cliente.id}`, cliente);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  }

  static async deleteCliente(clienteId) {
    try {
      await api.delete(`/clientes/${clienteId}`);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  }
}

export default ClienteService;
