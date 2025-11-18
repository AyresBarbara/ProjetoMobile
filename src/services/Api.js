import axios from 'axios';

// Define a URL base para todas as requisições feitas com esta instância
const api = axios.create({
  baseURL: 'https://openlibrary.org/'

});


export default api;