// TODO: Delete after checking that useFaucet refactor works
// @ts-nocheck
import { useAccount, useChainId } from 'wagmi'

import type { uniqueTransactionIdentifierGenerator } from '@app/components/@molecules/TransactionDialogManager/stage/TransactionStageModal'
import { ResolverInterfaceName } from '@app/constants/resolverInterfaceIds'
import type { RegistrationProps } from '@app/hooks/useEstimateRegistration'
import type { TransactionItem } from '@app/transaction-flow/transaction'

export const useQueryKeys = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const globalKeys = [chainId, address]

  return {
    graphBase: [...globalKeys, 'graph'],
    dogfood: (inputString?: string) => [...globalKeys, 'getAddr', inputString, 'dogfood'],
    transactionStageModal: {
      prepareTransaction: (
        uniqueTransactionIdentifiers: ReturnType<typeof uniqueTransactionIdentifierGenerator>,
      ) => [...globalKeys, uniqueTransactionIdentifiers, 'prepareTransaction'],
      transactionError: (transactionHash?: string) => [
        ...globalKeys,
        transactionHash,
        'transactionError',
      ],
    },
    nameSnippet: (localAddress: string) => [...globalKeys, 'getName', localAddress, 'nameSnippet'],
    moonpayRegistration: (currentExternalTransactionId: string) => [
      ...globalKeys,
      'currentExternalTransactionId',
      currentExternalTransactionId,
      'moonpayRegistration',
    ],
    avatar: {
      avatar: (name: string | null | undefined) => [...globalKeys, 'getAvatar', name, 'avatar'],
      getNFTImage: (name: string | null | undefined) => [...globalKeys, name, 'getNFTImage'],
    },
    basicName: (normalisedName: string, skipGraph: boolean) => [
      ...globalKeys,
      'batch',
      'getOwner',
      'getExpiry',
      normalisedName,
      skipGraph,
      'basicName',
    ],
    basicNameRoot: (normalisedName: string) => [
      ...globalKeys,
      'batch',
      'getOwner',
      'getExpiry',
      normalisedName,
    ],
    beautifiedName: (name: string) => [...globalKeys, name, 'beautifiedName'],
    blockTimestamp: [...globalKeys, 'blockTimestamp'],
    currentBlockTimestamp: [...globalKeys, 'currentBlockTimestamp'],
    decryptName: (name: string) => [...globalKeys, 'graph', name, 'decryptName'],
    estimateGasLimitForTransactions: (transactions: TransactionItem[], extraKeys: string[]) => [
      ...globalKeys,
      ...transactions,
      ...extraKeys,
      'estimateGasLimitForTransactions',
    ],
    estimateRegistration: (data?: RegistrationProps) => [
      ...globalKeys,
      data,
      'estimateRegistration',
    ],
    ethPrice: [...globalKeys, 'ethPrice'],
    exists: (name: string) => [...globalKeys, 'getOwner', name, 'exists'],
    expiry: (name: string) => [...globalKeys, 'useExpiry', name, 'expiry'],
    faucet: (localAddress?: string) => [...globalKeys, localAddress, 'faucet'],
    getABI: (name: string) => [...globalKeys, name, 'getABI'],
    getHistory: (name: string) => [...globalKeys, 'graph', name, 'getHistory'],
    hasSubnames: (name: string) => [...globalKeys, 'graph', name, 'hasSubnames'],
    subnames: (name: string, orderBy = '', orderDirection = '', search = '') => [
      ...globalKeys,
      'graph',
      'getSubnames',
      name,
      orderBy,
      orderDirection,
      search,
    ],
    namesFromAddress: (localAddress?: string) => [
      ...globalKeys,
      'graph',
      'getNames',
      localAddress,
      'namesFromAddress',
    ],
    namesFromResolvedAddress: (resolvedAddress?: string) => [
      ...globalKeys,
      'graph',
      'getNames',
      resolvedAddress,
      'namesFromResolvedAddress',
    ],
    getPrice: (type: 'legacy' | 'new', names: string[]) => [
      ...globalKeys,
      type,
      ...names,
      'getPrice',
    ],
    primary: (localAddress: string) => [...globalKeys, 'getName', localAddress, 'primary'],
    profile: (name: string, resolverAddress?: string, skipGraph?: boolean) => [
      ...globalKeys,
      'graph',
      name,
      'profile',
      resolverAddress,
      skipGraph,
    ],
    registrationDate: (name: string) => [...globalKeys, 'graph', name, 'registrationDate'],
    getResolver: (name: string) => [...globalKeys, name, 'getResolver'],
    resolverExists: (name: string) => [
      ...globalKeys,
      'graph',
      'getResolver',
      name,
      'resolverExists',
    ],
    resolverHasInterfaces: (interfaceNames: string, resolverAddress?: string) => [
      ...globalKeys,
      'validateResolver',
      resolverAddress,
      interfaceNames,
      'resolverHasInterfaces',
    ],
    resolverSupportsInterfaces: (resolverAddress: string, interfaces: ResolverInterfaceName[]) => [
      ...globalKeys,
      'resolverSupportsInterfaces',
      'resolverAddress',
      resolverAddress,
      'interfaces',
      interfaces.join('-'),
    ],
    resolverIsAuthorized: (name: string, resolver: string) => [
      ...globalKeys,
      'resolverIsAuthorised',
      name,
      resolver,
    ],
    registryResolver: (name: string) => [...globalKeys, name, 'registryResolver'],
    resolverStatus: (
      name: string,
      options: { skip?: boolean; skipCompare?: boolean },
      profileResolverAddress?: string,
    ) => [...globalKeys, name, { profileResolverAddress, options }, 'resolverStatus'],
    reverseRegistryName: (accountAddress?: string) => [
      ...globalKeys,
      accountAddress,
      'reverseRegistryName',
    ],
    isSupportedTLD: (tld: string) => [...globalKeys, tld, 'isSupportedTLD'],
    validate: (input: string) => [...globalKeys, input, 'validate'],
    validateSubnameLabel: (validationName: string) => [
      ...globalKeys,
      'createSubname',
      'getOwner',
      validationName,
      'validateSubnameLabel',
    ],
    isSafeApp: (connectorId: string | undefined) => [...globalKeys, connectorId, 'isSafeApp'],
    simpleSearch: (query: string) => [...globalKeys, 'simpleSearch', query],
    simpleSearchBase: () => [...globalKeys, 'simpleSearch'],
    globalIndependent: {
      isSupportedTLD: (tld: string) => [tld, 'isSupportedTLD'],
      zorb: (input: string, type: string, bg: string, fg: string, accent: string) => [
        input,
        type,
        { bg, fg, accent },
        'zorb',
      ],
      gasCostJson: ['gasCostJson'],
      claimDomain: (name: string, syncWarning: boolean) => [
        'proverResult',
        name,
        syncWarning,
        'claimDomain',
      ],
    },
  }
}
