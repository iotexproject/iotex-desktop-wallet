export const routes = {
  dev: {
    transfer: "/dev/wallet/transfer",
    smartContract: "/dev/wallet/smart-contract"
  },
  prod: {
    transfer: "/wallet/transfer",
    smartContract: "/wallet/smart-contract"
  }
};

export default routes.dev;
