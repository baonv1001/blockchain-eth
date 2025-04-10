const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Lấy factory từ hre.ethers
  // Deploy MyTokenA
  const TokenA = await hre.ethers.getContractFactory("MyTokenA");
  const tokenA = await TokenA.deploy();
  await tokenA.waitForDeployment(); // ⚠️ Dùng waitForDeployment thay vì deployed nếu bạn dùng ethers v6
  const tokenAAddress = await tokenA.getAddress();
  console.log("MyTokenA deployed to:", tokenAAddress);

  // Deploy MyTokenB
  const TokenB = await hre.ethers.getContractFactory("MyTokenB");
  const tokenB = await TokenB.deploy();
  await tokenB.waitForDeployment(); // ⚠️ Vẫn là waitForDeployment
  const tokenBAddress = await tokenB.getAddress();
  console.log("MyTokenB deployed to:", tokenBAddress);

  // Lưu địa chỉ vào deployed-addresses.json
  const deployedAddresses = {
    MyTokenA: tokenAAddress,
    MyTokenB: tokenBAddress,
  };

  const filePath = path.join(__dirname, "..", "deployed-addresses.json");
  fs.writeFileSync(filePath, JSON.stringify(deployedAddresses, null, 2));
  console.log(`✅ Địa chỉ contract đã được lưu vào ${filePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
