const config = require('../config.json')
const game_config = require('../game_config.json')
const hre = require("hardhat")

// join more than 8 times expect error : "game is full"
// if value = 0 expect error : "must pay to play"
async function main() {
  console.log("\ngame_2_join_game starting ...")
  let balance

  let daiTokenContractAddress = config['deployed']['daiTokenAddress']
  const DaiToken = await hre.ethers.getContractFactory("DaiToken")
  const daiTokenContract = await DaiToken.attach(daiTokenContractAddress)

  let dappTokenContractAddress = config['deployed']['dappTokenAddress']
  const DappToken = await hre.ethers.getContractFactory("DappToken")
  const dappTokenContract = await DappToken.attach(dappTokenContractAddress)

  let gameAddress = config['deployed']['gameAddress']
  const Game = await hre.ethers.getContractFactory("Game")
  const gameContract = await Game.attach(gameAddress)

  let accounts = await ethers.getSigners()
  let owner = accounts[0]
  let ownerAddressDisplay = [owner.address.substr(0, 4), owner.address.substr(38, 4)].join('...')
  balance = await owner.getBalance()
  console.log(`Owner ${ownerAddressDisplay} balance(ETH): ${ethers.utils.formatEther(balance)}`)
  balance = await daiTokenContract.balanceOf(owner.address)
  console.log(`Owner ${ownerAddressDisplay} balance(DaiToken): ${ethers.utils.formatUnits(balance, 6)}`)
  balance = await dappTokenContract.balanceOf(owner.address)
  console.log(`Owner ${ownerAddressDisplay} balance(DappToken): ${ethers.utils.formatUnits(balance, 6)}`)

  let player1Address = game_config['game_2_join_game']['player1Address']
  let player1Name = game_config['game_2_join_game']['player1Name']
  let player1Account = await hre.ethers.getSigner(player1Address)
  let player1AddressDisplay = [player1Address.substr(0, 4), player1Address.substr(38, 4)].join('...')

  balance = await player1Account.getBalance()
  console.log(`${player1Name} ${player1AddressDisplay} balance(ETH): ${ethers.utils.formatEther(balance)}`)
  balance = await daiTokenContract.balanceOf(player1Account.address)
  console.log(`${player1Name} ${player1AddressDisplay} balance(DaiToken): ${ethers.utils.formatUnits(balance, 6)}`)
  balance = await dappTokenContract.balanceOf(player1Account.address)
  console.log(`${player1Name} ${player1AddressDisplay} balance(DappToken): ${ethers.utils.formatUnits(balance, 6)}`)

  let value = game_config['game_2_join_game']['value_in_ether']
  const value_in_ether = ethers.utils.parseUnits(value.toString(), 'ether')
  const value_in_wei = ethers.utils.formatUnits(value_in_ether, 0)
  console.log('value_in_wei: ', value_in_wei)
  console.log('value_in_ether: ', Number(ethers.utils.formatEther( value_in_ether )))

  let transaction
  let tx

  transaction = await gameContract.connect(player1Account).joinGame({value: value_in_ether})
  tx = await transaction.wait()
  console.log("joinGame event:", tx.events)

  balance = await player1Account.getBalance()
  console.log(`${player1Name} ${player1AddressDisplay} balance(ETH): ${ethers.utils.formatEther(balance)}`)
  balance = await daiTokenContract.balanceOf(player1Account.address)
  console.log(`${player1Name} ${player1AddressDisplay} balance(DaiToken): ${ethers.utils.formatUnits(balance, 6)}`)
  balance = await dappTokenContract.balanceOf(player1Account.address)
  console.log(`${player1Name} ${player1AddressDisplay} balance(DappToken): ${ethers.utils.formatUnits(balance, 6)}`)

  console.log("\ngame_2_join_game completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
