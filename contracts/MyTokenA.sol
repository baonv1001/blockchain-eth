// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyTokenA is ERC20 { // smart contract chuẩn ERC20
    constructor() ERC20("MyTokenA", "MTA") { // Gọi constructor của ERC20 gốc, đặt tên token là MyTokenA với mã là MTA.
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint (tạo) ra 1 triệu token cho người deploy (địa chỉ msg.sender).
        // 10 ** decimals() để xử lý số lẻ token (mặc định là 18 chữ số thập phân như ETH).

        // msg.sender = Sender (0x04fbeC3Ac166Fea2ce157f74962eFe4C8aFf7891)
    }
}
