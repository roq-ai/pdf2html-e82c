import axios from 'axios';
import queryString from 'query-string';
import { ScrollSettingInterface, ScrollSettingGetQueryInterface } from 'interfaces/scroll-setting';
import { GetQueryInterface } from '../../interfaces';

export const getScrollSettings = async (query?: ScrollSettingGetQueryInterface) => {
  const response = await axios.get(`/api/scroll-settings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createScrollSetting = async (scrollSetting: ScrollSettingInterface) => {
  const response = await axios.post('/api/scroll-settings', scrollSetting);
  return response.data;
};

export const updateScrollSettingById = async (id: string, scrollSetting: ScrollSettingInterface) => {
  const response = await axios.put(`/api/scroll-settings/${id}`, scrollSetting);
  return response.data;
};

export const getScrollSettingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/scroll-settings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteScrollSettingById = async (id: string) => {
  const response = await axios.delete(`/api/scroll-settings/${id}`);
  return response.data;
};
