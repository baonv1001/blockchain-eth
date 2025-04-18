const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/SimpleDEX.sol/SimpleDEX.json")).abi;
const addresses = require('../../deployed-address.json');

// === CONFIG ===
const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 🧠 Thay bằng địa chỉ contract AMM sau khi deploy
const ammAddress = addresses.DexAddress;

const amm = new ethers.Contract(ammAddress, abi, provider);

async function main() {
  const [reserveA, reserveB] = await amm.getReserves();

  const formattedA = ethers.formatUnits(reserveA, 18);
  const formattedB = ethers.formatUnits(reserveB, 18);

  console.log("=== Pool Reserves ===");
  console.log("Token A:", formattedA);
  console.log("Token B:", formattedB);

  const ratio = Number(formattedB) / Number(formattedA);
  console.log(`Tỷ lệ chia: 1 Token A = ${ratio} Token B`);
}

main().catch(console.error);
