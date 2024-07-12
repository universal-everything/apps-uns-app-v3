import { Address } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { goerli } from 'wagmi/chains'

import { useAddressRecord } from './ensjs/public/useAddressRecord'

const ORACLE_ENS = 'eth-usd.data.eth'

export const useEthPrice = () => {
  const chainId = useChainId()

  const { data: address_ } = useAddressRecord({
    name: ORACLE_ENS,
    enabled: chainId !== 4201,
  })

  const address = (address_?.value as Address) || undefined

  return useReadContract({
    abi: [
      {
        inputs: [],
        name: 'latestAnswer',
        outputs: [{ name: '', type: 'int256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    address,
    functionName: 'latestAnswer',
  })
}
