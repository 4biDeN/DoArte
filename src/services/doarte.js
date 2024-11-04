import { api } from '../boot/axios';

export default class Clientes {
    static async getClientes(data) {
        return new Promise((res, rej) => {
            api.get('/clientes', data)
                .then(response => res(response))
                .catch(err => rej(err.response));
        });
    }
}