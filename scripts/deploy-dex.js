const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const addresses = require("../deployed-address.json");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = deployer.address;
  console.log("👤 Deployer:", deployerAddress);

  // Load địa chỉ TokenA & TokenB
  const tokenAAddress = addresses.MyTokenA;
  const tokenBAddress = addresses.MyTokenB;

  console.log("🎯 Using existing TokenA:", tokenAAddress);
  console.log("🎯 Using existing TokenB:", tokenBAddress);

  // Deploy DEX
  const DEX = await hre.ethers.getContractFactory("SimpleDEX");
  const dex = await DEX.deploy(tokenAAddress, tokenBAddress);
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("🏗️  DEX deployed to:", dexAddress);

  // Kết nối tới contract token
  const tokenA = await hre.ethers.getContractAt("MyTokenA", tokenAAddress);
  const tokenB = await hre.ethers.getContractAt("MyTokenB", tokenBAddress);

  // In ra balance
  const balanceA = await tokenA.balanceOf(deployerAddress);
  const balanceB = await tokenB.balanceOf(deployerAddress);
  console.log("💰 TokenA balance:", hre.ethers.formatEther(balanceA));
  console.log("💰 TokenB balance:", hre.ethers.formatEther(balanceB));

  const requiredAmount = hre.ethers.parseEther("1000");

  if (balanceA < requiredAmount || balanceB < requiredAmount) {
    throw new Error("❌ Không đủ token để cung cấp thanh khoản.");
  }

  try {
    // Approve cho DEX
    console.log("🔓 Approving tokens...");
    await (await tokenA.connect(deployer).approve(dexAddress, requiredAmount)).wait();
    await (await tokenB.connect(deployer).approve(dexAddress, requiredAmount)).wait();
    console.log("✅ Token approval done.");

    // Check lại allowance
    const allowanceA = await tokenA.allowance(deployerAddress, dexAddress);
    const allowanceB = await tokenB.allowance(deployerAddress, dexAddress);
    console.log("✅ Allowance TokenA:", hre.ethers.formatEther(allowanceA));
    console.log("✅ Allowance TokenB:", hre.ethers.formatEther(allowanceB));

    const testBalanceA = await tokenA.balanceOf(dexAddress);
    console.log("🧪 TokenA balance of DEX before add:", testBalanceA.toString());
    console.log("🧪 TokenA allowance from deployer to DEX:", allowanceA.toString());

    // Add liquidity
    console.log("💦 Adding liquidity...");
    // await dex.connect(deployer).addLiquidity(requiredAmount, requiredAmount);
    await (await dex.connect(deployer).addLiquidity(requiredAmount, requiredAmount)).wait();
    console.log("✅ Liquidity added thành công!");

    // Check balance của DEX
    const dexTokenABalance = await tokenA.balanceOf(dexAddress);
    const dexTokenBBalance = await tokenB.balanceOf(dexAddress);
    console.log("🏦 DEX TokenA balance:", hre.ethers.formatEther(dexTokenABalance));
    console.log("🏦 DEX TokenB balance:", hre.ethers.formatEther(dexTokenBBalance));
  } catch (err) {
    console.error("❌ Lỗi khi approve hoặc addLiquidity:");
    console.error(err);
  }
}

main().catch((error) => {
  console.error("❌ Lỗi ở main:");
  console.error(error);
  process.exitCode = 1;
});
