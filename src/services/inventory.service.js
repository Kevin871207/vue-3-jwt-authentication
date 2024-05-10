import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/inventory/';

class InventoryService {
  getAllInventoryStatus() {
    return axios.get(API_URL + 'status', { headers: authHeader() });
  }
}

export default new InventoryService();
