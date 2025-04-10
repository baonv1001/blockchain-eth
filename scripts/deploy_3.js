const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
