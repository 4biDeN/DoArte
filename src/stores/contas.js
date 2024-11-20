import { defineStore } from "pinia";
import ContaService from "../services/contaService";

export const useContasStore = defineStore("contas", {
  state: () => ({
    contas: [],
  }),
  actions: {
    async fetchContas() {
      try {
        this.contas = await ContaService.fetchContas();
      } catch (error) {
        console.error("Erro ao buscar contas:", error);
      }
    },
    async addConta(conta) {
      try {
        const newConta = await ContaService.addConta(conta);
        this.contas.push(newConta);
      } catch (error) {
        console.error("Erro ao adicionar conta:", error);
      }
    },
  },
});
