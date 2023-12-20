// walletReducer.js
const initialState = {
  connected: false,
  address: '',
  publicKey: '',
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECT_WALLET':
      return {
        ...state,
        connected: true,
        address: action.payload.address,
        publicKey: action.payload.publicKey,
      };
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        connected: false,
        address: '',
        publicKey: '',
      };
    case 'UPDATE_WALLET_INFO':
      return {
        ...state,
        address: action.payload.address,
        publicKey: action.payload.publicKey,
      };
    default:
      return state;
  }
};

export default walletReducer;
