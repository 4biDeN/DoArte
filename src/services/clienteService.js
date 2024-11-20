import axios from "axios";

const API_URL = "http://localhost:3000/clientes";

export default {
  async getClientes() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getClienteById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async addCliente(cliente) {
    const response = await axios.post(API_URL, cliente);
    return response.data;
  },

  async updateCliente(cliente) {
    const response = await axios.put(`${API_URL}/${cliente.id}`, cliente);
    return response.data;
  },

  async deleteCliente(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};
