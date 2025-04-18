const addresses = require('../../../deployed-address.json');
const accountAddresses = require('../../../wallet-address.json');
const { ethers } = require("ethers");
const fs = require("fs");
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/MyTokenA.sol/MyTokenA.json")).abi;
require("dotenv").config();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const spenderWallet = new ethers.Wallet(process.env.SPENDER_PRIVATE_KEY, provider);

const tokenAddress = addresses.MyTokenA; // Token A
const token = new ethers.Contract(tokenAddress, abi, spenderWallet);

// Địa chỉ từ người sở hữu (người approve), đến người nhận
// 🧾 Owner (có token)
const owner = accountAddresses.ACCOUNT_1_NODE_1; // người approve
const receiver = accountAddresses.ACCOUNT_1_NODE_3; // người nhận mới

async function main() {
  const amount = ethers.parseUnits("20", 18);

  // transferFrom(from, to, amount): Cho phép một địa chỉ khác chuyển token thay mặt người khác, chỉ khi đã được approve trước đó.
  const tx = await token.transferFrom(owner, receiver, amount);
  console.log("transferFrom Tx:", tx.hash);
  await tx.wait();
  console.log("Chuyển token bằng quyền thành công!");
}

main().catch(console.error);
