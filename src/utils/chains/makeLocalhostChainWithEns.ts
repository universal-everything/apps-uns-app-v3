import { Chain } from 'viem'

import type { Register } from '@app/local-contracts'

export const makeLocalhostChainWithEns = <T extends Chain>(
  localhost: T,
  deploymentAddresses_: Register['deploymentAddresses'],
) => {
  return {
    ...localhost,
    contracts: {
      ...localhost.contracts,
      ensRegistry: {
        address: deploymentAddresses_.ENSRegistry,
      },
      ensUniversalResolver: {
        address: deploymentAddresses_.UniversalResolver,
      },
      multicall3: {
        address: deploymentAddresses_.Multicall,
      },
      ensBaseRegistrarImplementation: {
        address: deploymentAddresses_.BaseRegistrarImplementation,
      },
      ensEthRegistrarController: {
        address: deploymentAddresses_.ETHRegistrarController,
      },
      ensPublicResolver: {
        address: deploymentAddresses_.PublicResolver,
      },
      ensReverseRegistrar: {
        address: deploymentAddresses_.ReverseRegistrar,
      },
      ensBulkRenewal: {
        address: deploymentAddresses_.StaticBulkRenewal,
      },
    },
    subgraphs: {
      ens: {
        url: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
      },
    },
  } as const
}
