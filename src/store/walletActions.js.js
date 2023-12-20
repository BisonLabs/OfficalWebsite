// walletActions.js
export const connectWallet = (address, publicKey) => ({
  type: 'CONNECT_WALLET',
  payload: { address, publicKey },
});

export const disconnectWallet = () => ({
  type: 'DISCONNECT_WALLET',
});

export const updateWalletInfo = (address, publicKey) => ({
  type: 'UPDATE_WALLET_INFO',
  payload: { address, publicKey },
});
