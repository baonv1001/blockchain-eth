// read-token-info.js

const { ethers, formatEther } = require("ethers");
const addresses = require('../../deployed-address.json');
const fs = require("fs");
require("dotenv").config();

// 1. Kết nối tới node của bạn (qua JSON-RPC URL)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// 2. Token address sau khi deploy
const tokenAddress = addresses.MyTokenA; // "0xf3aE19F2c51E6F8609d1aC40A1f3ABb7ECe41f83"; // <-- Thay bằng địa chỉ thật của bạn

// 3. Load ABI
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/MyTokenA.sol/MyTokenA.json")).abi;

// 4. Tạo đối tượng contract
const token = new ethers.Contract(tokenAddress, abi, provider);

// 5. Gọi các hàm
async function main() {
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();

  console.log("Token name:", name);
  console.log("Symbol:", symbol);
  console.log("Total Supply:", formatEther(totalSupply));
}

main();
