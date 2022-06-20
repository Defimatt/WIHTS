require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')

async function main() {
  await hre.run('verify:verify', {
    address: '0x86e87aD210EC9e6939FedcC6d399748C3D686761',
    constructorArguments: []
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
