// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.28 <0.9.0;

import { Test } from "forge-std/src/Test.sol";
import { console2 } from "forge-std/src/console2.sol";
import { Bundler } from "src/Bundler.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract BaseTest is Test {
    Bundler public bundler;

    function setUp() public {
        vm.createSelectFork(vm.envString("FORK_URL"), 28_496_517);
        bundler = new Bundler();
    }

    function testCalculateBatchSwapUSDC() public {
        Bundler.SwapUniV3[] memory swaps = new Bundler.SwapUniV3[](2);
        swaps[0] = Bundler.SwapUniV3({ tokenOut: 0x4200000000000000000000000000000000000006, amountIn: 10e6, fee: 500 });
        swaps[1] =
            Bundler.SwapUniV3({ tokenOut: 0x532f27101965dd16442E59d40670FaF5eBB142E4, amountIn: 10e6, fee: 10_000 });

        uint256[] memory amounts = bundler.calculateBatchSwapUSDC(swaps);
        for (uint256 i = 0; i < amounts.length; i++) {
            console2.log("Amount out for swap %s: %s", i, amounts[i]);
        }

        address user = makeAddr("user");
        IERC20 usdc = bundler.USDC();
        vm.deal(user, 1e18);
        deal(address(usdc), user, 100e6, true);
        vm.startPrank(user);
        usdc.approve(address(bundler), 100e6);

        bundler.executeBatchSwaps(100e6, swaps);

        assertEq(usdc.balanceOf(user), 80e6);
        assertEq(bundler.getUserTokens(user).length, 2);
        assertEq(bundler.getUserTokens(user)[0].token, swaps[0].tokenOut);
        assertEq(bundler.getUserTokens(user)[1].token, swaps[1].tokenOut);

        console2.log("User USDC balance: %s", usdc.balanceOf(user));
        console2.log("User token 0 balance: %s", IERC20(swaps[0].tokenOut).balanceOf(user));
        console2.log("User token 1 balance: %s", IERC20(swaps[1].tokenOut).balanceOf(user));
    }
}
