// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleDEX {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        console.log("msg.sender:", msg.sender);
        console.log("amountA:", amountA);
        console.log("amountB:", amountB);
        console.log("TokenA balance of DEX:", tokenA.balanceOf(address(this)));

        require(amountA > 0, "amountA must be > 0");
        require(amountB > 0, "amountB must be > 0");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(amountIn > 0, "amountIn must be > 0");
        require(reserveIn > 0 && reserveOut > 0, "Invalid reserves");

        // Không tính phí swap để đơn giản hóa
        return (amountIn * reserveOut) / (reserveIn + amountIn);
    }

    function swapAForB(uint256 amountAIn) external {
        require(amountAIn > 0, "amountAIn must be > 0");
        uint256 amountBOut = getAmountOut(amountAIn, reserveA, reserveB);
        require(amountBOut <= reserveB, "Not enough liquidity");

        tokenA.transferFrom(msg.sender, address(this), amountAIn);
        tokenB.transfer(msg.sender, amountBOut);

        reserveA += amountAIn;
        reserveB -= amountBOut;
    }

    function swapBForA(uint256 amountBIn) external {
        require(amountBIn > 0, "amountBIn must be > 0");
        uint256 amountAOut = getAmountOut(amountBIn, reserveB, reserveA);
        require(amountAOut <= reserveA, "Not enough liquidity");

        tokenB.transferFrom(msg.sender, address(this), amountBIn);
        tokenA.transfer(msg.sender, amountAOut);

        reserveB += amountBIn;
        reserveA -= amountAOut;
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }
}
