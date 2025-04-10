const hre = require("hardhat");
const addresses = require('../deployed-address.json');
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Load địa chỉ từ JSON
  // const filePath = path.join(__dirname, "..", "deployed-addresses.json");
  // const addresses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const tokenAAddress = addresses.MyTokenA;
  const tokenBAddress = addresses.MyTokenB;

  console.log("Using existing TokenA:", tokenAAddress);
  console.log("Using existing TokenB:", tokenBAddress);

  // Deploy DEX với 2 địa chỉ token có sẵn
  const DEX = await hre.ethers.getContractFactory("SimpleDEX");
  const dex = await DEX.deploy(tokenAAddress, tokenBAddress);
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("DEX deployed to:", dexAddress);

  // Kết nối đến token đã deploy
  const TokenA = await hre.ethers.getContractAt("MyTokenA", tokenAAddress);
  const TokenB = await hre.ethers.getContractAt("MyTokenB", tokenBAddress);

  const balanceA = await TokenA.balanceOf(deployer.address);
  const balanceB = await TokenB.balanceOf(deployer.address);
  console.log("Balance TokenA:", hre.ethers.formatEther(balanceA));
  console.log("Balance TokenB:", hre.ethers.formatEther(balanceB));

  // Approve cho DEX sử dụng token
  console.log("Approve cho DEX sử dụng token");
  await TokenA.approve(dexAddress, hre.ethers.parseEther("1000"));
  await TokenB.approve(dexAddress, hre.ethers.parseEther("1000"));

  // Cung cấp thanh khoản
  console.log("Cung cấp thanh khoản");
  await dex.addLiquidity(
    hre.ethers.parseEther("1000"),
    hre.ethers.parseEther("1000")
  );

  console.log("✅ Liquidity added thành công");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
