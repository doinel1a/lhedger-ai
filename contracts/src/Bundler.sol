// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.28;

import { IV3SwapRouter } from "@uniswap/router/interfaces/IV3SwapRouter.sol";
import { IQuoterV2 } from "@uniswap/v3-periphery/interfaces/IQuoterV2.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Bundler {
    IERC20 public USDC = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    IV3SwapRouter public UNI_V3_Router = IV3SwapRouter(0x2626664c2603336E57B271c5C0b26F421741e481);
    IQuoterV2 public UNI_V3_Quoter = IQuoterV2(0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a);

    mapping(address user => address[] tokens) private userTokens;

    struct UserTokens {
        address token;
        uint8 decimals;
        uint256 balance;
    }

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

    function executeBatchSwaps(uint256 totalAmount, SwapUniV3[] calldata swaps) public {
        USDC.transferFrom(msg.sender, address(this), totalAmount);

        for (uint256 i; i < swaps.length; i++) {
            IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter.ExactInputSingleParams({
                tokenIn: address(USDC),
                tokenOut: swaps[i].tokenOut,
                fee: swaps[i].fee,
                recipient: msg.sender,
                amountIn: swaps[i].amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

            UNI_V3_Router.exactInputSingle(params);

            userTokens[msg.sender].push(swaps[i].tokenOut);
        }

        uint256 remainingAmount = USDC.balanceOf(address(this));
        if (remainingAmount > 0) {
            USDC.transfer(msg.sender, remainingAmount);
        }
    }

    function getUserTokens(address user) external view returns (UserTokens[] memory) {
        UserTokens[] memory tokens = new UserTokens[](userTokens[user].length);
        for (uint256 i = 0; i < userTokens[user].length; i++) {
            address token = userTokens[user][i];
            tokens[i] = UserTokens({
                token: token,
                decimals: IERC20Metadata(token).decimals(),
                balance: IERC20(token).balanceOf(user)
            });
        }
        return tokens;
    }
}
