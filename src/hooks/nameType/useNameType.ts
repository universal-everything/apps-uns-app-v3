import { useMemo } from 'react'

import { useContractAddress } from '../chain/useContractAddress'
import { useBasicName } from '../useBasicName'
import { getNameType, NameType } from './getNameType'

type Options = {
  enabled?: boolean
}

export const useNameType = (name: string, options: Options = {}) => {
  const enabled = options.enabled ?? true

  const basicName = useBasicName({ name, enabled })

  const { isLoading, isCachedData } = basicName

  const data: NameType | undefined = useMemo(() => {
    if (isLoading) return undefined
    return getNameType({
      name,
      ownerData: basicName.ownerData!,
      pccExpired: basicName.pccExpired,
      registrationStatus: basicName.registrationStatus,
    })
  }, [isLoading, name, basicName.ownerData, basicName.pccExpired, basicName.registrationStatus])

  return {
    data,
    isLoading,
    isCachedData,
  }
}
