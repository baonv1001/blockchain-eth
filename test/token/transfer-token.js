const { ethers } = require("ethers");
const addresses = require('../../deployed-address.json');
const accountAddresses = require('../../wallet-address.json');
const fs = require("fs");
require("dotenv").config();

// === CONFIG ===
const RPC_URL = "http://127.0.0.1:8545"; // // RPC node bạn kết nối
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 🟢 Private key người gửi (Node 1)
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// 🟢 Địa chỉ người nhận
const receiver = accountAddresses.ACCOUNT_1_NODE_2;

// 🟢 Địa chỉ token contract
const tokenAddress = addresses.MyTokenA; // "0xf3aE19F2c51E6F8609d1aC40A1f3ABb7ECe41f83";

// 🟢 Load ABI
const tokenAbi = JSON.parse(fs.readFileSync("./artifacts/contracts/MyTokenA.sol/MyTokenA.json", "utf8")).abi;
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

async function main() {
  const amount = ethers.parseUnits("10", 18); // chuyển 10 Token
  // 18 là số chữ số thập phân mà token của bạn định nghĩa (chuẩn ERC20 mặc định là 18).
  // ethers.parseUnits("10", 18) sẽ trả về 10000000000000000000 (tức là 10 * 10¹⁸).

  const tx = await tokenContract.transfer(receiver, amount);
  console.log("Tx sent! Hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("Tx confirmed in block:", receipt.blockNumber);
}

main().catch(console.error);
