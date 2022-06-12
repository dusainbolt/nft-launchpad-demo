// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "hardhat/console.sol";

contract StakingNFT is ReentrancyGuard, Pausable, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;
    /* ========== STATE VARIABLES ========== */

    IERC20 public rewardToken;
    IERC721 public nftToken;

    uint256 public periodFinish = 0;
    uint256 public rewardRate = 1e17;

    // uint256 public rewardsDuration = 7 days;

    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    mapping(address => mapping(uint256 => uint256)) public stakeNftPrice;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    /* ========== EVENTS ========== */
    event Staked(address indexed stakeHolder, uint256 tokenId);
    event Unstaked(address indexed stakeHolder, uint256 tokenId);
    event RewardPaid(address indexed stakeHolder, uint256 reward);

    /* ========== CONSTRUCTOR ========== */

    constructor(address _rewardToken, address _nftToken) {
        rewardToken = IERC20(_rewardToken);
        nftToken = IERC721(_nftToken);
    }

    /* ========== VIEWS ========== */

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        // return block.timestamp < periodFinish ? block.timestamp : periodFinish;
        return block.timestamp;
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }

        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(_totalSupply)
            );
    }

    function earned(address account) public view returns (uint256) {
        return
            _balances[account]
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(1e18)
                .add(rewards[account]);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function verifySignature(
        uint256 _tokenId,
        uint256 _price,
        bytes memory _signature
    ) public view returns (bool) {
        // This recreates the message hash that was signed on the client.
        bytes32 hash = keccak256(
            abi.encodePacked(msg.sender, _tokenId, _price)
        );
        bytes32 messageHash = hash.toEthSignedMessageHash();
        // Verify that the message's signer is the owner of the order
        return messageHash.recover(_signature) == owner();
    }

    function stake(
        uint256 _tokenId,
        uint256 _price,
        bytes memory _signature
    ) external nonReentrant whenNotPaused updateReward(msg.sender) {
        require(_price > 0, "STAKE_NFT::PRICE_MUST_BE_THAN_0");
        require(
            verifySignature(_tokenId, _price, _signature),
            "STAKE_NFT::INVALID_SIGNATURE"
        );
        nftToken.transferFrom(msg.sender, address(this), _tokenId);

        _totalSupply = _totalSupply.add(_price);
        _balances[msg.sender] = _balances[msg.sender].add(_price);
        stakeNftPrice[msg.sender][_tokenId] = _price;

        emit Staked(msg.sender, _tokenId);
    }

    function unstake(uint256 _tokenId)
        public
        nonReentrant
        updateReward(msg.sender)
    {
        uint256 price = stakeNftPrice[msg.sender][_tokenId];
        require(price > 0, "STAKE_NFT::INVALID_TOKEN_ID");

        _totalSupply = _totalSupply.sub(price);

        _balances[msg.sender] = _balances[msg.sender].sub(price);

        nftToken.transferFrom(address(this), msg.sender, _tokenId);

        emit Unstaked(msg.sender, _tokenId);
    }

    function sendReward(address receiver) public {
        uint256 reward = rewards[receiver];
        if (reward > 0) {
            rewards[receiver] = 0;
            rewardToken.safeTransfer(receiver, reward);
            emit RewardPaid(receiver, reward);
        }
    }

    function claimReward() public nonReentrant updateReward(msg.sender) {
        sendReward(msg.sender);
    }

    function distributeReward(address receiver)
        public
        nonReentrant
        updateReward(receiver)
        onlyOwner
    {
        sendReward(receiver);
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
}
