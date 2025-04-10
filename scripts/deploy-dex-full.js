const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const MyTokenA = await hre.ethers.getContractFactory("MyTokenA");
  const tokenA = await MyTokenA.deploy();
  await tokenA.waitForDeployment();
  console.log("MyTokenA deployed at:", await tokenA.getAddress());

  const MyTokenB = await hre.ethers.getContractFactory("MyTokenB");
  const tokenB = await MyTokenB.deploy();
  await tokenB.waitForDeployment();
  console.log("MyTokenB deployed at:", await tokenB.getAddress());

  const DEX = await hre.ethers.getContractFactory("SimpleDEX");
  const dex = await DEX.deploy(await tokenA.getAddress(), await tokenB.getAddress());
  await dex.waitForDeployment();
  console.log("DEX deployed at:", await dex.getAddress());

  // Approve DEX to use tokens
  await tokenA.approve(await dex.getAddress(), hre.ethers.parseEther("1000"));
  await tokenB.approve(await dex.getAddress(), hre.ethers.parseEther("1000"));

  // Add initial liquidity
  await dex.addLiquidity(hre.ethers.parseEther("1000"), hre.ethers.parseEther("1000"));
  console.log("Liquidity added ✔️");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
