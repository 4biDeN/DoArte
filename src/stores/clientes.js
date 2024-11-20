import { defineStore } from 'pinia';
import ClienteService from '../services/clienteService'; // Ajuste o caminho conforme necessário

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    listaClientes: [],
  }),
  actions: {
    async getClientes() {
      try {
        this.listaClientes = await ClienteService.getClientes();
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    },
    async addCliente(cliente) {
      try {
        const newCliente = await ClienteService.addCliente(cliente);
        this.listaClientes.push(newCliente);
      } catch (error) {
        console.error("Erro ao adicionar cliente:", error);
      }
    },
    async updateCliente(cliente) {
      try {
        const updatedCliente = await ClienteService.updateCliente(cliente);
        const index = this.listaClientes.findIndex(c => c.id === cliente.id);
        if (index !== -1) {
          this.listaClientes[index] = updatedCliente;
        }
      } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
      }
    },
    async deleteCliente(clienteId) {
      try {
        await ClienteService.deleteCliente(clienteId);
        this.listaClientes = this.listaClientes.filter(c => c.id !== clienteId);
      } catch (error) {
        console.error("Erro ao deletar cliente:", error);
      }
    },
  },
});
