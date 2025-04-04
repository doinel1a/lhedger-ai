// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.28 <0.9.0;

import { Test } from "forge-std/src/Test.sol";
import { console2 } from "forge-std/src/console2.sol";
import { Bundler } from "src/Bundler.sol";

/// @dev If this is your first time with Forge, read this tutorial in the Foundry Book:
/// https://book.getfoundry.sh/forge/writing-tests
contract BaseTest is Test {
    Bundler public bundler;

    function setUp() public {
        vm.createSelectFork(vm.envString("FORK_URL"), 28_496_517);
        bundler = new Bundler();
    }

    function testCalculateBatchSwapUSDC() public {
        Bundler.SwapUniV3[] memory swaps = new Bundler.SwapUniV3[](2);
        swaps[0] = Bundler.SwapUniV3({ tokenOut: 0x4200000000000000000000000000000000000006, amountIn: 1e18, fee: 500 });
        swaps[1] =
            Bundler.SwapUniV3({ tokenOut: 0x532f27101965dd16442E59d40670FaF5eBB142E4, amountIn: 1e18, fee: 10_000 });

        uint256[] memory amounts = bundler.calculateBatchSwapUSDC(swaps);
        for (uint256 i = 0; i < amounts.length; i++) {
            console2.log("Amount out for swap %s: %s", i, amounts[i]);
        }
    }
}
