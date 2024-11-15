import { defineStore } from "pinia";
import axios from "axios";

export const useContasStore = defineStore("contas", {
  state: () => ({
    contas: [],
  }),
  actions: {
    async fetchContas() {
      const response = await axios.get("http://localhost:3000/financeiro");
      this.contas = response.data;
    },
    addConta(conta) {
      this.contas.push(conta);
    },
  },
});
