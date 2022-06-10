import { combineReducers } from '@reduxjs/toolkit';
import walletSlice from './slices/walletSlice';
import layoutSlice from './slices/layoutSlice';

export const whitelist = [];

export const rootReducer = combineReducers({
  walletSlice,
  layoutSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export type PayloadName = 'payload';
