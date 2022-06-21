import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'

import WIHTSLogo from '../WIHTSLogo'

const RPC_URL = "https://eth-mainnet.alchemyapi.io/v2/hkcJXETMjCy1AFTXMd1Cf3QaCcqPSa2J"

const injected = injectedModule()
const walletConnect = walletConnectModule()
const coinbaseWallet = coinbaseModule()

const initOnboard = init({
  wallets: [walletConnect, coinbaseWallet, injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum',
      rpcUrl: RPC_URL
    }
  ],
  appMetadata: {
    name: 'WIHTS',
    icon: WIHTSLogo,
    description: 'Wish I Had The Same is the first collection from Just Weirdos',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ],
  }
})

export { initOnboard }
