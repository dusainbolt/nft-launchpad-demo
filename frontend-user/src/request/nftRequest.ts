import axios from './axios';

export const createNftAPI = async (body) => {
  return await axios.post('/nft', body);
};

export const searchNftAPI = async (params) => {
  return await axios.get('/nft', params);
};

export const abiBuyNftAPI = async (id, body) => {
  return await axios.post(`/nft/buy-abi/${id}`, body);
};
