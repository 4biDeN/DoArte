import { api } from "../boot/axios";

class ContaService {
  static async fetchContas() {
    try {
      const response = await api.get("/financeiro");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
      throw error;
    }
  }

  static async addConta(conta) {
    try {
      const response = await api.post("/financeiro", conta);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar conta:", error);
      throw error;
    }
  }
}

export default ContaService;
