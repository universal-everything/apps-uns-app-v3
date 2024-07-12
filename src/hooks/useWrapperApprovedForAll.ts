import type { Address } from 'viem'

import { useApprovedForAll } from './useApprovedForAll'

type UseWrapperApprovedForAllParameters = {
  address: Address
  isSubname?: boolean
  canBeWrapped?: boolean
  enabled?: boolean
}

export const useWrapperApprovedForAll = ({
  address,
  isSubname,
  enabled = true,
}: UseWrapperApprovedForAllParameters) => {
  return useApprovedForAll({
    contract: 'ensRegistry',
    address,
    operatorContract: 'ensRegistry',
    enabled: enabled && isSubname,
  })
}
