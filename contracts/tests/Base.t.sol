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
        swaps[0] = Bundler.SwapUniV3({
            tokenOut: 0x9e1028F5F1D5eDE59748FFceE5532509976840E0,
            amountIn: 4_361_280,
            fee: 10_000
        });
        swaps[1] =
            Bundler.SwapUniV3({ tokenOut: 0x3992B27dA26848C2b19CeA6Fd25ad5568B68AB98, amountIn: 5_605_013, fee: 100 });

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

        bundler.executeBatchSwaps(10e6, swaps);

        console2.log("User USDC balance: %s", usdc.balanceOf(user));
        console2.log("User token 0 balance: %s", IERC20(swaps[0].tokenOut).balanceOf(user));
        console2.log("User token 1 balance: %s", IERC20(swaps[1].tokenOut).balanceOf(user));
    }
}
