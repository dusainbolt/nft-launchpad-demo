import axios from './axios';

export const createNftAPI = async (body) => {
  return await axios.post('/nft', body);
};

export const searchNftAPI = async (query) => {
  return await axios.get('/nft', query);
};

export const abiBuyNftAPI = async (id, query) => {
  return await axios.get(`/nft/buy-abi/${id}`, query);
};

export const abiStakeNftAPI = async (id) => {
  return await axios.get(`/nft/stake-abi/${id}`);
};
