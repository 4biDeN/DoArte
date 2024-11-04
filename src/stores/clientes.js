import { defineStore } from 'pinia';
import Clientes from 'src/services/doarte'

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    listaClientes: []
  }),
  actions:{
    async getClientes() {
      this.listaClientes = await Clientes.getClientes()
    }
  },
});
