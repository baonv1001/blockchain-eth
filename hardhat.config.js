require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    mychain: {
      url: "http://127.0.0.1:8545",      // cổng RPC của Geth
      chainId: 2025,                     // đúng với chainId trong genesis.json
      accounts: [
        process.env.PRIVATE_KEY, // bạn lấy bằng cách dùng geth console: personal.exportRawKey(account, password)
      ],
    },
  },
};
