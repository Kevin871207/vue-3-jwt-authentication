import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/book/';

class BookService {
  getAllBookStatus() {
    return axios.get(API_URL + 'status', { headers: authHeader() });
  }

  borrowBook(isbn, userId) {
    return axios.patch(API_URL + 'borrow/' + isbn + '/user/' + userId, { headers: authHeader() });
  }

  returnBook(isbn, userId) {
    return axios.patch(API_URL + 'return/' + isbn + '/user/' + userId, { headers: authHeader() });
  }
}

export default new BookService();
