import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/borrowingRecord/';

class BorrowingRecordsService {
  getRetunTimeNullborrowingRecordRes(inventoryId, userId) {
    console.log('inventoryId: ', inventoryId);
    console.log('userId: ' , userId);
    return axios.get(API_URL + 'record/' + inventoryId + '/user/' + userId, { headers: authHeader() });
  }
}

export default new BorrowingRecordsService();
