/* eslint-disable camelcase */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-extraneous-import */

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { BuyNFT, BuyNFT__factory } from "../typechain";
import { TradeToken__factory } from "../typechain/factories/TradeToken__factory";
import { TradeToken } from "../typechain/TradeToken";

const { utils } = ethers;

describe("BuyNFT Contract Testing", () => {
  let buyNFT: BuyNFT;
  let buyNFTFactory: BuyNFT__factory;
  let tradeToken: TradeToken;
  let tradeTokenFactory: TradeToken__factory;
  // account
  let owner: SignerWithAddress,
    account1: SignerWithAddress,
    account2: SignerWithAddress;

  before(async () => {
    buyNFTFactory = await ethers.getContractFactory("BuyNFT");
    tradeTokenFactory = await ethers.getContractFactory("TradeToken");

    [owner, account1, account2] = await ethers.getSigners();
  });

  beforeEach(async () => {
    tradeToken = await tradeTokenFactory.deploy("Le Huy Du", "LHD");
    await tradeToken.deployed();

    buyNFT = await buyNFTFactory.deploy(tradeToken.address, tradeToken.address);
    await buyNFT.deployed();

    await tradeToken.transfer(account1.address, utils.parseUnits("1000", 18));

    await tradeToken.transfer(account2.address, utils.parseUnits("1000", 18));
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
    const _ = {
      tokenURI: "https://github.com/dusainbolt",
      price,
      receiver: ownerNFT.address,
    };

    const messageHash = utils.solidityKeccak256(
      ["address", "string", "uint256", "address"],
      [buyer.address, _.tokenURI, _.price, _.receiver]
    );

    // Sign this message hash with private key and account address
    const signature = await web3.eth.sign(messageHash, owner.address);

    await tradeToken.connect(buyer).approve(buyNFT.address, price);

    await buyNFT
      .connect(buyer)
      .buyNFT(_.tokenURI, _.price, _.receiver, signature);

    expect(await tradeToken.balanceOf(ownerNFT.address)).equal(
      utils.parseUnits("1000", 18).add(price)
    );
    expect(await tradeToken.balanceOf(buyer.address)).equal(
      utils.parseUnits("1000", 18).sub(price)
    );
    expect(await buyNFT.ownerOf(1)).equal(buyer.address);
  });
});
