import { boot } from 'quasar/wrappers';
import axios from 'axios';

let api = null;

if (process.env.DEV) {
  api = axios.create({ baseURL: 'http://localhost:7070' });
} else {
  // api = axios.create({ baseURL: 'http://localhost:7070' });
  api = axios.create({ baseURL: 'https://cards.xenadu-services.de' });
}

export { axios, api };
