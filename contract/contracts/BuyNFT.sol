// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuyNFT is ERC721URIStorage, ReentrancyGuard, Ownable {
    using ECDSA for bytes32;
    using SafeERC20 for IERC20;

    address tradeToken;

    // Event
    event BuySuccess(address buyer, uint256 tokenId);

    constructor(address _tradeToken) ERC721("Metaverse Tokens", "DUNFT") {
        tradeToken = _tradeToken;
    }

    function getTradeToken() public view returns (address) {
        return tradeToken;
    }

    function _verifyAllowance(address _sender, uint256 _amount) private view {
        IERC20 erc20Token = IERC20(tradeToken);
        uint256 allowance = erc20Token.allowance(_sender, address(this));
        require(allowance >= _amount, "BuyNFT::TOKEN_NOT_APPROVED");
    }

    function verifySignature(
        string memory _tokenURI,
        uint256 _tokenId,
        uint256 _price,
        address _receiver,
        bytes memory _signature
    ) public view returns (bool) {
        // This recreates the message hash that was signed on the client.
        bytes32 hash = keccak256(
            abi.encodePacked(msg.sender, _tokenURI, _tokenId, _price, _receiver)
        );
        bytes32 messageHash = hash.toEthSignedMessageHash();
        // Verify that the message's signer is the owner of the order
        return messageHash.recover(_signature) == owner();
    }

    function buyNFT(
        string memory _tokenURI,
        uint256 _tokenId,
        uint256 _price,
        address _receiver,
        bytes memory _signature
    ) public nonReentrant returns (uint256) {
        require(
            verifySignature(_tokenURI, _tokenId, _price, _receiver, _signature),
            "BuyNFT::INVALID_SIGNATURE"
        );
        _verifyAllowance(msg.sender, _price);

        _mint(msg.sender, _tokenId);

        _setTokenURI(_tokenId, _tokenURI);

        IERC20(tradeToken).transferFrom(msg.sender, _receiver, _price);

        emit BuySuccess(msg.sender, _tokenId);

        return _tokenId;
    }
}
