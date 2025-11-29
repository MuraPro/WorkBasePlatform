import axios from 'axios';
import { VITE_API_ENDPOINT } from '../../config/config';

export const httpAuth = axios.create({
  baseURL: VITE_API_ENDPOINT + '/auth/',
});
