const hre = require("hardhat")
const fs = require('fs')
const config = require('../config.json')

async function main() {
  const DaiToken = await hre.ethers.getContractFactory("DaiToken")
  console.log('Deploying DaiToken...')
  const daiToken = await DaiToken.deploy();
  await daiToken.deployed();
  console.log("DaiToken deployed to:", daiToken.address);

  const DappToken = await hre.ethers.getContractFactory("DappToken")
  console.log('Deploying DappToken...')
  const dappToken = await DappToken.deploy();
  await dappToken.deployed();
  console.log("DappToken deployed to:", dappToken.address);

  const Game = await hre.ethers.getContractFactory("Game");
  console.log('Deploying Game...')
  const game = await Game.deploy();
  await game.deployed();
  console.log("Game deployed to:", game.address);

  let contract_owner = config['chains'][hre.network.name]['contract_owner']
  let envChain = config['chains'][hre.network.name]['chain']

  let dappTokenAddress = dappToken.address
  let daiTokenAddress = daiToken.address
  let gameAddress = game.address

  config['deployed'] = {
    dappTokenAddress,
    daiTokenAddress,
    gameAddress,
    envChain,
    contract_owner
  }

  fs.writeFileSync('config.json', JSON.stringify(config, null, 4))
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
