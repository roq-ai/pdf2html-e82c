import axios from 'axios';
import queryString from 'query-string';
import { WebPageInterface, WebPageGetQueryInterface } from 'interfaces/web-page';
import { GetQueryInterface } from '../../interfaces';

export const getWebPages = async (query?: WebPageGetQueryInterface) => {
  const response = await axios.get(`/api/web-pages${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWebPage = async (webPage: WebPageInterface) => {
  const response = await axios.post('/api/web-pages', webPage);
  return response.data;
};

export const updateWebPageById = async (id: string, webPage: WebPageInterface) => {
  const response = await axios.put(`/api/web-pages/${id}`, webPage);
  return response.data;
};

export const getWebPageById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/web-pages/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWebPageById = async (id: string) => {
  const response = await axios.delete(`/api/web-pages/${id}`);
  return response.data;
};
