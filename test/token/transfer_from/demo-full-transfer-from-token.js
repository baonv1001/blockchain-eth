const addresses = require('../../../deployed-address.json');
const { ethers } = require("ethers");
const fs = require("fs");
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/MyTokenA.sol/MyTokenA.json")).abi;
require("dotenv").config();

// === CONFIG ===
const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 🧾 Owner (có token)
const ownerPrivateKey = process.env.PRIVATE_KEY; // ví dụ: Node 1
const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);

// 🧾 Spender (được approve để xài token)
const spenderPrivateKey = process.env.SPENDER_PRIVATE_KEY; // ví dụ: Node 2
const spenderWallet = new ethers.Wallet(spenderPrivateKey, provider);

// 🧾 Token contract
const tokenAddress = addresses.MyTokenA; // MyTokenA
const token = new ethers.Contract(tokenAddress, abi, ownerWallet);

// Địa chỉ người nhận (có thể là 1 ví khác, không phải spender)
const recipientAddress = "0x90421361aAeb310843A30d6e6b841a69335CDA4C";

async function main() {
  const ownerAddress = await ownerWallet.getAddress();
  const spenderAddress = await spenderWallet.getAddress();

  const amount = ethers.parseUnits("10", 18);

  // Bước 1: Owner approve Spender
  const approveTx = await token.approve(spenderAddress, amount);
  await approveTx.wait();
  console.log("✅ Approve done!");

  // Bước 2: Spender kiểm tra allowance
  const tokenAsSpender = token.connect(spenderWallet);
  const allowance = await tokenAsSpender.allowance(ownerAddress, spenderAddress);
  console.log("🔍 Allowance:", ethers.formatUnits(allowance, 18));

  // Bước 3: Spender gọi transferFrom để lấy token từ owner
  console.log("⏳ Spender is calling transferFrom to recipient...");
  const transferTx = await tokenAsSpender.transferFrom(
    ownerAddress,
    recipientAddress,
    amount
  );
  await transferTx.wait();
  console.log(`✅ transferFrom completed to recipient ${recipientAddress}, hash tx: `, transferTx.hash);

  // Bước 4: Kiểm tra balance
  const balance = await token.balanceOf(recipientAddress);
  console.log("📦 New balance (spender):", ethers.formatUnits(balance, 18));
}

main().catch(console.error);
