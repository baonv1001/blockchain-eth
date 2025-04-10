const { ethers } = require("ethers");
const addresses = require('../../../deployed-address.json');
const fs = require("fs");
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/MyTokenA.sol/MyTokenA.json")).abi;
require("dotenv").config();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Địa chỉ token và spender (người được cấp quyền)
const tokenAddress = addresses.MyTokenA; // "0xf3aE19F2c51E6F8609d1aC40A1f3ABb7ECe41f83"; // Token A
const owner = "0x04fbeC3Ac166Fea2ce157f74962eFe4C8aFf7891"; // người approve
const spender = "0x444595d3AA12F83Fed8BF7aE7Bc01D2684aD463C"; // ví dụ: node 2

const token = new ethers.Contract(tokenAddress, abi, wallet);

async function main() {
  const amount = ethers.parseUnits("10", 18); // Cho phép spender dùng 50 token
  // cho phép spender thực hiện chuyển tối đa 50 token A của account có dịa chỉ 0x04fbeC3Ac166Fea2ce157f74962eFe4C8aFf7891 (node 1)

  // approve(spender, amount): Cho phép địa chỉ spender được quyền sử dụng tối đa amount token của bạn.
  const tx = await token.approve(spender, amount);
  console.log("Approve Tx hash:", tx.hash);
  await tx.wait();
  console.log("Approve thành công.");

  // allowance trong ERC20 là số lượng token mà một địa chỉ (spender) được phép chi tiêu thay mặt cho người sở hữu (owner).
  const allowance = await token.allowance(owner, spender);
  console.log("Allowance hiện tại là:", ethers.formatUnits(allowance, 18));
}

main().catch(console.error);
