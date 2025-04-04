// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.28;

import { ISwapRouter } from "@uniswap/v3-periphery/interfaces/ISwapRouter.sol";
import { IQuoterV2 } from "@uniswap/v3-periphery/interfaces/IQuoterV2.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Bundler {
    IERC20 public USDC = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    ISwapRouter public UNI_V3_Router = ISwapRouter(0x2626664c2603336E57B271c5C0b26F421741e481);
    IQuoterV2 public UNI_V3_Quoter = IQuoterV2(0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a);

    struct SwapUniV3 {
        address tokenOut;
        uint256 amountIn;
        uint24 fee;
    }

    constructor() {
        USDC.approve(address(UNI_V3_Router), type(uint256).max);
    }

    function calculateBatchSwapUSDC(SwapUniV3[] calldata swaps) external returns (uint256[] memory amountsOut) {
        amountsOut = new uint256[](swaps.length);
        for (uint256 i = 0; i < swaps.length; i++) {
            IQuoterV2.QuoteExactInputSingleParams memory params = IQuoterV2.QuoteExactInputSingleParams({
                tokenIn: address(USDC),
                tokenOut: swaps[i].tokenOut,
                amountIn: swaps[i].amountIn,
                fee: swaps[i].fee,
                sqrtPriceLimitX96: 0
            });

            (uint256 amount,,,) = UNI_V3_Quoter.quoteExactInputSingle(params);
            amountsOut[i] = amount;
        }
    }

    function executeBatchSwaps(uint256 amountIn, SwapUniV3[] calldata swaps) public {
        USDC.transferFrom(msg.sender, address(this), amountIn);

        for (uint256 i; i < swaps.length; i++) {
            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
                tokenIn: address(USDC),
                tokenOut: swaps[i].tokenOut,
                fee: swaps[i].fee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: swaps[i].amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

            UNI_V3_Router.exactInputSingle(params);
        }

        uint256 remainingAmount = USDC.balanceOf(address(this));
        if (remainingAmount > 0) {
            USDC.transfer(msg.sender, remainingAmount);
        }
    }
}
