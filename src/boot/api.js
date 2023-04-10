import axios from 'axios';

console.log('boot api ...');
let api = null;
if (process.env.DEV) {
  api = axios.create({ baseURL: 'http://localhost:7070' });
} else {
  api = axios.create({ baseURL: 'http://localhost:7070' });
  // api = axios.create({ baseURL: 'https://cards.xenadu-services.de' });
}

api.interceptors.response.use(
  (res) => {
    // success
    return res;
  },
  (err) => {
    if (err.response.status === 401) {
      location.reload();
    }
    return err;
  }
);

export { api };
