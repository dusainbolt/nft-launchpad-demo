import { combineReducers } from '@reduxjs/toolkit';
import walletSlice from './slices/walletSlice';

export const whitelist = [];

export const rootReducer = combineReducers({
  walletSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export type PayloadName = 'payload';
