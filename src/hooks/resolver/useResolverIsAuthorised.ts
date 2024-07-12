import { useMemo } from 'react'
import { encodeFunctionData, namehash } from 'viem'
import { useConnectorClient, useEstimateGas } from 'wagmi'

import { publicResolverSetAddrSnippet } from '@ensdomains/ensjs/contracts'

import { useProfile } from '@app/hooks/useProfile'
import { emptyAddress } from '@app/utils/constants'
import { getIsCachedData } from '@app/utils/getIsCachedData'

import { useResolverHasInterfaces } from '../useResolverHasInterfaces'

type UseResolverIsAuthorisedParameters = {
  name: string

  enabled?: boolean
}

export const useResolverIsAuthorised = ({
  name,
  enabled: enabled_ = true,
}: UseResolverIsAuthorisedParameters) => {
  const enabled = enabled_ && !!name

  const connector = useConnectorClient()

  const profile = useProfile({
    name,
    enabled,
  })
  const resolverAddress = profile.data?.resolverAddress

  const isDependentDataLoading = profile.isLoading || connector.isLoading

  const {
    data: [resolverSupportsMultiAddress] = [false],
    knownResolverData,
    isLoading: isResolverHasInterfacesLoading,
    isFetching: isResolverHasInterfacesFetching,
    isCachedData: isResolverHasInterfacesCachedData,
  } = useResolverHasInterfaces({
    interfaceNames: ['MultiCoinAddressResolver'],
    resolverAddress: resolverAddress!,
    enabled: enabled && !isDependentDataLoading && !!resolverAddress,
  })
  const estimateGasQuery = useEstimateGas({
    to: resolverAddress,
    account: connector.data?.account,
    data: encodeFunctionData({
      abi: publicResolverSetAddrSnippet,
      args: [namehash(name), 60n, emptyAddress],
    }),

    query: {
      retry: 0,
      enabled:
        enabled &&
        !isDependentDataLoading &&
        !knownResolverData &&
        resolverSupportsMultiAddress &&
        !!resolverAddress,
    },
  })

  const {
    data: estimateGasData,
    isLoading: isEstimateGasLoading,
    isError: isEstimateGasError,
    isFetching: isEstimateGasFetching,
  } = estimateGasQuery

  const isLoading = isDependentDataLoading || isResolverHasInterfacesLoading || isEstimateGasLoading

  const data = useMemo(() => {
    if (!enabled || isLoading) return undefined
    if (!resolverSupportsMultiAddress) return { isValid: false, isAuthorised: false }
    if (knownResolverData)
      return {
        isValid: true,
        isAuthorised: true,
      }
    return {
      isValid: true,
      isAuthorised: !isEstimateGasError && estimateGasData !== undefined && estimateGasData > 0n,
    }
  }, [
    enabled,
    isLoading,
    resolverSupportsMultiAddress,
    knownResolverData,
    isEstimateGasError,
    estimateGasData,
  ])

  return {
    data,
    isLoading,
    isFetching: profile.isFetching || isResolverHasInterfacesFetching || isEstimateGasFetching,
    isCachedData:
      profile.isCachedData ||
      isResolverHasInterfacesCachedData ||
      getIsCachedData(estimateGasQuery),
  }
}
