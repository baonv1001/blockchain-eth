const addresses = require('../../deployed-address.json');
const { ethers } = require("ethers");
const fs = require("fs");
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/MyTokenA.sol/MyTokenA.json")).abi;
require("dotenv").config();
const hre = require("hardhat");

const RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Địa chỉ người gửi và người nhận
const sender = "0x04fbeC3Ac166Fea2ce157f74962eFe4C8aFf7891"; // Node 1
const receiver = "0x444595d3AA12F83Fed8BF7aE7Bc01D2684aD463C"; // Node 2
const receiver3 = "0x90421361aAeb310843A30d6e6b841a69335CDA4C"; // Node 3

// Địa chỉ smart contract của token
const tokenAddressA = addresses.MyTokenA; // "0xf3aE19F2c51E6F8609d1aC40A1f3ABb7ECe41f83"; // MyTokenA
const tokenAddressB = addresses.MyTokenB;

// Kết nối contract
const tokenContractA = new ethers.Contract(tokenAddressA, abi, provider);
const tokenContractB = new ethers.Contract(tokenAddressB, abi, provider);

async function main() {
  console.log("===========================");
  console.log("MyTokenA");
  const balanceSenderA = await tokenContractA.balanceOf(sender); // balance (wei)
  const balanceReceiverA = await tokenContractA.balanceOf(receiver); // balance (wei)
  const balanceReceiver3A = await tokenContractA.balanceOf(receiver3); // balance (wei)

  console.log(`Sender (${sender}) balance MyTokenA:`, ethers.formatUnits(balanceSenderA, 18));
  console.log(`Receiver (${receiver}) balance MyTokenA:`, ethers.formatUnits(balanceReceiverA, 18));
  console.log(`Receiver 3 (${receiver}) balance MyTokenA:`, ethers.formatUnits(balanceReceiver3A, 18));

  console.log("===========================");
  console.log("MyTokenB");
  const balanceSenderB = await tokenContractB.balanceOf(sender); // balance (wei)
  const balanceReceiverB = await tokenContractB.balanceOf(receiver); // balance (wei)
  const balanceReceiver3B = await tokenContractB.balanceOf(receiver3); // balance (wei)
  console.log(`Sender (${sender}) balance MyTokenB:`, ethers.formatUnits(balanceSenderB, 18));
  console.log(`Receiver (${receiver}) balance MyTokenB:`, ethers.formatUnits(balanceReceiverB, 18));
  console.log(`Receiver 3 (${receiver}) balance MyTokenB:`, ethers.formatUnits(balanceReceiver3B, 18));

  console.log("===========================");
  const chain = await hre.ethers.provider.getNetwork();
  console.log("Current network:", hre.network.name);
  console.log("Chain ID:", chain.chainId);
}

main().catch(console.error);
