//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Game {
    string public name = "Game Dapp";
    uint256 currentGameId = 0;
    uint256 MAX_PLAYERS = 8;
    address payable public owner; 

    mapping(uint256 => mapping(address => uint256)) public playersOf;
    mapping(uint256 => uint) public pendingPlayers;
    mapping(uint256 => bool) public isEnrolling;
    mapping(uint256 => address[]) public winners;

    event RewardsWithdrew(address winner, uint amount);
    
    // 1. players join 
    // 2. someone starts game
    // 3. playyers cannot enroll 
    // 4. someone declare winners 
    // repeat 1. to 4.
    // 5. winner withdraw 
    constructor() {
        isEnrolling[currentGameId] = true;
        // user who is calling this function address
        owner = payable(msg.sender);
    }

    function startGameStopEnroll() public {
        require(isEnrolling[currentGameId] == true, "game already started");
        require(pendingPlayers[currentGameId] >= MAX_PLAYERS, "still waiting for more players");

        isEnrolling[currentGameId] = false;
    }

    function joinGame() public payable {
        require(isEnrolling[currentGameId] == true, "game has not started yet");
        require(MAX_PLAYERS > pendingPlayers[currentGameId], "game is full already");
        require(msg.value > 0, "Error: must pay to join game");

        playersOf[currentGameId][msg.sender] = msg.value;
        pendingPlayers[currentGameId] = pendingPlayers[currentGameId] + 1;
    }

    function countPlayers() public view returns (uint) {
        return pendingPlayers[currentGameId];
    }

    function declareWinner(address _winner) public {
        require(playersOf[currentGameId][_winner] > 0, "Error: player does not exist");
        winners[currentGameId].push(_winner);
        //start new game
        currentGameId = currentGameId + 1;
        isEnrolling[currentGameId] = true;
    }

    function withdraw(
        ) external {
        uint256 amount = playersOf[currentGameId][msg.sender];
        playersOf[currentGameId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit RewardsWithdrew(msg.sender, amount);
    }

    receive() payable external {
        // Send the fund to the owner of the contract.
        owner.transfer(address(this).balance);
    }    
}
