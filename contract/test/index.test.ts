/* eslint-disable camelcase */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-extraneous-import */

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import {
  BuyNFT,
  BuyNFT__factory,
  StakingNFT,
  StakingNFT__factory,
} from "../typechain";
import { TradeToken__factory } from "../typechain/factories/TradeToken__factory";
import { TradeToken } from "../typechain/TradeToken";

const { time } = require("@openzeppelin/test-helpers");
const { utils } = ethers;

describe("BuyNFT Contract Testing", () => {
  let buyNFT: BuyNFT;
  let buyNFTFactory: BuyNFT__factory;
  let tradeToken: TradeToken;
  let tradeTokenFactory: TradeToken__factory;
  let stakeNFT: StakingNFT;
  let stakeNFTFactory: StakingNFT__factory;
  // account
  let owner: SignerWithAddress,
    account1: SignerWithAddress,
    account2: SignerWithAddress;

  before(async () => {
    buyNFTFactory = await ethers.getContractFactory("BuyNFT");
    tradeTokenFactory = await ethers.getContractFactory("TradeToken");
    stakeNFTFactory = await ethers.getContractFactory("StakingNFT");

    [owner, account1, account2] = await ethers.getSigners();
  });

  beforeEach(async () => {
    tradeToken = await tradeTokenFactory.deploy("Le Huy Du", "LHD");
    await tradeToken.deployed();

    buyNFT = await buyNFTFactory.deploy(tradeToken.address);
    await buyNFT.deployed();

    stakeNFT = await stakeNFTFactory.deploy(tradeToken.address, buyNFT.address);
    await stakeNFT.deployed();

    await tradeToken.transfer(account1.address, utils.parseUnits("1000", 18));

    await tradeToken.transfer(account2.address, utils.parseUnits("1000", 18));

    await tradeToken.faucet();
  });

  it("Should return the correct owner", async () => {
    expect(owner.address).equal(await buyNFT.owner());
  });

  it("Should return the correct trade token", async () => {
    expect(tradeToken.address).equal(await buyNFT.getTradeToken());
  });

  it("Should buy & mint NFT", async () => {
    const ownerNFT = account1;
    const buyer = account2;
    const price = utils.parseUnits("100", 18);
    await handleBuyNFT(ownerNFT, buyer, 1, price);

    expect(await tradeToken.balanceOf(ownerNFT.address)).equal(
      utils.parseUnits("1000", 18).add(price)
    );
    expect(await tradeToken.balanceOf(buyer.address)).equal(
      utils.parseUnits("1000", 18).sub(price)
    );
    expect(await buyNFT.ownerOf(1)).equal(buyer.address);
  });

  it("Should return correct when stake NFT", async () => {
    // buy NFT
    const ownerNFT = account1;
    const buyer = account2;
    const price = utils.parseUnits("100", 18);

    await handleBuyNFT(ownerNFT, buyer, 1, price);
    await handleStakeNFT(buyer, 1, price);

    expect(await buyNFT.ownerOf(1)).equal(stakeNFT.address);
    expect(await stakeNFT.balanceOf(buyer.address)).equal(price);
    expect(await stakeNFT.totalSupply()).equal(price);

    await time.increase(time.duration.seconds(10));
    await time.increase(time.duration.seconds(10));

    await handleBuyNFT(buyer, ownerNFT, 2, price);
    await handleStakeNFT(ownerNFT, 2, price);

    expect(await buyNFT.ownerOf(2)).equal(stakeNFT.address);
    expect(await stakeNFT.balanceOf(ownerNFT.address)).equal(price);
    expect(await stakeNFT.totalSupply()).equal(price.mul(2));

    await time.increase(time.duration.seconds(10));

    await handleBuyNFT(ownerNFT, buyer, 3, price);
    await handleStakeNFT(buyer, 3, price);

    expect(await stakeNFT.balanceOf(buyer.address)).equal(price.mul(2));
    expect(await stakeNFT.totalSupply()).equal(price.mul(3));
    expect(await buyNFT.ownerOf(3)).equal(stakeNFT.address);

    await time.increase(time.duration.seconds(10));

    await tradeToken.transfer(stakeNFT.address, utils.parseUnits("100000", 18));

    // user claim reward
    await stakeNFT.connect(buyer).claimReward();

    expect(await stakeNFT.rewards(buyer.address)).equal(0);

    await time.increase(time.duration.seconds(10));
    expect(await stakeNFT.earned(buyer.address)).gte(0);

    // owner withdrawn reward for user
    await stakeNFT.distributeReward(buyer.address);
    expect(await stakeNFT.rewards(buyer.address)).equal(0);

    // user unStake nft
    await stakeNFT.connect(buyer).unstake(3);
  });

  const handleStakeNFT = async (
    stakeHolder: SignerWithAddress,
    tokenId: number,
    price: any
  ) => {
    await buyNFT.connect(stakeHolder).setApprovalForAll(stakeNFT.address, true);

    const messageHash = utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      [stakeHolder.address, tokenId, price]
    );
    const signature = await web3.eth.sign(messageHash, owner.address);

    await stakeNFT.connect(stakeHolder).stake(tokenId, price as any, signature);
  };

  const handleBuyNFT = async (
    ownerNFT: SignerWithAddress,
    buyer: SignerWithAddress,
    tokenId: number,
    price: any
  ) => {
    const _ = {
      tokenURI: "https://github.com/dusainbolt",
      tokenId: tokenId,
      price,
      receiver: ownerNFT.address,
    };

    const messageHash = utils.solidityKeccak256(
      ["address", "string", "uint256", "uint256", "address"],
      [buyer.address, _.tokenURI, _.tokenId, _.price, _.receiver]
    );

    // Sign this message hash with private key and account address
    const signature = await web3.eth.sign(messageHash, owner.address);

    await tradeToken.connect(buyer).approve(buyNFT.address, _.price);

    await buyNFT
      .connect(buyer)
      .buyNFT(_.tokenURI, _.tokenId, _.price as any, _.receiver, signature);
  };
});
