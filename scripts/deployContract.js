const hre = require('hardhat')

async function main() {
  const WIHTS = await hre.ethers.getContractFactory('WIHTS')
  const wihts = await WIHTS.deploy()

  await wihts.deployed()

  console.log('WIHTS deployed to:', wihts.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
