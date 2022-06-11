import axios from './axios';

export const createNftAPI = async (body) => {
  return await axios.post('/nft', body);
};

export const searchNftAPI = async (params) => {
  return await axios.get('/nft', params);
};
