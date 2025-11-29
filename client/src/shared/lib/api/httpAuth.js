import axios from 'axios';
import { API_ENDPOINT } from '../../config/config';

export const httpAuth = axios.create({
  baseURL: API_ENDPOINT + '/auth/',
});
