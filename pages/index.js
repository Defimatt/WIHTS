import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import { config } from '../dapp.config'
import { ethers } from 'ethers'
import Lottie from 'lottie-react'
import { Slider } from '@mui/material'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import waggle from '../public/images/waggle.json'
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const contract = require('../artifacts/contracts/WITHS.sol/WIHTS.json')
const web3 = createAlchemyWeb3("https://eth-mainnet.alchemyapi.io/v2/eNbi38XIt5PPjMmTVjGFHNZ-rDCMTtKP")

const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)

export default function Mint() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [status, setStatus] = useState(null)
  const [totalMinted, setTotalMinted] = useState(-1)
  const [freeMints, setFreeMints] = useState(-1)
  const [isMinting, setIsMinting] = useState(false)
  const [claimed, setIsClaimed] = useState(-1)
  const [claimable, setClaimable] = useState(-1)
  const [price, setPrice] = useState(-1)
  const [friendlyPrice, setFriendlyPrice] = useState(-1)
  const [mintAmount, setMintAmount] = useState(-1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [text, setText] = useState("")
  const [onboard, setOnboard] = useState(null)
  const [open, setOpen] = useState(false)

  const getTotalMinted = async () => {
    const totalMinted = await nftContract.methods.totalSupply().call()
    return totalMinted
  }

  const getFreeMints = async () => {
    const freeMints = await nftContract.methods.freeMints().call()
    return freeMints
  }

  const getPrice = async () => {
    const price = await nftContract.methods.price().call()

    setFriendlyPrice(ethers.utils.formatUnits(price))

    return price
  }

  const getClaimed = async (address) => {
    if (!address) return -1

    const claimed = await nftContract.methods.claimed(address).call()

    setClaimable(10 - claimed)
    setMintAmount(10 - claimed)

    return claimed
  }

  const mint = async () => {
    if (!provider) {
      return {
        success: false,
        status: 'Connect your wallet before minting'
      }
    }

    const signer = window.provider.getUncheckedSigner()

    try {
      const { hash } = await signer.sendTransaction({
        to: config.contractAddress,
        data: nftContract.methods.mint(mintAmount).encodeABI(),
        value: ethers.BigNumber.from("" + totalPrice).toHexString()
      })

      return {
        success: true,
        status: (
          <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">
            <p>✅ Check out your transaction on Etherscan:</p>
            <p>{`https://etherscan.io/tx/${hash}`}</p>
          </a>
        )
      }
    } catch (error) {
      return {
        success: false,
        status: '😞 Sorry, something went wrong: ' + error.message
      }
    }
  }

  useEffect(() => {
    setTotalPrice(price * (claimed == 0 ? mintAmount - 1 : mintAmount))
  }, [mintAmount])

  useEffect(() => {
    setText(`${claimed == 0 ? 'Your first one is free! ' : ''}Total cost: ${ethers.utils.formatUnits("" + totalPrice)} Eth.`)
  }, [totalPrice])

  useEffect(() => {
    setOnboard(initOnboard)
  }, [])

  useEffect(() => {
    setStatus(null)
    setClaimable(-1)
    setMintAmount(-1)
    async function updateClaimedStatus() {
      setIsClaimed(
        !wallet?.accounts[0]?.address
          ? false
          : await getClaimed(wallet?.accounts[0]?.address)
      )
    }

    updateClaimedStatus()

    if (!wallet?.provider) {
      window.provider = null
    } else {
      window.provider = new ethers.providers.Web3Provider(
        wallet.provider,
        'any'
      )
    }
  }, [wallet])

  useEffect(() => {
    const init = async () => {
      setTotalMinted(await getTotalMinted())
      setFreeMints(await getFreeMints())
      setPrice(await getPrice())
    }

    init()
  }, [])

  const mintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await mint()

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }

  return (
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <img
          src="/images/blur.jpeg"
          className="animate-pulse-slow absolute inset-auto block w-full min-h-screen object-cover"
        />

        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
          <div className="relative z-1 md:max-w-3xl w-full bg-gray-900/90 filter backdrop-blur-sm py-4 rounded-md px-2 md:px-10 flex flex-col items-center">
            {wallet && (
              <button
                className="absolute right-4 bg-indigo-600 transition duration-200 ease-in-out font-chalk border-2 border-[rgba(0,0,0,1)] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none px-4 py-2 rounded-md text-sm text-white tracking-wide uppercase"
                onClick={() =>
                  disconnect({
                    label: wallet.label
                  })
                }
              >
                Disconnect
              </button>
            )}
            <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-br  from-brand-green to-brand-blue bg-clip-text text-transparent mt-3">
              Wish I Had The Same
            </h1>
            <h3 className="text-sm text-pink-200 tracking-widest">
              {wallet?.accounts[0]?.address
                ? wallet?.accounts[0]?.address.slice(0, 8) +
                  '...' +
                  wallet?.accounts[0]?.address.slice(-4)
                : ''}
            </h3>

            <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
              <div className="relative w-full">
                <Lottie animationData={waggle} loop={true} />
              </div>
              <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                <div className="z-10 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md  w-full items-center justify-center text-white font-semibold">
                  <p>
                    {totalMinted == -1 ? (
                      <span className="text-brand-pink">Loading...</span>
                    ) : (
                      <span className="text-brand-pink">
                        {totalMinted} minted / 5,000
                      </span>
                    )}
                  </p>
                  <p>
                    {freeMints == -1 ? (
                      <span className="text-brand-pink">Loading...</span>
                    ) : (
                      <span className="text-brand-pink">
                        {freeMints} free mints / 2,000
                      </span>
                    )}
                  </p>
                  <p>
                    {friendlyPrice == -1 ? (
                      <span className="text-brand-pink">Loading...</span>
                    ) : (
                      <div>
                      <span className="text-brand-pink">
                        First one free, then {friendlyPrice} Eth each
                      </span>
                      </div>
                    )}
                  </p>
                </div>
                {/* Mint Button && Connect Wallet Button */}
                {wallet ? (
                  <div className="mt-14">
                    <p className="text-brand-pink">
                      You have minted {claimed == -1 ? '(Loading...)' : claimed}{' '}
                      out of 10, you can mint{' '}
                      {claimable == -1 ? '(Loading...)' : claimable}. (Tip: mint more in the same transaction to get gas savings!)
                    </p>
                  </div>
                ) : (
                  <button
                    className="mt-12 w-full bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg px-6 py-3 rounded-md text-2xl text-white hover:shadow-pink-400/50 mx-4 tracking-wide"
                    onClick={() => connect()}
                  >
                    Connect Wallet
                  </button>
                )}
                {claimable > 0 ? (
                  <Slider
                    defaultValue={claimable}
                    step={1}
                    marks
                    min={1}
                    max={claimable}
                    onChange={(event) => setMintAmount(event.target.value)}
                    css={css`
                      color: #6370e5;
                    `}
                    valueLabelDisplay="on"
                  />
                ) : claimable == 0 ? (
                  <div><p className="text-brand-pink">You have already claimed the maximum (thanks!)</p></div>
                ) : (<div></div>)}
                {claimable > 0 ? (
                  <div>
                  <p className="text-brand-pink">{text}</p>
                  <img src="/images/mint.png" onClick={mintHandler} style={{cursor: "pointer"}} />
                  </div>
                ) : (<div></div>)}

              </div>
            </div>

            {/* Status */}
            {status && (
              <div
                className={`border ${
                  status.success ? 'border-green-500' : 'border-brand-pink-400 '
                } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
              >
                <p className="flex flex-col space-y-2 text-white text-sm md:text-base break-words ...">
                  {status.message}
                </p>
              </div>
            )}

            <div className=" flex flex-col items-center  w-full">
              <a href="https://twitter.com/WishIHadTheSame"><img style={{width: "75px"}} src="images/twitter.png" /></a>
            </div>

            {/* Contract Address */}
            <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 w-full">
              <h3 className="text-2xl text-brand-pink mt-6">
                Contract Address
              </h3>
              <a
                href={`https://etherscan.io/address/${config.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 mt-4"
              >
                <span className="break-all ...">{config.contractAddress}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
