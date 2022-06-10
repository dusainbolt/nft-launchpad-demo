import storage from 'redux-persist/lib/storage';

export const getPersistConfig = (key = '', nested = {}): any => {
  return {
    key,
    storage,
    ...nested,
  };
};
