import { Address } from 'viem'

import { BaseError } from '@ensdomains/ensjs'

import { addStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { createTransactionItem } from '@app/transaction-flow/transaction'

export type DnsNavigationFunction = (direction: 'prev' | 'next') => void

export type DnsAddressStatus = 'matching' | 'mismatching' | null

export const checkDnsError = ({
  error,
  isLoading,
}: {
  error: null | undefined
  isLoading: boolean
}) => {
  if (!error || isLoading) return null
  return 'unknown'
}

export const createImportTransactionRequests = ({
  address,
  name,
  requiresApproval,
  publicResolverAddress,
}: {
  address: Address
  name: string
  requiresApproval: boolean
  publicResolverAddress: Address
}) => {
  const createApproveTx = () =>
    createTransactionItem('approveDnsRegistrar', {
      address,
    })
  const createClaimTx = () =>
    createTransactionItem('claimDnsName', {
      name,
      dnsImportData,
      address,
    })
  const createImportTx = () =>
    createTransactionItem('importDnsName', {
      name,
      dnsImportData,
    })

  if (dnsOwnerStatus === 'matching') {
    const claimTx = createClaimTx()
    if (requiresApproval) {
      const claimTxWithOverride = addStateOverride({
        item: claimTx,
        stateOverride: [
          {
            address: publicResolverAddress,
            stateDiff: [
              // `_operatorApprovals[owner][dnsRegistrarAddress] = true`
              {
                slot: 11,
                keys: [address, dnsRegistrarAddress],
                value: true,
              },
            ],
          },
        ],
      })
      const approvalTx = createApproveTx()
      return {
        transactions: [approvalTx, claimTx],
        estimators: [approvalTx, claimTxWithOverride],
      } as const
    }
    return { transactions: [claimTx] } as const
  }
  return { transactions: [createImportTx()] } as const
}
