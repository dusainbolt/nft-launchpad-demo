// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat

import { ethers } from "hardhat";

// Runtime Environment's members available in the global scope.
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const buyNFTFactory = await ethers.getContractFactory("BuyNFT");
  const tradeTokenFactory = await ethers.getContractFactory("TradeToken");
  const stakeNFTFactory = await ethers.getContractFactory("StakingNFT");

  const tradeToken = await tradeTokenFactory.deploy("Le Huy Du", "LHD");
  await tradeToken.deployed();

  const buyNFT = await buyNFTFactory.deploy(tradeToken.address);
  await buyNFT.deployed();

  const stakeNFT = await stakeNFTFactory.deploy(
    tradeToken.address,
    buyNFT.address
  );
  await stakeNFT.deployed();

  console.log("BuyNFT deployed to:", buyNFT.address);
  console.log("TradeToken deployed to:", tradeToken.address);
  console.log("StakingNFT deployed to:", stakeNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
