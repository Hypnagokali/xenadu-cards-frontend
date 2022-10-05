import { boot } from "quasar/wrappers";
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:7070' });

export { axios, api }
