const hre = require("hardhat");
const addresses = require('../deployed-address.json');

async function main() {
  const [user] = await hre.ethers.getSigners();
  const tokenAAddress = addresses.MyTokenA;
  const tokenBAddress = addresses.MyTokenB;

  // 👇 NHỚ: thay bằng địa chỉ DEX của bạn
  const dexAddress = addresses.DexAddress;

  console.log("👤 User:", user.address);

  // Kết nối contract
  const tokenA = await hre.ethers.getContractAt("MyTokenA", tokenAAddress);
  const tokenB = await hre.ethers.getContractAt("MyTokenB", tokenBAddress);
  const dex = await hre.ethers.getContractAt("SimpleDEX", dexAddress);

  const swapAmount = hre.ethers.parseEther("100"); // swap 100 tokenA

  // 1. Approve DEX được swap tokenA
  console.log("🔓 Approving tokenA...");
  await (await tokenA.connect(user).approve(dexAddress, swapAmount)).wait();
  console.log("✅ Approved.");

  // 2. Check balances trước swap
  const balA_before = await tokenA.balanceOf(user.address);
  const balB_before = await tokenB.balanceOf(user.address);
  console.log("💰 TokenA before:", hre.ethers.formatEther(balA_before));
  console.log("💰 TokenB before:", hre.ethers.formatEther(balB_before));

  // 3. Gọi swapAForB
  console.log(`🔁 Swapping ${hre.ethers.formatEther(swapAmount)} TokenA → TokenB...`);
  await (await dex.connect(user).swapAForB(swapAmount)).wait();
  console.log("✅ Swap done!");

  // 4. Check balances sau swap
  const balA_after = await tokenA.balanceOf(user.address);
  const balB_after = await tokenB.balanceOf(user.address);
  console.log("💰 TokenA after:", hre.ethers.formatEther(balA_after));
  console.log("💰 TokenB after:", hre.ethers.formatEther(balB_after));
}
  
main().catch((error) => {
  console.error("❌ Swap thất bại:", error);
  process.exitCode = 1;
});
