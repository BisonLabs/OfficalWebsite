// store.js
import { createStore } from 'redux';
import walletReducer from './walletReducer';

const store = createStore(walletReducer);

export default store;
